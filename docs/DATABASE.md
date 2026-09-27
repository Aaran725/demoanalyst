# Database

## What's actually used today

AARAN AI's default storage is the browser's own `localStorage` and
`sessionStorage`, managed entirely by `lib/storage.ts`:

- **`localStorage`** ("Saved Research") — analyses you explicitly click
  "Save" on. Permanent until you clear browser data or click delete.
- **`sessionStorage`** (the "recent analyses" cache) — every analysis you
  run, even without saving, so `/analyze/[id]` and `/challenge` results
  work as real pages you can navigate back to within the same tab session.
  Cleared when the tab closes.

There is **no server-side database in the default setup.** This was a
deliberate choice: it means the app has zero backend dependency, works
completely offline once loaded, and can never fail a live demo because a
database connection dropped.

## The real schema, for when you need shared storage

`supabase/schema.sql` defines the full database structure a real, shared,
multi-user version of AARAN AI would use:

- `users` — profiles on top of Supabase auth
- `startups` — one row per company, since the same company might be
  analyzed more than once over time
- `startup_analyses` — one row per full analysis run, storing most
  sections as JSONB (matching `lib/ai/schemas.ts` almost field-for-field)
- `sources`, `competitors`, `strategic_matches`, `diligence_questions`,
  `ic_memos` — normalized out of the JSONB so you can query across many
  analyses at once (e.g., "every strategic match found across every
  startup we've researched")
- `technologies`, `public_companies`, `world_cup_startups` — what the
  Technology Radar, Public Market Intelligence, and Startup World Cup Scout
  pages would read from instead of the static sample data in
  `lib/demo-data/`
- `challenge_sessions`, `aaran_answers` — Challenge Mode history, including
  "Ask Aaran First" answers and the resulting comparison

## What connecting it for real would require

1. Create a Supabase project and run `supabase/schema.sql`
2. Add the Supabase env vars to `.env.local`
3. Replace the functions in `lib/storage.ts` with calls to
   `@supabase/supabase-js` (already a dependency) — same function
   signatures (`getSavedAnalyses`, `saveAnalysis`, `deleteAnalysis`), so
   nothing calling them needs to change
4. Add real authentication (Supabase Auth is the natural fit) so
   `created_by` actually means something
5. Enable Row Level Security — the schema file has commented-out example
   policies at the bottom, scoped to `auth.uid()`

This is intentionally NOT done in this version, so the app stays a
zero-setup, can't-fail-during-a-demo prototype. It's the clearest single
next step toward making this a real, shared product.
