
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("GEMINI_API_KEY not found")
else:
    genai.configure(api_key=api_key)
    with open("models_list.txt", "w", encoding="utf-8") as f:
        f.write("Available models:\n")
        for m in genai.list_models():
            f.write(f"{m.name} (Methods: {m.supported_generation_methods})\n")
    print("Models listed in models_list.txt")
