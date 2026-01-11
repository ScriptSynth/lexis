-- Create sources table
CREATE TABLE IF NOT EXISTS sources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_name TEXT NOT NULL,
    rss_url TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- References auth.users(id) if using Supabase Auth, but keeping generic for now or strictly linking to auth.users
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, source_id)
);

-- Add source_id to news_items if not exists (optional, but good for relationship)
ALTER TABLE news_items ADD COLUMN IF NOT EXISTS source_id UUID REFERENCES sources(id);

-- RLS Policies (Enable RLS)
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Sources are readable by everyone
CREATE POLICY "Public sources are viewable by everyone" ON sources
    FOR SELECT USING (true);

-- Subscriptions are viewable and editable only by the user
-- Note: This assumes Supabase Auth is being used and auth.uid() returns the user's ID
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subscriptions" ON subscriptions
    FOR DELETE USING (auth.uid() = user_id);
