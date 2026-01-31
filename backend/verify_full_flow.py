import requests
import os
import json

def verify_full_flow():
    # 1. Upload PDF
    upload_url = "http://localhost:8000/upload-pdf"
    file_path = r"c:\Users\db4sa\Desktop\ANTIGRAVITY\Voice recorder\backend\uploads\sample_form.pdf"
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    print("--- Step 1: Uploading PDF ---")
    with open(file_path, "rb") as f:
        files = {"file": f}
        response = requests.post(upload_url, files=files)
        if response.status_code != 200:
            print(f"Upload failed: {response.text}")
            return
        
        upload_data = response.json()
        document_id = upload_data.get("document_id")
        print(f"Upload Successful! Document ID: {document_id}")

    # 2. Map Transcription
    mapping_url = "http://localhost:8000/generate-form-data"
    transcription = """
    Hi, I'm here to fill out the form. My name is John Smith. 
    I think for the dropdown option I'll go with the second one.
    Also, for the dependent field part, I have a daughter named Emily who is 5 years old.
    And yes, I agree to the terms on option 1.
    """
    
    payload = {
        "text": transcription,
        "document_id": document_id
    }
    
    print("\n--- Step 2: Mapping Transcription ---")
    try:
        response = requests.post(mapping_url, json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("Mapping Successful!")
            print(json.dumps(data, indent=2))
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Connection Error: {e}")

if __name__ == "__main__":
    verify_full_flow()
