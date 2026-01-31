import requests
import time
import sys

BASE_URL = "http://localhost:8000"

def test_health():
    print(f"Testing Health Endpoint at {BASE_URL}/health ...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Health Check Passed!")
            return True
        else:
            print(f"❌ Health Check Failed: {response.status_code} - {response.text}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Is it running?")
        return False

def wait_for_server(timeout=60):
    print(f"Waiting for server for {timeout} seconds...")
    start_time = time.time()
    while time.time() - start_time < timeout:
        if test_health():
            return True
        time.sleep(2)
    print("❌ Server timed out.")
    return False

if __name__ == "__main__":
    if wait_for_server():
        print("\n🚀 Backend is UP and READY for verification!")
        # Add more tests here if needed, e.g. checking /docs
        try:
            docs = requests.get(f"{BASE_URL}/docs")
            if docs.status_code == 200:
                 print("✅ API Documentation (Swagger UI) is accessible.")
        except:
             print("⚠️  Could not check API docs.")
    else:
        sys.exit(1)
