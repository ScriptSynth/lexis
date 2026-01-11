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

INITIAL_SOURCES = [
    {
        "source_name": "TechCrunch",
        "rss_url": "https://techcrunch.com/feed/",
        "category": "Tech"
    },
    {
        "source_name": "The Verge",
        "rss_url": "https://www.theverge.com/rss/index.xml",
        "category": "Tech"
    },
    {
        "source_name": "BBC News",
        "rss_url": "http://feeds.bbci.co.uk/news/world/rss.xml",
        "category": "General"
    },
    {
        "source_name": "Reuters",
        "rss_url": "https://www.reutersagency.com/feed/?best-regions=north-america&post_type=best",
        "category": "General" # Reuters URL might need adjustment, using a generic one or finding a better RSS
    },
    {
        "source_name": "Wired",
        "rss_url": "https://www.wired.com/feed/rss",
        "category": "Tech"
    },
    {
        "source_name": "Hacker News",
        "rss_url": "https://news.ycombinator.com/rss",
        "category": "Tech"
    },
    {
        "source_name": "CNN Top Stories",
        "rss_url": "http://rss.cnn.com/rss/cnn_topstories.rss",
        "category": "General"
    },
    {
        "source_name": "New York Times",
        "rss_url": "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
        "category": "General"
    },
    {
        "source_name": "Engadget",
        "rss_url": "https://www.engadget.com/rss.xml",
        "category": "Tech"
    },
    {
        "source_name": "Mashable",
        "rss_url": "https://mashable.com/feeds/rss/all",
        "category": "Entertainment"
    },
    {
        "source_name": "ABC News International",
        "rss_url": "https://abcnews.go.com/International/",
        "category": "World"
    },
    {
        "source_name": "Reuters World",
        "rss_url": "https://www.reuters.com/world/",
        "category": "World"
    },
    {
        "source_name": "The Guardian World",
        "rss_url": "https://www.theguardian.com/world",
        "category": "World"
    },
    {
        "source_name": "Al Jazeera English",
        "rss_url": "https://www.aljazeera.com/news/",
        "category": "World"
    },
    {
        "source_name": "Associated Press (AP)",
        "rss_url": "https://apnews.com/hub/politics",
        "category": "Politics"
    },
    {
        "source_name": "Politico Global",
        "rss_url": "https://www.politico.com/",
        "category": "Politics"
    }
]

def seed_sources():
    print(f"Seeding {len(INITIAL_SOURCES)} sources...")
    
    for source in INITIAL_SOURCES:
        # Check if exists to avoid duplicates (based on rss_url usually)
        # But upsert is easier if we have a constraint. We defined rss_url as UNIQUE in schema.
        try:
            result = supabase.table("sources").upsert(source, on_conflict="rss_url").execute()
            print(f"Upserted: {source['source_name']}")
        except Exception as e:
            print(f"Error upserting {source['source_name']}: {e}")

    print("Seeding complete.")

if __name__ == "__main__":
    seed_sources()
