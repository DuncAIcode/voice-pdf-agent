
import os
import google.generativeai as genai
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("GEMINI_API_KEY not found")
else:
    genai.configure(api_key=api_key)
    model_name = 'gemini-1.5-flash'
    model = genai.GenerativeModel(model_name)
    
    print(f"Testing text generation with {model_name}...")
    try:
        response = model.generate_content("Hello, can you hear me?")
        print(f"Text Response: {response.text}")
    except Exception as e:
        print(f"Text Error: {e}")

    # Create a dummy audio file for testing if necessary, or use an existing one
    # For now, let's just try to list the models properly and see the supported methods
    print("\nListing models and supported methods...")
    for m in genai.list_models():
        if model_name in m.name:
            print(f"Model Name: {m.name}")
            print(f"Supported methods: {m.supported_generation_methods}")
