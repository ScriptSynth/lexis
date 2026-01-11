import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    print("No env vars")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

async def test_feed():
    print("--- Starting Feed Debug ---")
    
    # 1. Get User (Simulated - pick the first user found or specific logic)
    # Since we can't get auth.user() easily in script without login, we'll list subscriptions and assume a user ID
    # OR better, just check if ANY news exists for ANY source.
    
    print("1. Checking Sources...")
    res = supabase.table("sources").select("*").execute()
    sources = res.data
    print(f"Found {len(sources)} sources.")
    if not sources:
        print("CRITICAL: No sources found.")
        return

    source_ids = [s['id'] for s in sources]
    print(f"Source IDs: {source_ids}")

    # 2. Check News Items for these sources
    print("\n2. Checking News Items...")
    res = supabase.table("news_items").select("id, title, published_at, source_id").in_("source_id", source_ids).order("published_at", desc=True).limit(5).execute()
    items = res.data
    print(f"Found {len(items)} news items for these sources.")
    
    if items:
        print("Sample items:")
        for item in items:
            print(f"- [{item['published_at']}] {item['title']} (Source: {item['source_id']})")
    else:
        print("CRITICAL: No news items found for existing sources.")

    # 3. Check Subscriptions
    print("\n3. Checking Subscriptions (first 5)...")
    res = supabase.table("subscriptions").select("*").limit(5).execute()
    subs = res.data
    print(f"Found {len(subs)} subscriptions total.")
    if subs:
        print(f"Sample subscription: User {subs[0]['user_id']} follows {subs[0]['source_id']}")
    else:
        print("No subscriptions found in DB.")

if __name__ == "__main__":
    asyncio.run(test_feed())
