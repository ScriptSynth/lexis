
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def test_insert():
    print("Testing insert with image_url...")
    try:
        data = {
            "title": "Test Image Article",
            "source_name": "Testabot",
            "summary_text": "This is a test to verify image_url column.",
            "link": "https://example.com/test-image-" + str(datetime.now().timestamp()),
            "image_url": "https://via.placeholder.com/150",
            "published_at": datetime.now().isoformat()
        }
        supabase.table("news_items").insert(data).execute()
        print("Success: Item inserted with image_url.")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_insert()
