
import sys
import os
from main import summarize_article

# Add current directory to path so we can import main
sys.path.append(os.getcwd())

def verify():
    # TechCrunch article usually has enough text
    url = "https://techcrunch.com/2024/01/01/example-article/" 
    # Actually, let's use a real recent URL if possible, or just trust the logic if we can't scrape easily without a real URL.
    # But wait, summarize_article takes a URL and downloads it.
    # I should use a known working URL from the feed or just one I know exists.
    # Let's try to get one from the TechCrunch feed first using feedparser, similar to main.py
    
    import feedparser
    feed = feedparser.parse("https://techcrunch.com/feed/")
    if not feed.entries:
        print("Could not fetch feed to get a test URL.")
        return

    test_url = feed.entries[0].link
    print(f"Testing with URL: {test_url}")
    
    summary = summarize_article(test_url, sentence_count=5) # Request more sentences to trigger the limit
    
    if summary:
        words = summary.split()
        count = len(words)
        print(f"Word count: {count}")
        print("-" * 20)
        print(summary)
        print("-" * 20)
        
        if count <= 76: # 75 + "..." might be counted as one depending on split, or just 75 words. "..." is usually attached to the last word or separate? 
            # split() default splits by whitespace. "word..." is 1 token. "word ..." is 2.
            # My code does: " ".join(words[:75]) + "..." -> "word1 word2 ... word75..."
            # Wait, " ".join(words[:75]) + "..." -> last word will be "word75..."
            # So split() will still return 75 tokens if "..." is attached.
            # If I did + " ...", it would be 76.
            # Anyhow, let's say <= 80 to be safe and check physically.
            if count <= 75:
                 print("PASS: Summary is within limit (<=75 words).")
            elif count == 76 and words[-1].endswith("..."):
                 # This might happen if "..." is counting as a word or attached to one?
                 # Actually if I have 75 words and add "...", it is still 75 words if attached.
                 print("PASS: Summary is within limit (<=75 words + ellipsis).")
            else:
                 print(f"FAIL: Summary is too long ({count} words).")
        else:
            print(f"FAIL: Summary is too long ({count} words).")
    else:
        print("FAIL: Could not generate summary.")

if __name__ == "__main__":
    verify()
