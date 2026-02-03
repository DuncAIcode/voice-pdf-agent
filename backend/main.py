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
from services.doc_service import DocService
from services.audio_service import AudioService
from services.llm_service import LLMService
from supabase import create_client, Client

load_dotenv()

BYPASS_AUTH = True # TEMPORARY BYPASS FOR MANUAL TESTING - SET TO FALSE BEFORE PRODUCTION

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
doc_service = DocService()
audio_service = AudioService()
llm_service = LLMService()

# Supabase initialization
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def get_token(authorization: Optional[str] = Header(None)):
    if not authorization:
        if BYPASS_AUTH:
            return "null"
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    if not authorization.startswith("Bearer "):
        if BYPASS_AUTH:
            return "null"
        raise HTTPException(status_code=401, detail="Invalid Authorization Header Format")
    return authorization.split(" ")[1]

# Removed redundant get_authenticated_client

def get_user_id(token: str = Depends(get_token)):
    if BYPASS_AUTH and (token == "null" or token == "" or not token):
        return "6355b5c6-2e37-4f1c-bec0-84681980738b"
    user = supabase.auth.get_user(token)
    if not user or not user.user:
        raise HTTPException(status_code=401, detail="Invalid Token")
    return user.user.id

def get_optional_token(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        return authorization.split(" ")[1]
    return None

def get_authenticated_client(token: Optional[str] = Depends(get_optional_token)):
    if BYPASS_AUTH and (not token or token == "null"):
        return supabase
    if not token:
        raise HTTPException(status_code=401, detail="Missing Authorization Header")
    client = create_client(supabase_url, supabase_key)
    client.postgrest.auth(token)
    return client

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
    """Serve PDF or DOCX files for download or viewing"""
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    if filename.endswith(".pdf"):
        media_type = "application/pdf"
    elif filename.endswith(".docx"):
        media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type for download")
    
    return FileResponse(
        path=file_path,
        media_type=media_type,
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

@app.post("/upload-document")
async def upload_document(file: UploadFile = File(...), client: Client = Depends(get_authenticated_client), user_id: str = Depends(get_user_id)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Extract fields based on file type
        file_ext = file.filename.lower()
        if file_ext.endswith(".pdf"):
            fields = pdf_service.extract_fields(file_path)
        elif file_ext.endswith(".docx"):
            fields = doc_service.extract_fields(file_path)
        elif file_ext.endswith(".doc"):
            # We can't process legacy .doc, so we return empty and let user know later
            # Or we could raise a specific error here. Let's raise an informative error.
            raise HTTPException(
                status_code=400, 
                detail="Legacy .doc format detected. Please save as .docx to use AI Template features."
            )
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please use PDF or DOCX.")
            
        # Store in Supabase with user_id
        doc_res = client.table("documents").insert({
            "original_name": file.filename,
            "file_path": file_path,
            "user_id": user_id
        }).execute()
        
        if not doc_res.data:
            raise Exception("Failed to create document record in Supabase")
            
        document_id = doc_res.data[0]["id"]
        
        # Store form fields
        field_records = []
        for field in fields:
            field_records.append({
                "document_id": document_id,
                "field_name": field["name"],
                "field_label": field["label"],
                "field_type": field["type"],
                "page_number": field.get("page", 1),
                "coordinates": field.get("coordinates")
            })
            
        if field_records:
            client.table("form_fields").insert(field_records).execute()
            
        return {
            "document_id": document_id,
            "filename": file.filename, 
            "fields_count": len(fields),
            "message": "Document uploaded and fields extracted successfully"
        }
    except Exception as e:
        print(f"Error in upload_document: {str(e)}")
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

@app.post("/fill-document")
async def fill_document(request: dict, client: Client = Depends(get_authenticated_client), user_id: str = Depends(get_user_id)):
    try:
        filename = request.get("filename")
        form_data = request.get("data", {})
        
        if not filename or not form_data:
            raise HTTPException(status_code=400, detail="Missing filename or data")
        if not filename.endswith((".pdf", ".docx")):
            raise HTTPException(status_code=400, detail="Unsupported file format")

        input_path = os.path.join(UPLOAD_DIR, filename)
        if not os.path.exists(input_path):
             raise HTTPException(status_code=404, detail="File not found")

        output_filename = f"filled_{filename}"
        output_path = os.path.join(UPLOAD_DIR, output_filename)

        if filename.endswith(".pdf"):
            success = pdf_service.fill_pdf(input_path, form_data, output_path)
        else:
            success = doc_service.fill_docx(input_path, form_data, output_path)
        
        if success:
            client.table("documents").insert({
                "original_name": output_filename,
                "file_path": output_path,
                "user_id": user_id
            }).execute()
            return {"message": "Document filled successfully", "filled_filename": output_filename}
        else:
             raise HTTPException(status_code=500, detail="Failed to fill document")
    except Exception as e:
         print(f"Error in fill_document: {str(e)}")
         raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze-document")
async def analyze_document(request: dict, client: Client = Depends(get_authenticated_client)):
    try:
        filename = request.get("filename")
        if not filename:
            raise HTTPException(status_code=400, detail="Missing filename")
        
        file_path = os.path.join(UPLOAD_DIR, filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
            
        suggestions = doc_service.analyze_document(file_path)
        return {"suggestions": suggestions}
    except Exception as e:
        print(f"Error in analyze_document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/extract-preview")
async def extract_preview(request: dict, client: Client = Depends(get_authenticated_client)):
    try:
        filename = request.get("filename")
        if not filename:
            raise HTTPException(status_code=400, detail="Missing filename")
        
        file_path = os.path.join(UPLOAD_DIR, filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="File not found")
            
        html = doc_service.get_document_preview(file_path)
        return {"html": html}
    except Exception as e:
        print(f"Error in extract_preview: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/transform-template")
async def transform_template(request: dict, client: Client = Depends(get_authenticated_client), user_id: str = Depends(get_user_id)):
    try:
        filename = request.get("filename")
        replacements = request.get("replacements", []) # List[{"original_text": "...", "tag_name": "..."}]
        
        if not filename or not replacements:
            raise HTTPException(status_code=400, detail="Missing filename or replacements")
            
        input_path = os.path.join(UPLOAD_DIR, filename)
        if not os.path.exists(input_path):
            raise HTTPException(status_code=404, detail="File not found")
            
        # Create a new template file
        new_filename = f"template_{filename}"
        output_path = os.path.join(UPLOAD_DIR, new_filename)
        
        success = doc_service.transform_template(input_path, output_path, replacements)
        
        if success:
            # Store the new template in Supabase
            doc_res = client.table("documents").insert({
                "original_name": new_filename,
                "file_path": output_path,
                "user_id": user_id
            }).execute()
            
            if not doc_res.data:
                 raise Exception("Failed to create template record in Supabase")
                 
            document_id = doc_res.data[0]["id"]
            
            # Extract and store fields from the newly created template
            fields = doc_service.extract_fields(output_path)
            field_records = []
            for field in fields:
                field_records.append({
                    "document_id": document_id,
                    "field_name": field["name"],
                    "field_label": field["label"],
                    "field_type": field["type"],
                    "page_number": field.get("page", 1)
                })
                
            if field_records:
                client.table("form_fields").insert(field_records).execute()
                
            return {
                "message": "Template transformed and saved successfully",
                "document_id": document_id,
                "filename": new_filename
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to transform template")
    except Exception as e:
        print(f"Error in transform_template: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
