import os
import asyncio
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

UPDATES = {
    "TechCrunch": {
        "description": "Startup and technology news.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/b/b9/TechCrunch_logo.svg"
    },
    "The Verge": {
        "description": "Covering the intersection of technology, science, art, and culture.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/a6/The_Verge_logo.svg"
    },
    "BBC News": {
        "description": "Global news, business, sport, entertainment and technology.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/4/4e/BBC_News_2022.svg"
    },
    "Reuters": {
        "description": "Breaking news, business, financial and investing news.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/8/8d/Reuters_Logo.svg"
    },
    "Wired": {
        "description": "The latest in technology, science, culture and business.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/9/95/Wired_logo.svg"
    },
    "Hacker News": {
        "description": "Social news website focusing on computer science and entrepreneurship.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/2/25/Hacker_News_logo.svg"
    },
    "CNN Top Stories": {
        "description": "View the latest news and breaking news today for U.S., world, weather, entertainment, politics and health.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/6/66/CNN_International_logo.svg"
    },
    "New York Times": {
        "description": "Live news, investigations, opinion, photos and video.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/4/40/New_York_Times_logo_variation.jpg"
    },
    "Engadget": {
        "description": "Technology news and reviews.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/2/24/Engadget_logo.svg"
    },
    "Mashable": {
        "description": "Multi-platform media and entertainment company.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/d/d7/Mashable_Logo_2016.svg"
    }
}

def update_sources():
    print("Updating sources with descriptions and logos...")
    
    for name, data in UPDATES.items():
        try:
            # Check if source exists
             result = supabase.table("sources").update(data).eq("source_name", name).execute()
             print(f"Updated {name}")
        except Exception as e:
            print(f"Error updating {name}: {e}")

    print("Update complete.")

if __name__ == "__main__":
    update_sources()
