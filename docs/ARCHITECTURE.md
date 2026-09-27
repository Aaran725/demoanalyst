# Architecture

This explains how AARAN AI is put together, at the level of "which file does
what and why," written so Aaran can explain any part of it without notes.

## The big picture

```
Browser (React components)
    |
    | fetch("/api/analyze", { companyName, website, ... })
    v
Next.js API Route (app/api/analyze/route.ts)   <- runs on the SERVER ONLY
    |
    | picks demo data OR calls the real pipeline
    v
Orchestrator (lib/ai/orchestrator.ts)
    |
    | calls each agent in order, in parallel where possible
    v
14 Agents (lib/ai/prompts/*.ts + lib/ai/callAgent.ts)
    |
    | each calls...
    v
AI Provider (lib/ai/anthropic.ts implements lib/ai/provider.ts)
    |
    v
Anthropic Claude API
```

The browser **never** talks to Claude directly. It only ever calls
`/api/analyze` (or `/api/compare` for Ask Aaran First), which is server-side
Next.js code. This is the only place `ANTHROPIC_API_KEY` is read
(`lib/ai/anthropic.ts`), so the key can never leak to the browser's network
tab or JavaScript.

## Why an orchestrator instead of one big prompt

The spec calls for 14 separate specialist agents (Research, Market, Product,
Business Model, Traction, Competition, Moat, Founder, Strategic Fit,
Pegasus Fit, Japan, Devil's Advocate, Diligence, Memo). Each one gets its
own, focused prompt (see `docs/AI_AGENTS.md`) instead of one giant prompt
asking Claude to do everything at once. Two reasons:

1. **Quality.** A focused prompt ("only analyze the business model") gets a
   more careful answer than a page-long prompt trying to do 16 things.
2. **Reliability.** Each agent's output is validated against its own Zod
   schema. If one agent's output is malformed, we know exactly which piece
   broke and can retry just that piece — not the whole analysis.

`lib/ai/orchestrator.ts` calls the agents in the order the dependencies
require, but runs independent agents **in parallel** with `Promise.all` to
keep total wall-clock time down (this matters a lot when there's a five
minute demo clock running — see `docs/DEMO_GUIDE.md`).

## Why one API call instead of streaming progress

An earlier design considered streaming live progress events from the server
as each agent finishes. We chose NOT to do that, on purpose:

- Server-Sent Events / streaming responses are meaningfully more complex to
  get right (reconnection, partial failures, buffering behind proxies) —
  and a 13-year-old needs to be able to debug this code.
- A single request/response is much easier to reason about, test, and keep
  reliable during a live demo.

Instead, `components/analysis/AnalysisProgress.tsx` shows the real list of
pipeline steps and animates through them while the one request is in
flight, then snaps to "done" the instant the real response arrives. It's a
waiting indicator, not a fabricated result — no step is ever marked
complete before the actual analysis is actually complete.

## Evidence Engine

The single most important idea in the schema (`lib/ai/schemas.ts`) is the
`Claim` type:

```ts
{ text: string, status: "verified_fact" | "ai_analysis" | "assumption" | "unknown", sources?: Source[] }
```

Almost every field in an analysis is a `Claim`, not a plain string. Every
agent's system prompt (`lib/ai/prompts/shared.ts`) is instructed to never
invent a specific number it can't support, and to mark anything it can't
verify as `"unknown"` rather than guessing. The UI
(`components/analysis/EvidenceTag.tsx`) shows a colored badge for every
claim so a reader always knows what they're looking at.

## Demo Mode

`app/api/analyze/route.ts` checks `DEMO_MODE` and `ANTHROPIC_API_KEY` before
doing anything else. If demo mode is on (or no key is configured), it skips
the whole AI pipeline and returns one of the 3 hand-written sample analyses
in `lib/demo-data/`, matched by company name. This means the app is fully
functional and fast with **zero setup**, and a live presentation can never
be blocked by a missing key, a network issue, or an AI provider outage.

If a live analysis is attempted and fails partway through (rate limit,
timeout, a model output that fails validation twice), the route catches the
error and returns a demo fallback alongside a clear "Live research
unavailable" message — the UI then offers a one-click "Use Demo Analysis"
button instead of a dead page.

## Where things live

| Folder | What's in it |
|---|---|
| `app/` | Next.js pages and API routes |
| `components/ui/` | Small generic UI primitives (Button, Card, Badge, Tabs) |
| `components/analysis/` | Everything that renders a piece of an analysis |
| `components/challenge/` | Challenge Mode / Ask Aaran First specific UI |
| `components/layout/` | Sidebar, app shell, presentation mode |
| `lib/ai/` | Schemas, prompts, provider abstraction, orchestrator |
| `lib/demo-data/` | The 3 full demo companies + sample data for other pages |
| `lib/storage.ts` | localStorage-backed "saved research" |
| `supabase/schema.sql` | The real database schema, not wired in by default |
| `docs/` | This documentation |
