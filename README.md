# AARAN AI — Junior VC Copilot

**AI Venture Intelligence for the Next Generation**
Built by Aaran Chowdhery, age 13.

## What AARAN AI Is

AARAN AI is a venture-capital research copilot. You give it a startup — a
name, a website, or a pitch deck — and it produces a structured research
report: market analysis, competitors, business model, founder background,
strategic corporate fit, a Japan market-entry read, a **Devil's Advocate**
section that actively argues against the deal, five critical open
questions, founder questions, a diligence checklist, and a formatted
Investment Committee memo.

It never tells you to invest, not invest, buy, or sell. That decision
always belongs to the human investor. AARAN AI's job is to make the
thinking better — organizing research, separating verified facts from AI
reasoning, and surfacing the questions worth asking before writing a check.

## Why Aaran Built It

The challenge behind this project: *can a 13-year-old build an AI analyst
useful to a real venture capital firm?* Not a chatbot wrapper, not a stock
predictor — something that actually reflects how real due diligence works:
facts vs. inference, confirmation bias, strategic fit, and the discipline
of writing down what you *don't* know yet.

## Features

- **Analyze Startup** — full 16-section research report from just a company
  name or website
- **Evidence Engine** — every claim is labeled VERIFIED FACT, AI ANALYSIS,
  ASSUMPTION, or UNKNOWN — never presented as more certain than it is, with
  a chart summarizing the breakdown across the whole report
- **Live web search** — the Research, Founder, and Traction agents can
  search the web for facts not in the model's training data (Claude's own
  hosted tool, billed through your existing API key)
- **Devil's Advocate** — a dedicated agent that tries to disprove the bull
  case on purpose
- **Strategic Fit Engine** — who could strategically benefit from this
  startup (corporations, industries, distribution partners)
- **Pegasus Strategic Fit** — a "VC-as-a-service" lens on corporate
  partnership angles
- **Japan Opportunity Engine** — a 5-phase market-entry framework
- **Investment Committee Memo** — a formatted, printable/exportable memo,
  never containing an invest/don't-invest recommendation
- **Challenge Mode** — the live-demo experience: give AARAN AI any startup,
  watch a timer run, get the full analysis
- **Ask Aaran First** — Aaran answers 3 questions before seeing the AI's
  output, then the app shows where human and AI agreed, and what each
  caught that the other missed (no numerical grading)
- **Startup World Cup AI Scout**, **Technology Radar**, **Public Market
  Intelligence** — supporting research tools (sample data in this version)
- **Demo Mode** — the whole app works with zero API keys, zero internet,
  using 3 realistic built-in sample companies. This is what makes a live
  presentation demo-safe.

## Architecture

```
STARTUP INPUT
     |
     v
ResearchAgent  (establishes the factual baseline)
     |
     v
 +-------------------------------------------------------------+
 | MarketAgent  ProductAgent  BusinessModelAgent  TractionAgent |
 | CompetitionAgent  FounderAgent   (run in parallel)           |
 +-------------------------------------------------------------+
     |
     v
 +-------------------------------------------------------------+
 | MoatAgent  StrategicFitAgent  PegasusFitAgent  JapanAgent    |
 | DevilsAdvocateAgent   (run in parallel)                      |
 +-------------------------------------------------------------+
     |
     v
DiligenceAgent  (5 Critical Questions, Founder Questions, Next Diligence)
     |
     v
MemoAgent  (Executive Summary + Missing Information + Sources)
     |
     v
INVESTMENT COMMITTEE MEMO
```

Every agent returns JSON validated against a Zod schema
(`lib/ai/schemas.ts`). If a model's output doesn't match the schema, the app
retries once with the validation error, then fails loudly instead of
showing broken data. See `docs/ARCHITECTURE.md` and `docs/AI_AGENTS.md` for
the full detail.

## Tech Stack

- Next.js 14 (App Router) + TypeScript + React
- Tailwind CSS, hand-built shadcn-style components, Lucide icons
- Anthropic Claude API (server-side only) behind a small provider
  abstraction (`lib/ai/provider.ts`) so OpenAI/Gemini could be added later
- Zod for structured AI output validation
- Supabase schema included (`supabase/schema.sql`) for a future
  multi-user backend — **not wired in by default**. Saved research uses
  the browser's `localStorage` out of the box, so the app needs zero
  backend setup to run.

## Installation

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. With no `.env.local` changes at all, the app
runs fully in **Demo Mode** — no API key required.

## Environment Variables

See `.env.example` for the full list with comments. The important ones:

| Variable | Purpose |
|---|---|
| `DEMO_MODE` | `true` forces demo data always; `false` uses live Claude (falls back to demo if no key or on error) |
| `ANTHROPIC_API_KEY` | Your Claude API key (get one at console.anthropic.com) — **server-side only, never sent to the browser** |
| `ANTHROPIC_MODEL` | Which Claude model the agents call |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | Optional — only needed if you wire up `supabase/schema.sql` for shared storage |

## Claude API Setup

1. Create an account at https://console.anthropic.com/
2. Generate an API key
3. Put it in `.env.local` as `ANTHROPIC_API_KEY=sk-ant-...`
4. Set `DEMO_MODE=false`
5. Restart the dev server

## Supabase Setup (optional)

The app works fully without this. To add shared/persistent storage:

1. Create a project at https://supabase.com/
2. Run `supabase/schema.sql` in the SQL editor
3. Add the Supabase env vars to `.env.local`
4. See `docs/DATABASE.md` for what would need to change in the app code to
   actually read/write through Supabase instead of localStorage

## Demo Mode

`DEMO_MODE=true` (the default) — or simply not setting `ANTHROPIC_API_KEY`
— makes every analysis resolve instantly to one of 3 built-in, clearly
labeled `DEMO DATA` companies (a warehouse robotics startup, a healthcare
AI startup, and an enterprise AI agent startup). This is intentional: **a
live presentation must never fail because an API call timed out.** If a
live analysis does fail with a real key configured, the app shows "Live
research unavailable" with a one-click "Use Demo Analysis" fallback instead
of a dead end. See `docs/DEMO_GUIDE.md`.

## How to Run Locally

```bash
npm run dev       # start the dev server
npm run lint      # ESLint
npm run typecheck # TypeScript, no emit
npm run build     # production build
```

## How to Deploy

Any Next.js host works (Vercel is simplest). Set the environment variables
from `.env.example` in your host's dashboard, then deploy the repo as a
standard Next.js app. No other infrastructure is required in Demo Mode.

## Security & Limitations

This is a **prototype**, not an enterprise-ready system. Before Pegasus (or
any firm) could use this with real confidential deal information, at
minimum: real authentication, encrypted storage for uploaded pitch decks
(currently pitch deck *contents* are not parsed or uploaded anywhere — only
the filename is referenced), a signed data-processing agreement with the AI
provider, audit logging, and role-based access control on saved research.
See `docs/QUESTIONS_ANIS_MIGHT_ASK.md` for the fuller answer to "how would
you make this enterprise-ready?"

## Future Roadmap

- Extend live web search (currently on ResearchAgent, FounderAgent,
  TractionAgent) to more agents, if cost/latency allows
- Real Supabase-backed multi-user storage
- Real pitch deck parsing (PDF text extraction)
- OpenAI/Gemini provider implementations behind the existing abstraction
- A real company database behind Startup World Cup AI Scout

---

*Built by Aaran Chowdhery. See `docs/` for how it works, how it was built,
and honest answers to the hard questions.*
