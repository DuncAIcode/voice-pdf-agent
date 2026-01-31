import requests
import json

def verify_mapping():
    url = "http://localhost:8000/generate-form-data"
    
    # We use a known document_id from the database
    # This ID corresponds to sample_form.pdf uploaded earlier
    document_id = "e68960a4-d922-4217-ba6e-c5db6177894a"
    
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
    
    print("Testing Phase 2: AI-Driven Mapping...")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload)
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
    verify_mapping()
