import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

CATEGORIES = {
    "TechCrunch": "Tech",
    "The Verge": "Tech",
    "BBC News": "World",
    "Reuters": "Business", # valid category? Discover page has "Business"
    "Wired": "Tech",
    "Hacker News": "Tech",
    "CNN Top Stories": "World",
    "New York Times": "World",
    "Engadget": "Tech",
    "Mashable": "Entertainment"
}

def update():
    print("Updating categories...")
    for source, cat in CATEGORIES.items():
        try:
             res = supabase.table("sources").update({"category": cat}).eq("source_name", source).execute()
             print(f"Updated {source} -> {cat}")
        except Exception as e:
            print(f"Error {source}: {e}")

if __name__ == "__main__":
    update()
