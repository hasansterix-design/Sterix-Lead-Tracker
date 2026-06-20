-- Sterix Lead Tracker — one-time database setup
-- Run this entire script in Supabase: SQL Editor → New query → paste this → Run

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  type text,
  city text,
  phone text,
  stage text not null default 'New',
  value numeric default 0,
  next_followup date,
  notes text,
  created_by text,
  updated_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security: required by Supabase before any table is reachable
-- from the browser. Without this turned on, the rules below don't apply.
alter table public.leads enable row level security;

-- Anyone using the app (no login) can read all leads
create policy "anyone can view leads"
  on public.leads for select
  to anon
  using (true);

-- Anyone using the app can add a lead
create policy "anyone can insert leads"
  on public.leads for insert
  to anon
  with check (true);

-- Anyone using the app can edit any lead (per your requirement: shared editing)
create policy "anyone can update leads"
  on public.leads for update
  to anon
  using (true);

-- Anyone using the app can delete a lead
create policy "anyone can delete leads"
  on public.leads for delete
  to anon
  using (true);

-- Keep updated_at fresh automatically on every change
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on public.leads
  for each row
  execute function public.set_updated_at();

-- Enable realtime so every employee's screen updates live when someone
-- else adds, edits, or deletes a lead
alter publication supabase_realtime add table public.leads;
