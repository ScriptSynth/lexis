import os
import time
import feedparser
import newspaper
from newspaper import Article
import google.generativeai as genai
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timezone
import requests
from bs4 import BeautifulSoup
from google.api_core import exceptions

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
# Using the requested model
GENERATION_CONFIG = {
    "temperature": 0.5,
    "top_p": 0.8,
    "top_k": 40,
    "max_output_tokens": 1024,
}

SYSTEM_INSTRUCTION = (
    "You are a professional news editor for Lexis. "
    "Your task is to distill the provided article into a punchy, factual, and objective summary."
)

def get_gemini_model():
    # Switching to 1.5-flash as 2.0-flash-lite is hitting immediate quota limits
    model_name = "gemini-1.5-flash" 
    return genai.GenerativeModel(
        model_name=model_name,
        generation_config=GENERATION_CONFIG,
        system_instruction=SYSTEM_INSTRUCTION
    )

def clear_news_items():
    """Clears the news_items table completely."""
    print("Clearing news_items table...", flush=True)
    try:
        supabase.table("news_items").delete().neq("title", "").execute() 
        print("Table cleared.", flush=True)
    except Exception as e:
        print(f"Error clearing table: {e}", flush=True)

def get_active_sources():
    """Fetches list of active source URLs from sources table."""
    try:
        response = supabase.table("sources").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Error fetching sources: {e}", flush=True)
        return []

def scrape_article(url):
    """
    Extracts Main Article Text and Top Image URL using Newspaper3k.
    Falls back to basic BS4 if Newspaper3k fails.
    """
    try:
        # Newspaper3k
        article = Article(url)
        article.download()
        article.parse()
        
        text = article.text
        image_url = article.top_image
        
        if not text or len(text.strip()) < 100:
            raise Exception("Newspaper3k returned empty/short text")
            
        return text, image_url
        
    except Exception as e:
        print(f"Newspaper3k failed for {url}: {e}. Trying BS4 fallback...", flush=True)
        try:
            # Simple fallback
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
            response = requests.get(url, headers=headers, timeout=10)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Simple paragraph extractions
            paragraphs = soup.find_all('p')
            text = " ".join([p.get_text() for p in paragraphs])
            
            # Try to find og:image
            image_url = None
            og_image = soup.find("meta", property="og:image")
            if og_image:
                image_url = og_image.get("content")
                
            return text, image_url
            
        except Exception as e2:
            print(f"Scraping failed completely for {url}: {e2}", flush=True)
            return None, None

def summarize_with_gemini(text):
    """
    Generates a 3-5 line summary using Gemini.
    """
    model = get_gemini_model()
    
    # Limit text to 2000 words
    words = text.split()
    if len(words) > 2000:
        text = " ".join(words[:2000])
        
    prompt = (
        "Summarize the following news article in exactly 3 to 5 lines. "
        "Focus only on the core facts. No fluff. No 'According to the article' phrases.\n\n"
        f"Article Text: {text}"
    )
    
    retries = 3
    for attempt in range(retries):
        try:
            response = model.generate_content(prompt)
            return response.text.strip()
        except exceptions.ResourceExhausted as e:
            wait_time = 60 * (attempt + 1)
            print(f"Quota exceeded. Waiting {wait_time} seconds before retry...", flush=True)
            time.sleep(wait_time)
        except Exception as e:
            print(f"Gemini summarization failed: {e}", flush=True)
            return None
    return None

def save_news_item(item):
    """Saves the processed item to news_items table."""
    try:
        data = {
            "title": item["title"],
            "source_name": item["source_name"],
            "source_id": item.get("source_id"),
            "summary_text": item["summary_text"],
            "link": item["link"],
            "image_url": item["image_url"],
            "published_at": item["published_at"].isoformat()
        }
        
        supabase.table("news_items").insert(data).execute()
        print(f"Saved: {item['title']}", flush=True)
        
    except Exception as e:
        print(f"Error saving {item['title']}: {e}", flush=True)

def process_source(source):
    print(f"Fetching from {source['source_name']}...", flush=True)
    feed_url = source['rss_url']
    
    try:
        feed = feedparser.parse(feed_url)
    except Exception as e:
        print(f"Error parsing feed {feed_url}: {e}", flush=True)
        return
    
    # Process mostly the top entries to save time/tokens if there are many sources
    count = 0
    max_articles = 5 
    
    for entry in feed.entries:
        if count >= max_articles:
            break
            
        link = entry.link
        title = entry.title
        
        # Parse published time
        if hasattr(entry, 'published_parsed'):
            published_dt = datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
        else:
            published_dt = datetime.now(timezone.utc)
            
        # 1. Scrape
        text, article_image_url = scrape_article(link)
        
        if not text:
            print(f"Skipping {title} (No text extracted)", flush=True)
            continue
            
        # Use RSS image if scraping failed to get one
        final_image_url = article_image_url
        if not final_image_url and 'media_content' in entry:
             final_image_url = entry.media_content[0]['url']
        
        # 2. Summarize
        summary = summarize_with_gemini(text)
        
        if summary:
            item = {
                "title": title,
                "source_name": source['source_name'],
                "source_id": source['id'],
                "summary_text": summary,
                "link": link,
                "image_url": final_image_url,
                "published_at": published_dt
            }
            save_news_item(item)
            count += 1
            # Rate limiting for Free Tier
            print("Sleeping 5s to respect API rate limits...", flush=True)
            time.sleep(5) 
        else:
            print(f"Skipping {title} (Summarization failed)", flush=True)

def main():
    print("Starting AI News Service...", flush=True)
    
    # Step A: Clear Table
    # Commenting out to preserve data during debugging/quota issues
    # clear_news_items()
    
    # Step B: Get Sources
    sources = get_active_sources()
    print(f"Found {len(sources)} active sources.", flush=True)
    
    # Run
    for source in sources:
        process_source(source)
        
    print("AI News Service Cycle Complete.", flush=True)

if __name__ == "__main__":
    main()
