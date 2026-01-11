-- Create table for ad submissions
create table public.ad_submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  startup_name text not null,
  description text,
  logo_url text,
  status text default 'pending'
);

-- Enable RLS
alter table public.ad_submissions enable row level security;

-- Allow anyone to insert (since it's a public form)
create policy "Enable insert for all users" on public.ad_submissions
  for insert with check (true);

-- Allow users to read their own submissions (optional, if we tracked user_id, but here strictly generic for now)
-- create policy "Enable read for authenticated users" on public.ad_submissions using (true);
