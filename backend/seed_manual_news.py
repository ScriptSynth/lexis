import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client
from newspaper import Article
import time

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file.")
    exit(1)

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

DATA = {
  "generated_at": "2026-01-10T03:30:00Z",
  "total_items": 22,
  "news": [
    {
      "id": "news_001",
      "source": "Mashable",
      "headline": "CES 2026: TDM’s Neo headphones turn into speakers with a simple twist",
      "published_at": "2026-01-09T21:23:28Z",
      "category": "Gadgets",
      "summary": "TDM unveiled its Neo Hybrid headphones at CES 2026, featuring a twist mechanism that converts them into speakers. The transition is seamless and visually striking. The headphones will launch later this month for $249 in black and white options.",
      "url": "https://mashable.com/article/ces-2026-tdm-neo-hybrid-headphone-speakers",
      "image": "https://helios-i.mashable.com/imagery/articles/07DV5THc7G73RTbLmTYqkk9/hero-image.fill.size_1200x675.v1767991477.jpg"
    },
    {
      "id": "news_002",
      "source": "Mashable",
      "headline": "Gmail launches AI inbox and overviews with Gemini",
      "published_at": "2026-01-09T17:17:49Z",
      "category": "AI",
      "summary": "Google is introducing Gemini-powered features in Gmail, including AI Overviews and a new AI Inbox. These tools summarize emails and help users focus on priority messages. Most features are limited to Google AI Pro and Ultra subscribers.",
      "url": "https://mashable.com/article/gmail-launches-gemini-ai-inbox-overviews",
      "image": "https://helios-i.mashable.com/imagery/articles/02TQQtBoEJGsFKcQXEM8vZo/hero-image.fill.size_1200x675.v1767976759.jpg"
    },
    {
      "id": "news_003",
      "source": "ABC News",
      "headline": "New video shows different angle of fatal Minneapolis ICE shooting",
      "published_at": "2026-01-10T02:55:09Z",
      "category": "US News",
      "summary": "ABC News obtained new cellphone footage showing the moments before Renee Good was fatally shot by an ICE agent in Minneapolis. The video captures officers issuing commands as Good remained in her vehicle. The incident has sparked nationwide calls for transparency.",
      "url": "https://abcnews.go.com/US/live-updates/minneapolis-ice-shooting-live-updates-tensions-flare-minneapolis/?id=129018634",
      "image": "https://i.abcnewsfe.com/a/3f6dadf1-aad6-49c9-835d-3e8b6e5c9740/minn-13-ht-gmh-260109_1767987174996_hpMain_16x9.jpg?w=1600"
    },
    {
      "id": "news_004",
      "source": "ABC News",
      "headline": "Flu cases climb past 15 million across the United States, CDC says",
      "published_at": "2026-01-10T02:55:10Z",
      "category": "Health",
      "summary": "CDC data shows flu activity remains extremely high across much of the U.S., with at least 15 million cases recorded. Hospitalizations have surpassed 180,000 nationwide. Health officials warn activity may continue rising in coming weeks.",
      "url": "https://abcnews.go.com/Health/flu-activity-continues-climb-us-15-million-cases/story?id=129052785",
      "image": "https://i.abcnewsfe.com/a/c01d7231-8f08-4b92-859e-7c9f2b9f9191/flu-symptoms-1-as-gmh-251124_1763995177833_hpMain_16x9.jpg?w=1600"
    },
    {
      "id": "news_005",
      "source": "ABC News",
      "headline": "Russia launches nuclear-capable missile in massive overnight strike on Ukraine",
      "published_at": "2026-01-10T02:55:11Z",
      "category": "World",
      "summary": "Russia carried out a large-scale overnight attack on Ukraine using drones and missiles, including a nuclear-capable ballistic missile. Ukrainian officials confirmed strikes across multiple regions. The escalation has heightened international alarm.",
      "url": "https://abcnews.go.com/International/russia-irbm-massive-strike-ukraine-overnight/story?id=129048949",
      "image": "https://i.abcnewsfe.com/a/7a2469b0-ccb9-4829-b37a-47b6fb1803ed/irbm-attack_1767947447175_hpMain_16x9.jpg?w=1600"
    },
    {
      "id": "news_006",
      "source": "ABC News",
      "headline": "Grandmother killed in shark attack in US Virgin Islands",
      "published_at": "2026-01-10T02:55:13Z",
      "category": "US News",
      "summary": "A 56-year-old Minnesota woman died after being attacked by a shark while swimming in the U.S. Virgin Islands. Emergency responders were called to the beach but she could not be saved. Neighbors described her as kind and deeply loved.",
      "url": "https://abcnews.go.com/US/minnesota-woman-dead-after-suspected-shark-attack-us/story?id=129048362",
      "image": "https://i.abcnewsfe.com/a/f386b644-bc42-4f77-bf04-a3f8f19bd490/arlene-2-ht-er-260109_1768003225419_hpMain_16x9.jpg?w=1600"
    },
    {
      "id": "news_007",
      "source": "ABC News",
      "headline": "US hiring slows in December despite Federal Reserve rate cuts",
      "published_at": "2026-01-10T02:55:14Z",
      "category": "Economy",
      "summary": "The U.S. added 50,000 jobs in December, marking a slowdown despite recent interest rate cuts. Economists say hiring remains uneven as businesses remain cautious. The Fed has signaled a careful approach to future rate reductions.",
      "url": "https://abcnews.go.com/Business/jobs-report-expected-show-uptick-hiring-fed-cuts/story?id=129013718",
      "image": "https://i.abcnewsfe.com/a/5acc49ae-db3e-4a08-9943-a9f4faf921c8/restaurant-new-york-gty-jt-260108_1767906610388_hpMain_16x9.jpg?w=1600"
    },
    {
      "id": "news_008",
      "source": "The Guardian",
      "headline": "EU states back controversial Mercosur trade deal with Latin America",
      "published_at": "2026-01-09T00:00:00Z",
      "category": "World",
      "summary": "EU member states have backed the Mercosur trade agreement despite widespread protests from farmers. Supporters say the deal could generate billions in exports and reduce reliance on China. Critics warn of environmental and labor risks.",
      "url": "https://www.theguardian.com/world/2026/jan/09/eu-states-back-controversial-mercosur-deal-with-latin-american-countries",
      "image": "https://i.guim.co.uk/img/media/96b81d42283531284e6fcb339c6d8e19e712aad4/master/4808.jpg"
    },
    {
      "id": "news_009",
      "source": "Al Jazeera",
      "headline": "Trump threatens to take Greenland ‘the hard way’ over Arctic strategy",
      "published_at": "2026-01-09T00:00:00Z",
      "category": "Politics",
      "summary": "Donald Trump renewed threats to assert U.S. control over Greenland, citing strategic concerns about Russia and China. Greenlandic and Danish officials rejected the remarks. The comments have reignited diplomatic tensions.",
      "url": "https://www.aljazeera.com/news/2026/1/9/greenland-should-take-the-lead-in-talks-with-us-foreign-minister-says",
      "image": "https://www.aljazeera.com/wp-content/uploads/2026/01/ap_695fc1bfe820d.jpg"
    },
    {
      "id": "news_010",
      "source": "Associated Press",
      "headline": "Iran’s supreme leader signals crackdown on protesters",
      "published_at": "2026-01-09T05:03:14Z",
      "category": "World",
      "summary": "Iran’s supreme leader accused protesters of damaging the country to appease foreign powers. Demonstrations spread before internet access was cut nationwide. Authorities reported unrest but offered limited casualty figures.",
      "url": "https://apnews.com/article/iran-protests-us-israel-war-economy-54e4024a0b9e6a9f3ab49153c8e28f05",
      "image": "https://dims.apnews.com/dims4/default/b26622f/2147483647/strip/true/crop/2675x1505/resize/1440x810"
    }
  ]
}

def seed_data():
    print(f"Seeding {len(DATA['news'])} articles...")
    
    for item in DATA['news']:
        url = item['url']
        print(f"Processing: {url}")
        
        try:
            # Fetch article content to get real title (ignoring provided headline)
            # and image if not provided
            article = Article(url)
            article.download()
            article.parse()
            
            # Use fetched title instead of JSON headline
            title = article.title
            
            # Use provided image if available, else fetch
            image_url = item.get("image")
            if not image_url:
                image_url = article.top_image
            
            db_item = {
                "source_name": item["source"],
                "title": title, # Fetched title
                "summary_text": item["summary"], # Provided summary
                "link": url,
                "image_url": image_url, 
                "published_at": item["published_at"]
            }
            
            # Upsert
            supabase.table("news_items").upsert(
                db_item, 
                on_conflict="link"
            ).execute()
            
            print(f"Inserted: {title}")
            if image_url:
                print(f"  > Image: {image_url}")
            else:
                print("  > No image found.")

        except Exception as e:
            print(f"Error processing {url}: {e}")
            pass

if __name__ == "__main__":
    seed_data()
