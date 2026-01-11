
import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def clear_db():
    print("Clearing news_items table...")
    try:
        # Supabase-py doesn't allow 'delete all' without a filter easily in some versions basically.
        # But 'neq' on a primary key might work, or just standard delete.
        # Let's try to delete items where 'id' is not null (which is all).
        supabase.table("news_items").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        print("Success: Database cleared.")
    except Exception as e:
        print(f"Failed to clear DB: {e}")

if __name__ == "__main__":
    clear_db()
