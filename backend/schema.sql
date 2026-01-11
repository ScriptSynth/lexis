CREATE TABLE IF NOT EXISTS news_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    source_name TEXT NOT NULL,
    summary_text TEXT NOT NULL,
    link TEXT NOT NULL UNIQUE,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster deduplication checks
CREATE INDEX IF NOT EXISTS idx_news_items_link ON news_items(link);
