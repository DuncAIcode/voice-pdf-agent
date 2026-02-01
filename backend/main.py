from fastapi import FastAPI, UploadFile, File, HTTPException, Header, Depends
from typing import Optional
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import os
import shutil
from dotenv import load_dotenv
from services.pdf_service import PDFService
from services.audio_service import AudioService
from services.llm_service import LLMService
from supabase import create_client, Client

load_dotenv()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
pdf_service = PDFService()
audio_service = AudioService()
llm_service = LLMService()

# Supabase initialization
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def get_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization Header Format")
    return authorization.split(" ")[1]

def get_authenticated_client(token: str = Depends(get_token)):
    # Create a new client instance with the user's token to respect RLS
    # We pass the user's JWT as the Authorization header so Postgres sees auth.uid()
    client = create_client(supabase_url, supabase_key)
    client.postgrest.auth(token)
    return client

def get_user_id(token: str = Depends(get_token)):
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Invalid Token")
    return user.user.id

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files for PDF serving
app.mount("/files", StaticFiles(directory=UPLOAD_DIR), name="files")

@app.get("/")
def read_root():
    return {"message": "Voice Recorder Agent Backend API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/download/{filename}")
async def download_file(filename: str):
    """Serve PDF files for download or viewing"""
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    if not filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files can be downloaded")
    
    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename,
        headers={
            "Content-Disposition": f'inline; filename="{filename}"'
        }
    )

@app.get("/documents")
async def list_documents(client: Client = Depends(get_authenticated_client)):
    try:
        # Fetch from Supabase using authenticated client (RLS applies)
        res = client.table("documents").select("*").order("created_at", desc=True).execute()
        db_docs = res.data if res.data else []
        
        docs = []
        for d in db_docs:
            docs.append({
                "id": d["id"],
                "filename": d["original_name"],
                "is_filled": d["original_name"].startswith("filled_"),
                "created_at": d["created_at"]
            })
        return docs
    except Exception as e:
        print(f"Error listing documents: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...), client: Client = Depends(get_authenticated_client), user_id: str = Depends(get_user_id)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extract fields using PyMuPDF (fitz)
        fields = pdf_service.extract_fields(file_path)
        
        # Store in Supabase with user_id
        # 1. Create document record
        doc_res = client.table("documents").insert({
            "original_name": file.filename,
            "file_path": file_path,
            "user_id": user_id
        }).execute()
        
        if not doc_res.data:
            print(f"Supabase Error: {doc_res}")
            raise Exception("Failed to create document record in Supabase")
            
        document_id = doc_res.data[0]["id"]
        
        # 2. Store form fields
        field_records = []
        for field in fields:
            field_records.append({
                "document_id": document_id,
                "field_name": field["name"],
                "field_label": field["label"],
                "field_type": field["type"],
                "page_number": field["page"],
                "coordinates": field["coordinates"]
            })
            
        if field_records:
            client.table("form_fields").insert(field_records).execute()
            
        return {
            "document_id": document_id,
            "filename": file.filename, 
            "fields_count": len(fields),
            "message": "PDF uploaded and fields extracted successfully"
        }
    except Exception as e:
        print(f"Error in upload_pdf: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/documents/{document_id}")
async def delete_document(document_id: str, client: Client = Depends(get_authenticated_client)):
    try:
        # 1. Get document path to delete file from disk (optional but good practice)
        # We need to select it first to get the path. RLS ensures we only find it if we own it.
        res = client.table("documents").select("file_path, original_name").eq("id", document_id).execute()
        
        if not res.data:
            raise HTTPException(status_code=404, detail="Document not found or access denied")
            
        doc = res.data[0]
        file_path = doc.get("file_path")
        
        # 2. Delete from Supabase (Cascade should handle form_fields if configured, otherwise we delete doc)
        client.table("documents").delete().eq("id", document_id).execute()
        
        # 3. Delete from disk
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"Deleted file: {file_path}")
            except Exception as e:
                print(f"Failed to delete physical file: {e}")

        return {"message": "Document deleted successfully"}

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error deleting document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...), token: str = Depends(get_token)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        transcript_segments = audio_service.transcribe(file_path)
        full_text = " ".join([seg['text'] for seg in transcript_segments])
        
        # We need the PDF fields to map to. For now, we'll assume a workflow where the user
        # has uploaded a PDF previously or passes the fields.
        # Ideally, we store the fields in the DB associated with a document_id.
        # For simplicity in this step, we will return the transcript and let the frontend trigger mapping,
        # OR we can stub the mapping if we don't have fields yet.
        
        return {
            "filename": file.filename, 
            "transcript_segments": transcript_segments, 
            "full_text": full_text,
            "message": "Audio transcribed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-form-data")
async def generate_form_data(request: dict, client: Client = Depends(get_authenticated_client)):
    # Expects { "text": "...", "fields": [...] }
    try:
        text = request.get("text", "")
        fields = request.get("fields", [])
        document_id = request.get("document_id")
        
        # If document_id is provided, fetch fields from Supabase
        if document_id and not fields:
            # RLS will filter by document ownership because form_fields policy checks document ownership
            res = client.table("form_fields").select("*").eq("document_id", document_id).execute()
            if res.data:
                fields = res.data
        
        if not fields:
             return {"mapped_data": {"mappings": {}, "field_metadata": {}}, "message": "No fields provided or found for mapping"}

        mapped_data = await llm_service.map_transcription_to_fields(text, fields)
        return {"mapped_data": mapped_data}
    except Exception as e:
        print(f"Error in generate_form_data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/fill-pdf")
async def fill_pdf(request: dict, client: Client = Depends(get_authenticated_client), user_id: str = Depends(get_user_id)):
    # Expects { "filename": "...", "data": { "Field1": "Value1" } }
    try:
        filename = request.get("filename")
        form_data = request.get("data", {})
        
        if not filename or not form_data:
            raise HTTPException(status_code=400, detail="Missing filename or data")

        input_path = os.path.join(UPLOAD_DIR, filename)
        if not os.path.exists(input_path):
             raise HTTPException(status_code=404, detail="File not found")

        output_filename = f"filled_{filename}"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        success = pdf_service.fill_pdf(input_path, form_data, output_path)
        
        if success:
            # Create a document record for the filled PDF
            try:
                client.table("documents").insert({
                    "original_name": output_filename,
                    "file_path": output_path,
                    "user_id": user_id
                }).execute()
            except Exception as e:
                print(f"Warning: Failed to save filled document record to DB: {e}")
                # We don't fail the request, but it won't show in the list
                
            return {"message": "PDF filled successfully", "filled_filename": output_filename}
        else:
             raise HTTPException(status_code=500, detail="Failed to fill PDF")

    except HTTPException as he:
        raise he
    except Exception as e:
         raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
