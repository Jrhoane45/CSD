-- Club Sports Direct — Postgres schema (Supabase)
--
-- Foundation reference for moving the demo off localStorage onto a real backend.
-- Apply in the Supabase SQL editor (or via `supabase db push`). Row-Level
-- Security is enabled with starter policies; tighten before production.
--
-- Conventions: uuid PKs, timestamptz created_at/updated_at, snake_case columns.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Accounts & roles
-- ---------------------------------------------------------------------------

do $$ begin
  create type app_role as enum ('parent', 'provider', 'operator');
exception when duplicate_object then null; end $$;

-- One row per auth user (mirrors auth.users). Role governs access everywhere.
create table if not exists profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text,
  full_name    text,
  role         app_role not null default 'parent',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Athlete profile owned by a parent account (the matching inputs).
create table if not exists athlete_profiles (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references profiles (id) on delete cascade,
  sport        text,
  age          int,
  level        text,
  county       text,
  max_miles    int,
  category     text,
  goals        text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists athlete_profiles_owner_idx on athlete_profiles (owner_id);

-- ---------------------------------------------------------------------------
-- Providers (listings) & operator vetting
-- ---------------------------------------------------------------------------

do $$ begin
  create type vetting_status as enum ('verified', 'pending', 'suspended');
exception when duplicate_object then null; end $$;

create table if not exists listings (
  id                 text primary key,             -- stable slug (e.g. "hoop-prodigy")
  owner_id           uuid references profiles (id) on delete set null, -- claimed provider
  name               text not null,
  category           text not null,
  sports             text[] not null default '{}',
  levels             text[] not null default '{}',
  city               text,
  county             text,
  miles_from_anchor  numeric,
  claim_state        text not null default 'unclaimed',
  vetting            vetting_status not null default 'pending',
  years_in_operation int,
  certifications     text[] not null default '{}',
  philosophy         text,
  price_band         int,
  price_label        text,
  goals              text[] not null default '{}',
  specialties        text[] not null default '{}',
  alumni             jsonb not null default '{"pro":0,"d1":0,"d2":0,"d3":0}',
  notable_athletes   text[] not null default '{}',
  featured           boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists listings_vetting_idx on listings (vetting);
create index if not exists listings_owner_idx on listings (owner_id);

-- ---------------------------------------------------------------------------
-- Reviews & provider replies
-- ---------------------------------------------------------------------------

create table if not exists reviews (
  id          uuid primary key default gen_random_uuid(),
  listing_id  text not null references listings (id) on delete cascade,
  author_id   uuid references profiles (id) on delete set null,
  author_name text not null,
  rating      int not null check (rating between 1 and 5),
  title       text,
  body        text,
  dimensions  jsonb not null default '[]',
  removed     boolean not null default false,   -- operator moderation
  created_at  timestamptz not null default now()
);
create index if not exists reviews_listing_idx on reviews (listing_id);

create table if not exists review_replies (
  review_id  uuid primary key references reviews (id) on delete cascade,
  listing_id text not null references listings (id) on delete cascade,
  body       text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Events & registrants
-- ---------------------------------------------------------------------------

create table if not exists events (
  id          uuid primary key default gen_random_uuid(),
  listing_id  text references listings (id) on delete cascade,
  title       text not null,
  type        text not null,
  sport       text,
  date        date,
  time        text,
  city        text,
  county      text,
  description text,
  price_label text,
  boost       text not null default 'none',
  reach       int not null default 0,
  rsvps       int not null default 0,
  created_by  text not null default 'provider',
  created_at  timestamptz not null default now()
);
create index if not exists events_listing_idx on events (listing_id);

create table if not exists event_registrants (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events (id) on delete cascade,
  user_id    uuid references profiles (id) on delete set null,
  name       text not null,
  athlete    text,
  created_at timestamptz not null default now()
);
create index if not exists event_registrants_event_idx on event_registrants (event_id);

-- ---------------------------------------------------------------------------
-- Promotions (campaigns)
-- ---------------------------------------------------------------------------

do $$ begin
  create type campaign_status as enum ('scheduled', 'active', 'ended');
exception when duplicate_object then null; end $$;

create table if not exists campaigns (
  id           uuid primary key default gen_random_uuid(),
  listing_id   text not null references listings (id) on delete cascade,
  event_id     uuid references events (id) on delete set null,
  objective    text not null,
  placements   text[] not null default '{}',
  audience     text not null,
  duration_days int not null,
  start_date   date not null,
  end_date     date not null,
  budget       numeric not null,
  payment      text,
  status       campaign_status not null default 'scheduled',
  headline     text,
  cta          text,
  -- delivery metrics
  impressions  int not null default 0,
  clicks       int not null default 0,
  metric_rsvps int not null default 0,
  spend        numeric not null default 0,
  created_at   timestamptz not null default now()
);
create index if not exists campaigns_listing_idx on campaigns (listing_id);
create index if not exists campaigns_status_idx on campaigns (status);

-- ---------------------------------------------------------------------------
-- Messaging (threads + messages)
-- ---------------------------------------------------------------------------

create table if not exists threads (
  id           uuid primary key default gen_random_uuid(),
  listing_id   text not null references listings (id) on delete cascade,
  parent_id    uuid references profiles (id) on delete set null,
  parent_name  text,
  athlete      text,
  kind         text,
  status       text not null default 'active',
  unread_for   app_role,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists threads_listing_idx on threads (listing_id);

create table if not exists messages (
  id         uuid primary key default gen_random_uuid(),
  thread_id  uuid not null references threads (id) on delete cascade,
  sender     app_role not null,
  body       text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_thread_idx on messages (thread_id);

-- ---------------------------------------------------------------------------
-- Bookings / sessions
-- ---------------------------------------------------------------------------

create table if not exists bookings (
  id          uuid primary key default gen_random_uuid(),
  listing_id  text not null references listings (id) on delete cascade,
  user_id     uuid references profiles (id) on delete set null,
  starts_at   timestamptz,
  status      text not null default 'requested',
  notes       text,
  created_at  timestamptz not null default now()
);
create index if not exists bookings_user_idx on bookings (user_id);

-- ---------------------------------------------------------------------------
-- Operator moderation queue
-- ---------------------------------------------------------------------------

create table if not exists moderation_reports (
  id          uuid primary key default gen_random_uuid(),
  type        text not null,                 -- review | listing | event
  listing_id  text references listings (id) on delete cascade,
  review_id   uuid references reviews (id) on delete set null,
  event_id    uuid references events (id) on delete set null,
  reason      text not null,
  excerpt     text,
  reported_by text,
  resolution  text,                          -- null (open) | dismissed | removed
  created_at  timestamptz not null default now()
);
create index if not exists moderation_open_idx on moderation_reports (resolution);

-- ---------------------------------------------------------------------------
-- Parent-owned: saved listings & searches
-- ---------------------------------------------------------------------------

create table if not exists saved_listings (
  user_id    uuid not null references profiles (id) on delete cascade,
  listing_id text not null references listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table if not exists saved_searches (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles (id) on delete cascade,
  name       text not null,
  criteria   jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row-Level Security (starter policies — tighten before production)
-- ---------------------------------------------------------------------------

alter table profiles           enable row level security;
alter table athlete_profiles   enable row level security;
alter table listings           enable row level security;
alter table reviews            enable row level security;
alter table review_replies     enable row level security;
alter table events             enable row level security;
alter table event_registrants  enable row level security;
alter table campaigns          enable row level security;
alter table threads            enable row level security;
alter table messages           enable row level security;
alter table bookings           enable row level security;
alter table moderation_reports enable row level security;
alter table saved_listings     enable row level security;
alter table saved_searches     enable row level security;

-- Helper: is the current user an operator?
create or replace function is_operator() returns boolean
language sql stable as $$
  select exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'operator'
  );
$$;

-- Profiles: a user manages their own row; operators can read all.
create policy profiles_self_rw on profiles
  for all using (id = auth.uid() or is_operator()) with check (id = auth.uid() or is_operator());

-- Athlete profiles / saved data: owner-only.
create policy athlete_owner on athlete_profiles
  for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy saved_listings_owner on saved_listings
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy saved_searches_owner on saved_searches
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Listings: publicly readable unless suspended (operators see all); owner or
-- operator can write.
create policy listings_public_read on listings
  for select using (vetting <> 'suspended' or owner_id = auth.uid() or is_operator());
create policy listings_owner_write on listings
  for all using (owner_id = auth.uid() or is_operator())
  with check (owner_id = auth.uid() or is_operator());

-- Reviews: public reads exclude removed; any authed user can write their own.
create policy reviews_public_read on reviews
  for select using (removed = false or is_operator());
create policy reviews_author_write on reviews
  for insert with check (author_id = auth.uid());
create policy reviews_operator_moderate on reviews
  for update using (is_operator()) with check (is_operator());

-- Events / campaigns / moderation: operators broad; owners scoped. (Starter.)
create policy events_public_read on events for select using (true);
create policy events_owner_write on events
  for all using (is_operator() or exists (
    select 1 from listings l where l.id = events.listing_id and l.owner_id = auth.uid()
  )) with check (true);

create policy moderation_operator_only on moderation_reports
  for all using (is_operator()) with check (is_operator());

-- ---------------------------------------------------------------------------
-- Auto-provision a profile row when a new auth user signs up
-- ---------------------------------------------------------------------------

create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'parent'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
