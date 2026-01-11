import json
import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file.")
    exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

INPUT_FILE = r"c:\Users\India\Desktop\new idea\ai_studio_code.txt"

def import_summaries():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: File not found at {INPUT_FILE}")
        return

    try:
        with open(INPUT_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        print(f"Loaded data from {INPUT_FILE}")
        
        count = 0
        for group in data:
            source_name = group.get("source")
            articles = group.get("articles", [])
            
            for article in articles:
                item = {
                    "source_name": source_name,
                    "title": article.get("headline"),
                    "summary_text": article.get("summary"),
                    "link": article.get("url"),
                    "published_at": article.get("date"),
                    # We don't have image_url in the file, so we omit it.
                    # Verify if upsert clears missing fields or only updates provided ones if keys are missing?
                    # valid supabase-py upsert replaces the row.
                    # To do a partial update for existing rows, we might need to check existence or use a different method.
                    # But for now, assuming these are the "truth" or new items.
                }
                
                try:
                    # Attempt simple upsert
                    supabase.table("news_items").upsert(item, on_conflict="link").execute()
                    count += 1
                    if count % 10 == 0:
                        print(f"Processed {count} articles...")
                except Exception as e:
                    print(f"Error upserting {item['link']}: {e}")
                    
        print(f"Successfully processed {count} articles from file.")
        
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    import_summaries()
