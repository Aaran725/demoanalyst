# How to Explain the Code

A walkthrough Aaran can use to explain, live, how any part of this actually
works — in the order someone would naturally ask about it.

## "Walk me through what happens when I click Analyze."

1. `components/analysis/StartupInputForm.tsx` collects what you typed and
   calls `onSubmit` with a plain object: `{ companyName, website, sector, ... }`
2. `lib/useAnalyze.ts` (a React hook) sends that as JSON to `POST
   /api/analyze` using the browser's built-in `fetch`
3. `app/api/analyze/route.ts` — this is server code, it never runs in the
   browser — checks if Demo Mode is on. If not, it calls
   `runAnalysisPipeline` from `lib/ai/orchestrator.ts`
4. The orchestrator calls each of the 14 agents (see `docs/AI_AGENTS.md`),
   validates each one's output, and assembles one big `FullAnalysis` object
   matching the shape in `lib/ai/schemas.ts`
5. The route sends that object back as JSON
6. The hook stores it and the page redirects to `/analyze/[id]`, which
   looks the analysis up (`lib/analysis-lookup.ts`) and renders it with
   `components/analysis/AnalysisView.tsx`

## "Show me where the Claude API key is used."

`lib/ai/anthropic.ts` — and nowhere else. It reads
`process.env.ANTHROPIC_API_KEY`, which only exists on the server (Next.js
never sends server-only env vars to the browser bundle unless they're
prefixed `NEXT_PUBLIC_`, which this isn't). Open the browser's Network tab
during a live analysis — you'll see a request to `/api/analyze` on your own
domain, never a request to `api.anthropic.com` directly from the browser.

## "How do you know the AI didn't just make up the JSON?"

`lib/ai/callAgent.ts`. Every agent's raw text response gets parsed as JSON
and checked against a Zod schema — Zod is a library that describes exactly
what shape an object should have (which fields, what types) and can check
a real object against that description. If the AI's output doesn't match,
the code doesn't just crash or show garbage — it sends the error back to
the AI once and asks for a fix, then gives up cleanly if it still doesn't
match.

## "What's this 'Evidence Engine' thing?"

Open `lib/ai/schemas.ts` and find `claimSchema`. Almost nothing in this app
is a plain string — most fields are a `Claim`: text plus a status
(`verified_fact` / `ai_analysis` / `assumption` / `unknown`) plus optional
sources. `components/analysis/EvidenceTag.tsx` turns that status into the
colored badge you see everywhere in the UI. The instruction that makes the
AI actually use this honestly lives in `lib/ai/prompts/shared.ts`.

## "Why does Devil's Advocate feel different from the other sections?"

Because its prompt (`lib/ai/prompts/devilsAdvocate.ts`) is different on
purpose — instead of "analyze neutrally," it's told "actively try to
disprove this." Every other agent tries to be balanced; this one is
deliberately one-sided, because the whole point is to counteract the
natural human tendency to only look for evidence that confirms what you
already want to believe.

## "How does Ask Aaran First actually compare my answer to the AI's?"

`components/challenge/AaranQuestions.tsx` collects your 3 answers before
the main analysis even runs. Once the analysis is done,
`components/challenge/AaranVsAI.tsx` sends your answers plus the AI's
Devil's Advocate / Moat / Founder Questions findings to `POST
/api/compare`, which uses a 15th, small agent
(`lib/ai/prompts/comparison.ts`) to find genuine overlaps and genuine gaps
in both directions — never a numerical score.

## "What happens if I run this with no internet and no API key at all?"

Open `.env.example` — `DEMO_MODE=true` is the default, and even if you set
it to `false`, `app/api/analyze/route.ts` checks for
`ANTHROPIC_API_KEY` and falls back to demo data if it's missing. The 3 demo
companies live in `lib/demo-data/` as plain TypeScript objects — no network
call, no database, just data checked into the code.

## "What would you say you personally built vs. used a library for?"

Be honest about this one — it's a good answer, not a weakness:

- **Written by hand**: every prompt (`lib/ai/prompts/`), the whole schema
  design (`lib/ai/schemas.ts`), the orchestration order and parallelism
  (`lib/ai/orchestrator.ts`), all 3 demo companies' content, every page and
  component's layout and logic, the whole design system (colors,
  typography, spacing in `tailwind.config.ts`)
- **Libraries used, not written**: React/Next.js (the framework), Zod
  (schema validation), Tailwind (CSS utility classes), Radix UI (the
  low-level accessible Tabs component), Lucide (icons), the Anthropic SDK
  (talking to the Claude API)

Using well-tested libraries for solved problems (routing, accessibility
primitives, HTTP clients) so you can spend your own effort on the actual
hard, novel part — the agent design and the evidence discipline — is good
engineering judgment, not cutting corners.
