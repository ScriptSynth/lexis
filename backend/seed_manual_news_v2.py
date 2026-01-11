import os
import json
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

DATA = {
  "generated_at": "2026-01-09T10:20:00Z",
  "total_items": 14,
  "news": [
    {
      "id": "news_001",
      "source": "TechCrunch",
      "headline": "OpenAI to acquire team behind executive coaching AI tool Convogo",
      "published_at": "2026-01-08T00:00:00Z",
      "summary": "OpenAI is acqui-hiring the founding team behind Convogo, an AI platform used by executive coaches and HR teams. The company clarified it is not acquiring Convogo’s product or IP. The team will instead work on OpenAI’s internal AI cloud initiatives.",
      "category": "AI",
      "url": "https://techcrunch.com/2026/01/08/openai-to-acquire-the-team-behind-executive-coaching-ai-tool-convogo/",
      "image": "https://techcrunch.com/wp-content/uploads/2025/04/GettyImages-2206295463.jpg"
    },
    {
      "id": "news_002",
      "source": "TechCrunch",
      "headline": "Anthropic adds Allianz to its growing list of enterprise customers",
      "published_at": "2026-01-09T00:00:00Z",
      "summary": "Anthropic announced a partnership with insurance giant Allianz to deploy its AI models. The collaboration focuses on responsible AI use in insurance operations. Financial terms of the deal were not disclosed.",
      "category": "AI",
      "url": "https://techcrunch.com/2026/01/09/anthropic-adds-allianz-to-growing-list-of-enterprise-wins/",
      "image": "https://techcrunch.com/wp-content/uploads/2025/09/Screenshot-2025-09-02-at-12.22.37PM.png"
    },
    {
      "id": "news_003",
      "source": "TechCrunch",
      "headline": "Critics question NSO Group’s transparency push as it targets US market",
      "published_at": "2026-01-08T00:00:00Z",
      "summary": "Spyware company NSO Group released a transparency report as it seeks entry into the US market. Critics argue the report omits key details about customers linked to abuses. The company claims it is entering a new accountability phase.",
      "category": "Cybersecurity",
      "url": "https://techcrunch.com/2026/01/08/critics-pan-spyware-maker-nsos-transparency-claims-amid-its-push-to-enter-us-market/",
      "image": "https://techcrunch.com/wp-content/uploads/2026/01/nso-group-logo-mobile-phone.jpg"
    },
    {
      "id": "news_004",
      "source": "TechCrunch",
      "headline": "Governments struggle to respond to flood of AI-generated non-consensual nudity on X",
      "published_at": "2026-01-08T00:00:00Z",
      "summary": "AI-generated explicit images spread rapidly on X using Grok tools. Victims include public figures and private individuals. Governments are now scrambling to address enforcement, platform responsibility, and legal gaps.",
      "category": "AI Policy",
      "url": "https://techcrunch.com/2026/01/08/governments-grapple-with-the-flood-of-non-consensual-nudity-on-x/",
      "image": "https://techcrunch.com/wp-content/uploads/2025/07/GettyImages-2218892225.jpg"
    },
    {
      "id": "news_005",
      "source": "TechCrunch",
      "headline": "Internet collapses across Iran amid nationwide economic protests",
      "published_at": "2026-01-08T00:00:00Z",
      "summary": "Internet connectivity dropped sharply across Iran during large-scale protests. Network monitoring firms reported near-total disconnection. Activists warn the blackout is being used to suppress information flow.",
      "category": "World",
      "url": "https://techcrunch.com/2026/01/08/internet-collapses-in-iran-amid-protests-over-economic-crisis/",
      "image": "https://techcrunch.com/wp-content/uploads/2026/01/iran-protests-2026.jpg"
    },
    {
      "id": "news_006",
      "source": "TechCrunch",
      "headline": "LG’s new home robot CLOiD can fold laundry — but raises questions",
      "published_at": "2026-01-08T00:00:00Z",
      "summary": "LG unveiled CLOiD, an AI-powered home robot, at CES 2026. The robot demonstrated laundry folding and other household tasks. While impressive, questions remain about cost, autonomy, and real-world usefulness.",
      "category": "Robotics",
      "url": "https://techcrunch.com/2026/01/08/i-watched-lgs-new-home-robot-cloid-do-laundry-but-i-have-questions/",
      "image": "https://techcrunch.com/wp-content/uploads/2026/01/LG-Robt-at-CES-2026.jpg"
    },
    {
      "id": "news_007",
      "source": "The Verge",
      "headline": "Samsung’s Z TriFold feels like a tablet with a phone attached",
      "published_at": "2026-01-05T04:02:40Z",
      "summary": "Samsung’s triple-fold Z TriFold impressed reviewers with its flexible form factor. The device feels closer to a tablet than a traditional phone. Its design hints at the future of foldable mobile hardware.",
      "category": "Gadgets",
      "url": "https://www.theverge.com/tech/854352/samsung-galaxy-z-trifold-hands-on",
      "image": "https://platform.theverge.com/wp-content/uploads/sites/2/2026/01/DSC02025_processed.jpg"
    },
    {
      "id": "news_008",
      "source": "Wired",
      "headline": "Margaret Atwood reflects on doomscrolling and creativity",
      "published_at": "2026-01-06T11:30:00Z",
      "summary": "Author Margaret Atwood discusses doomscrolling, mortality, and writing habits. She reflects on staying informed without surrendering to despair. Atwood says creativity continues through persistence, not planning.",
      "category": "Culture",
      "url": "https://www.wired.com/story/the-big-interview-podcast-margaret-atwood/",
      "image": "https://media.wired.com/photos/6941a24d21e8b2a2aa7be768/191:100/w_1280,c_limit/Big-Interview-UV-Solo-Margaret-Atwood-Culture.jpg"
    },
    {
      "id": "news_009",
      "source": "Hacker News",
      "headline": "Why I left iNaturalist after 18 years",
      "published_at": "2026-01-06T00:00:00Z",
      "summary": "A co-founder of iNaturalist explains his departure after nearly two decades. He cites leadership direction and management concerns. The post reflects tensions common in long-running open platforms.",
      "category": "Startups",
      "url": "https://kueda.net/blog/2026/01/06/why-i-left-inat/",
      "image": ""
    },
    {
      "id": "news_010",
      "source": "The Guardian",
      "headline": "Grok disables image generator after backlash over sexualised AI imagery",
      "published_at": "2026-01-09T00:00:00Z",
      "summary": "Elon Musk’s Grok AI shut down its image generation feature for most users. The move follows widespread misuse to create sexualised and violent images. Regulators threatened fines and potential bans.",
      "category": "AI Ethics",
      "url": "https://www.theguardian.com/technology/2026/jan/09/grok-image-generator-outcry-sexualised-ai-imagery",
      "image": "https://i.guim.co.uk/img/media/5602890ef620af5b8c02784d85062ad26bfaa4a7/master/3083.jpg"
    }
  ]
}

def seed_data_v2():
    print(f"Seeding batch 2: {len(DATA['news'])} articles...")
    
    dup_count = 0
    new_count = 0
    
    for item in DATA['news']:
        article = {
            "source_name": item["source"],
            "title": item["headline"],
            "summary_text": item["summary"],
            "link": item["url"],
            "published_at": item["published_at"],
            "image_url": item.get("image")
        }
        
        try:
            # Check for existing
            # We want to know if it's a duplicate for reporting purposes
            check = supabase.table("news_items").select("id").eq("link", article["link"]).execute()
            is_dup = len(check.data) > 0
            
            # Upsert
            supabase.table("news_items").upsert(article, on_conflict="link").execute()
            
            if is_dup:
                dup_count += 1
                print(f"Updated (Existing): {item['headline']}")
            else:
                new_count += 1
                print(f"Inserted (New): {item['headline']}")
                
        except Exception as e:
            print(f"Error checking/inserting {item['headline']}: {e}")

    print(f"\nBatch 2 Complete.")
    print(f"New Articles: {new_count}")
    print(f"Duplicates Updated: {dup_count}")

if __name__ == "__main__":
    seed_data_v2()
