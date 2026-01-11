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

def check_db():
    print("Checking Database Counts...")
    
    # Check Sources
    try:
        res = supabase.table("sources").select("*", count="exact").execute()
        print(f"Sources Count: {len(res.data)}")
        if len(res.data) > 0:
            print(f"Sample Source: {res.data[0].get('source_name')} - {res.data[0].get('logo_url')}")
    except Exception as e:
        print(f"Error checking sources: {e}")

    # Check News Items
    try:
        from datetime import datetime, timedelta, timezone
        two_days_ago = datetime.now(timezone.utc) - timedelta(days=2)
        
        # Total count
        res = supabase.table("news_items").select("*", count="exact").execute()
        print(f"Total News Items: {len(res.data)}")
        
        # Recent count
        res_recent = supabase.table("news_items").select("*", count="exact").gte("published_at", two_days_ago.isoformat()).execute()
        print(f"News Items (Last 48h): {len(res_recent.data)}")

        if len(res.data) > 0:
            print(f"Sample News: {res.data[0].get('title')} ({res.data[0].get('source_name')})")
            print(f"Published: {res.data[0].get('published_at')}")
    except Exception as e:
        print(f"Error checking news_items: {e}")

if __name__ == "__main__":
    check_db()
