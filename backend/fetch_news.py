import os
import json
import newspaper
from newspaper import Article
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from supabase import create_client, Client
import time
from urllib.parse import urlparse

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file.")
    exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_sources():
    """Fetches all sources from the Supabase 'sources' table."""
    try:
        response = supabase.table("sources").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Error fetching sources: {e}")
        return []

def get_base_url(url):
    """Extracts the base URL (homepage) from a full URL."""
    parsed = urlparse(url)
    return f"{parsed.scheme}://{parsed.netloc}"

def scrape_source(source, cutoff_date):
    """Scrapes a single source using newspaper3k."""
    source_name = source.get("source_name")
    rss_url = source.get("rss_url") # We use this to derive the homepage
    source_id = source.get("id")
    
    if not rss_url:
        return []

    # Use the provided URL directly to support scraping specific sections (e.g., /world, /politics)
    target_url = rss_url
    print(f"Building paper for {source_name} ({target_url})...")
    
    try:
        # memoize_articles=False ensuring we don't cache locally and miss updates if run repeatedly in dev
        paper = newspaper.build(target_url, memoize_articles=False)
        print(f"Found {len(paper.articles)} potential articles on {source_name}.")
        
        processed_count = 0
        
        for article in paper.articles:
            # Basic optimization: Check if URL already exists before downloading
            # This saves bandwidth and time
            try:
                # Check DB first? 
                # Doing a select for every link might be slow if we have thousands. 
                # But compared to downloading and parsing HTML, it's fast.
                pass 
            except:
                pass

            try:
                article.download()
                article.parse()
                
                # Freshness Check
                # article.publish_date can be None or a datetime object
                if article.publish_date:
                    # Ensure timezone awareness
                    pub_date = article.publish_date
                    if pub_date.tzinfo is None:
                        pub_date = pub_date.replace(tzinfo=timezone.utc)
                    
                    if pub_date < cutoff_date:
                        # Article is too old
                        continue
                else:
                    # If no date found, we might want to skip or assume it's new. 
                    # For safety in this "freshness" driven task, let's skip if we can't verify date, 
                    # OR we could check if we've seen the URL before.
                    # Let's assume if no date, we check the DB. 
                    pass

                # Extract data
                title = article.title
                link = article.url
                
                # Summarization (NLP)
                # newspaper3k has built-in NLP for summary, but it requires 'nltk' download sometimes.
                # simpler to just take the top text or description if available?
                # article.nlp() populates article.summary and article.keywords
                try:
                    article.nlp()
                    summary = article.summary
                except:
                    summary = article.text[:500] + "..." if article.text else ""

                image_url = article.top_image
                
                # Check if we have a valid publish date to save, else use now()
                final_pub_date = article.publish_date if article.publish_date else datetime.now(timezone.utc)
                if final_pub_date.tzinfo is None:
                    final_pub_date = final_pub_date.replace(tzinfo=timezone.utc)

                article_data = {
                    "source_name": source_name,
                    "source_id": source_id,
                    "title": title,
                    "summary_text": summary,
                    "link": link,
                    "image_url": image_url,
                    "published_at": final_pub_date.isoformat()
                }
                
                # UPSERT
                try:
                    supabase.table("news_items").upsert(
                        article_data, 
                        on_conflict="link" 
                    ).execute()
                    processed_count += 1
                    # print(f"Saved: {title}")
                except Exception as e:
                    print(f"Error saving {title}: {e}")

                # Rate limiting / politeness
                # Only process a few articles per source for this demo? 
                # Or just loop all? 
                # Let's limit to 10 recent ones per source to avoid taking forever if the site is huge.
                if processed_count >= 10:
                    break
                    
            except Exception as e:
               # print(f"Error processing article: {e}")
               continue
               
        print(f"Processed {processed_count} articles for {source_name}.")

    except Exception as e:
        print(f"Error building paper for {source_name}: {e}")

def scrape_and_save(days_to_fetch):
    cutoff_date = datetime.now(timezone.utc) - timedelta(days=days_to_fetch)
    print(f"Fetching news published after: {cutoff_date}")

    sources = fetch_sources()
    
    for source in sources:
        scrape_source(source, cutoff_date)

def export_latest_news(start_time_of_script):
    """Fetches articles added since script started and saves to JSON."""
    try:
        response = supabase.table("news_items") \
            .select("source_name, title, summary_text, link, published_at, image_url") \
            .gte("created_at", start_time_of_script.isoformat()) \
            .execute()
            
        articles = response.data
        
        formatted_articles = []
        for item in articles:
            formatted_articles.append({
                "source": item.get("source_name"),
                "headline": item.get("title"),
                "summary": item.get("summary_text"),
                "url": item.get("link"),
                "image": item.get("image_url"), 
                "date": item.get("published_at")
            })
            
        with open("latest_news.json", "w", encoding="utf-8") as f:
            json.dump(formatted_articles, f, indent=4, ensure_ascii=False)
            
        print(f"Exported {len(formatted_articles)} new articles to latest_news.json")
        
    except Exception as e:
        print(f"Error exporting JSON: {e}")

def main():
    # Ensure NLTK data for newspaper3k NLP
    try:
        import nltk
        nltk.download('punkt', quiet=True)
    except:
        pass

    try:
        days_input = input("How many days of news do you want to fetch? ")
        days = float(days_input)
    except ValueError:
        print("Invalid input. Defaulting to 1 day.")
        days = 1.0

    start_time = datetime.now(timezone.utc)
    
    scrape_and_save(days)
    
    export_latest_news(start_time)

if __name__ == "__main__":
    main()
