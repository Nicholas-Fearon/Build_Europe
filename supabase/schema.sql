-- Apply in the Supabase SQL editor or with psql against local Supabase/PostgreSQL.
create table if not exists public.event_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('attend', 'sponsor', 'speak')),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  company text not null default '' check (char_length(company) <= 150),
  topic text not null default '' check (char_length(topic) <= 200),
  message text not null default '' check (char_length(message) <= 3000),
  consent boolean not null check (consent = true),
  check (type <> 'sponsor' or (company <> '' and topic <> '')),
  check (type <> 'speak' or (topic <> '' and message <> ''))
);
create index if not exists event_submissions_type_created_at_idx on public.event_submissions(type, created_at desc);
-- No anonymous read/write policies. All application inserts use the server secret key.
alter table public.event_submissions enable row level security;
revoke all on public.event_submissions from anon, authenticated;
grant insert on public.event_submissions to service_role;
