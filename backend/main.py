import os
import time
import feedparser
import nltk
from sumy.parsers.html import HtmlParser
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Download NLTK data if not present (quietly)
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt', quiet=True)
    nltk.download('punkt_tab', quiet=True)

# Configuration
FEEDS = {
    "TechCrunch": "https://techcrunch.com/feed/",
    "The Verge": "https://www.theverge.com/rss/index.xml",
    "BBC News": "http://feeds.bbci.co.uk/news/world/rss.xml",
    "Reuters": "https://www.reutersagency.com/feed/?best-topics=technology&post_type=best",
    "Wired": "https://www.wired.com/feed/rss",
    "Hacker News": "https://news.ycombinator.com/rss",
    "CNN Top Stories": "http://rss.cnn.com/rss/edition.rss",
    "New York Times": "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
    "Engadget": "https://www.engadget.com/rss.xml",
    "Mashable": "https://mashable.com/feed"
}

def get_published_time(entry):
    """Extracts and converts published time to UTC datetime."""
    if hasattr(entry, 'published_parsed'):
        return datetime(*entry.published_parsed[:6], tzinfo=timezone.utc)
    return datetime.now(timezone.utc) # Fallback

def get_image_url(entry):
    """Extracts image URL from RSS entry."""
    # Try different standard locations for images in RSS
    if 'media_content' in entry:
        return entry.media_content[0]['url']
    if 'media_thumbnail' in entry:
        return entry.media_thumbnail[0]['url']
    if 'links' in entry:
        for link in entry.links:
            if link.get('type', '').startswith('image/'):
                return link.href
    # Fallback to scraping later? For now, keep it simple.
    return None

def is_recent(published_dt):
    """Checks if the article was published within the last 2 days."""
    two_days_ago = datetime.now(timezone.utc) - timedelta(days=2)
    return published_dt > two_days_ago

def check_if_exists(link):
    """Checks if the article link already exists in Supabase."""
    try:
        response = supabase.table("news_items").select("link").eq("link", link).execute()
        return len(response.data) > 0
    except Exception as e:
        print(f"Error checking existence for {link}: {e}")
        return False

def summarize_article(url, sentence_count=3):
    """Summarizes the article using LexRank from the sumy library."""
    try:
        language = "english"
        parser = HtmlParser.from_url(url, Tokenizer(language))
        
        stemmer = Stemmer(language)
        summarizer = LexRankSummarizer(stemmer)
        summarizer.stop_words = get_stop_words(language)

        summary_sentences = summarizer(parser.document, sentence_count)
        
        if not summary_sentences:
            return None

        # Join sentences into a single paragraph
        summary_text = " ".join([str(sentence) for sentence in summary_sentences])
        
        # Limit to 75 words
        words = summary_text.split()
        if len(words) > 75:
            summary_text = " ".join(words[:75]) + "..."
            
        return summary_text

    except Exception as e:
        print(f"Error summarizing {url}: {e}")
        return None

def save_to_supabase(item):
    """Saves the processed item to Supabase."""
    try:
        data = {
            "title": item["title"],
            "source_name": item["source_name"],
            "source_id": item.get("source_id"),
            "summary_text": item["summary_text"],
            "link": item["link"],
            "image_url": item.get("image_url"),
            "published_at": item["published_at"].isoformat()
        }
        supabase.table("news_items").insert(data).execute()
        print(f"Saved: {item['title']}")
    except Exception as e:
        print(f"Error saving {item['title']}: {e}")

def process_feed(source_name, feed_url):
    print(f"Processing {source_name}...")
    
    source_id = SOURCE_IDS.get(source_name)
    if not source_id:
        print(f"Skipping {source_name}: Source ID not found")
        return

    feed = feedparser.parse(feed_url)
    
    for entry in feed.entries:
        published_dt = get_published_time(entry)
        
        # Freshness Filter (1 Hour)
        if not is_recent(published_dt):
            continue
            
        link = entry.link
        
        # Deduplication
        if check_if_exists(link):
            # print(f"Skipping (Exists): {entry.title}")
            continue
            
        print(f"New Article: {entry.title}")

        # Extract Image
        image_url = get_image_url(entry)
        
        # Summarize using LexRank
        summary = summarize_article(link, sentence_count=4) # Aiming for 3-5 lines roughly
        
        if summary:
            item = {
                "title": entry.title,
                "source_name": source_name,
                "source_id": source_id,
                "summary_text": summary,
                "link": link,
                "image_url": image_url,
                "published_at": published_dt
            }
            save_to_supabase(item)
            # small sleep to be nice to the target server
            time.sleep(1) 
        else:
            print("Skipping due to summarization failure.")


# Cache for source IDs
SOURCE_IDS = {}

def load_source_ids():
    """Loads source IDs from Supabase."""
    try:
        response = supabase.table("sources").select("id, source_name").execute()
        for row in response.data:
            SOURCE_IDS[row['source_name']] = row['id']
        print(f"Loaded {len(SOURCE_IDS)} source IDs.")
    except Exception as e:
        print(f"Error loading source IDs: {e}")

def main():
    print("Starting LexRank News Fetcher...")
    load_source_ids()
    
    for source, url in FEEDS.items():
        try:
            process_feed(source, url)
        except Exception as e:
            print(f"Error processing feed {source}: {e}")
    print("Cycle complete.")

if __name__ == "__main__":
    main()
