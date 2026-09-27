-- =============================================================================
-- AARAN AI — Supabase schema
-- =============================================================================
-- This file is NOT wired into the app by default. Out of the box, AARAN AI
-- stores saved research in the browser's localStorage (see lib/storage.ts) —
-- good enough for a solo demo laptop with zero backend setup.
--
-- This schema is what a real, shared, multi-user version of the app would
-- migrate to. It mirrors the shape of lib/ai/schemas.ts closely so the two
-- stay easy to compare. See docs/DATABASE.md for how to actually connect it.
--
-- To use: run this in the Supabase SQL editor for a new project, then set
-- NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
-- in .env.local.
-- =============================================================================

-- Extension needed for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
-- A thin profile table on top of Supabase's built-in auth.users. AARAN AI
-- doesn't implement authentication in this prototype, so this table isn't
-- populated yet — it's here so startups/analyses have somewhere to point
-- "created_by" once auth is added.
create table if not exists users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- startups
-- ---------------------------------------------------------------------------
-- One row per company that's been analyzed. A company can be analyzed more
-- than once over time (startup_analyses holds the individual runs).
create table if not exists startups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  sector text,
  country text,
  funding_stage text,
  description text,
  created_by uuid references users (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- startup_analyses
-- ---------------------------------------------------------------------------
-- One full AARAN AI run. Most sections are stored as JSONB because they're
-- read as a whole document (the analysis page renders all of it together) —
-- see lib/ai/schemas.ts for the exact shape of each column. A few sections
-- that the product spec calls out for cross-analysis browsing (competitors,
-- strategic matches, diligence questions, sources) are ALSO normalized into
-- their own tables below, so you can query "every strategic match across all
-- analyzed startups" without unpacking JSON.
create table if not exists startup_analyses (
  id uuid primary key default gen_random_uuid(),
  startup_id uuid not null references startups (id) on delete cascade,
  is_demo_data boolean not null default false,

  snapshot jsonb not null,           -- StartupSnapshot
  market jsonb not null,             -- MarketIntelligence
  product jsonb not null,            -- ProductAnalysis
  business_model jsonb not null,     -- BusinessModel
  traction jsonb not null,           -- Traction
  moat jsonb not null,               -- CompetitiveMoat
  founders jsonb not null,           -- FounderAnalysis
  pegasus_fit jsonb not null,        -- PegasusFit
  japan jsonb not null,              -- JapanOpportunity
  devils_advocate jsonb not null,    -- DevilsAdvocate
  critical_questions jsonb not null, -- CriticalQuestions
  founder_questions jsonb not null,  -- FounderQuestions

  created_by uuid references users (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- sources
-- ---------------------------------------------------------------------------
-- Normalized version of the Source objects embedded throughout an analysis'
-- claims. Populating this table is optional (claims already carry their own
-- sources inline as JSON) — it exists for building a "show me everywhere
-- this source was used" view later.
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references startup_analyses (id) on delete cascade,
  label text not null,
  url text,
  source_date text,
  claim_supported text not null
);

-- ---------------------------------------------------------------------------
-- competitors
-- ---------------------------------------------------------------------------
create table if not exists competitors (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references startup_analyses (id) on delete cascade,
  name text not null,
  category text not null check (category in ('direct', 'indirect', 'incumbent', 'emerging')),
  product text not null,
  target_customer text not null,
  business_model text not null,
  differentiation text not null,
  funding_or_scale text
);

-- ---------------------------------------------------------------------------
-- strategic_matches
-- ---------------------------------------------------------------------------
-- Powers the Strategic Fit Engine and Pegasus Fit hub pages.
create table if not exists strategic_matches (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references startup_analyses (id) on delete cascade,
  company_or_industry text not null,
  rationale text not null,
  possible_collaboration text not null,
  possible_pilot_project text not null,
  distribution_opportunity text not null,
  technology_integration text not null,
  geographic_opportunity text not null,
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  confidence_reasoning text not null
);

-- ---------------------------------------------------------------------------
-- diligence_questions
-- ---------------------------------------------------------------------------
-- The "Recommended Next Diligence" checklist.
create table if not exists diligence_questions (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references startup_analyses (id) on delete cascade,
  item text not null,
  priority text not null check (priority in ('critical', 'important', 'useful')),
  reasoning text not null
);

-- ---------------------------------------------------------------------------
-- ic_memos
-- ---------------------------------------------------------------------------
create table if not exists ic_memos (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references startup_analyses (id) on delete cascade,
  executive_summary text not null,
  missing_information jsonb not null default '[]',
  sources jsonb not null default '[]',
  generated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- technologies
-- ---------------------------------------------------------------------------
-- Backs the Technology Radar page. Currently seeded from
-- lib/demo-data/tech-radar.ts as static data; this table is what a live,
-- editable version would move to.
create table if not exists technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  what_is_changing text not null,
  why_now text not null,
  important_startups jsonb not null default '[]',
  important_public_companies jsonb not null default '[]',
  industries_affected jsonb not null default '[]',
  potential_corporate_impact jsonb not null default '[]',
  risks jsonb not null default '[]',
  five_year_questions jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- public_companies
-- ---------------------------------------------------------------------------
-- Backs the Public Market Intelligence page.
create table if not exists public_companies (
  id uuid primary key default gen_random_uuid(),
  theme text not null,
  company_category text not null,
  why_it_matters text not null,
  revenue_exposure text not null,
  competitive_impact text not null,
  time_horizon text not null,
  risks jsonb not null default '[]',
  what_to_monitor jsonb not null default '[]'
);

-- ---------------------------------------------------------------------------
-- world_cup_startups
-- ---------------------------------------------------------------------------
-- Backs the Startup World Cup AI Scout page. Currently seeded from
-- lib/demo-data/world-cup.ts as static sample data.
create table if not exists world_cup_startups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text not null,
  country text not null,
  region text not null,
  stage text not null,
  technology text not null,
  business_model text not null,
  revenue_range text not null,
  growth text not null,
  corporate_fit text not null,
  japan_opportunity text not null,
  snapshot text not null,
  market text not null,
  traction text not null,
  differentiation text not null,
  strategic_fit text not null,
  risks jsonb not null default '[]',
  critical_questions jsonb not null default '[]',
  research_brief text not null
);

-- ---------------------------------------------------------------------------
-- challenge_sessions
-- ---------------------------------------------------------------------------
-- One row per "Challenge AARAN AI" live-demo run, including the timer.
create table if not exists challenge_sessions (
  id uuid primary key default gen_random_uuid(),
  company_query text not null,
  ask_aaran_first boolean not null default false,
  analysis_id uuid references startup_analyses (id),
  elapsed_seconds integer,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_by uuid references users (id)
);

-- ---------------------------------------------------------------------------
-- aaran_answers
-- ---------------------------------------------------------------------------
-- "Ask Aaran First" — his answers, captured before the AI ran, plus the
-- resulting comparison once it's generated.
create table if not exists aaran_answers (
  id uuid primary key default gen_random_uuid(),
  challenge_session_id uuid not null references challenge_sessions (id) on delete cascade,
  risks text not null,
  moat text not null,
  founder_question text not null,
  comparison jsonb, -- ComparisonResult, once generated
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- Left disabled by default since this prototype has no auth wired up yet.
-- Before storing anything beyond a single trusted user's own data, enable
-- RLS on every table above and add policies scoping rows to created_by /
-- auth.uid(). Example for startup_analyses:
--
--   alter table startup_analyses enable row level security;
--   create policy "Users can read their own analyses"
--     on startup_analyses for select
--     using (created_by = auth.uid());
--   create policy "Users can insert their own analyses"
--     on startup_analyses for insert
--     with check (created_by = auth.uid());
