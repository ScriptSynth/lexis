import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def diagnose():
    print("Diagnosing Data Integrity...")
    
    # 1. Check if source_id column exists in news_items
    try:
        # Try to select source_id
        res = supabase.table("news_items").select("id, title, source_name, source_id").limit(1).execute()
        print("Column 'source_id' exists in news_items.")
        if res.data:
            print(f"Sample row: {res.data[0]}")
            if res.data[0].get('source_id') is None:
                print("WARNING: source_id is NULL.")
            else:
                print("source_id is populated.")
        else:
            print("news_items table is empty.")
            
    except Exception as e:
        print(f"Error selecting source_id (likely column missing): {e}")

    # 2. Check Sources
    print("\nChecking Sources...")
    res = supabase.table("sources").select("id, source_name").execute()
    sources = {s['source_name']: s['id'] for s in res.data}
    print(f"Found {len(sources)} sources: {list(sources.keys())}")

    # 3. Check for mismatches
    print("\nChecking Mismatches...")
    res = supabase.table("news_items").select("source_name").execute()
    news_source_names = set(item['source_name'] for item in res.data)
    
    for name in news_source_names:
        if name in sources:
            print(f"MATCH: '{name}' matches source ID {sources[name]}")
        else:
            print(f"MISMATCH: '{name}' in news_items but NOT in sources table")

if __name__ == "__main__":
    diagnose()
