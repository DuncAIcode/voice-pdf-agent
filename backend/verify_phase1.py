import requests
import os

def verify_upload():
    url = "http://localhost:8000/upload-pdf"
    file_path = r"c:\Users\db4sa\Desktop\ANTIGRAVITY\Voice recorder\backend\uploads\sample_form.pdf"
    
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    with open(file_path, "rb") as f:
        files = {"file": f}
        try:
            response = requests.post(url, files=files)
            print(f"Status Code: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print("Upload Successful!")
                print(f"Document ID: {data.get('document_id')}")
                print(f"Fields Count: {data.get('fields_count')}")
                print(f"Message: {data.get('message')}")
            else:
                print(f"Error: {response.text}")
        except Exception as e:
            print(f"Exception: {str(e)}")

if __name__ == "__main__":
    verify_upload()
