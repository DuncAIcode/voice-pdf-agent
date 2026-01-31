import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

def check_supabase():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    
    if not url or not key:
        print("Error: SUPABASE_URL or SUPABASE_KEY not found in .env")
        return

    try:
        supabase: Client = create_client(url, key)
        
        tables = ["documents", "form_fields", "transcriptions"]
        for table in tables:
            try:
                res = supabase.table(table).select("*", count="exact").limit(1).execute()
                print(f"Table '{table}' exists.")
            except Exception as e:
                print(f"Table '{table}' error: {e}")
                
    except Exception as e:
        print(f"Failed to connect to Supabase: {e}")

if __name__ == "__main__":
    check_supabase()
