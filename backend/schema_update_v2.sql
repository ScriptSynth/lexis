-- Add new columns to sources table
ALTER TABLE sources ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE sources ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Optional: Update existing rows with some dummy data if null (can be done via seed script too)
