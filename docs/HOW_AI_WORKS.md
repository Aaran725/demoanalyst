# How the AI Actually Works

A plain-language explanation of what happens between typing a company name
and seeing a full analysis — no jargon assumed.

## Step 1: You give it something to research

Just a company name is enough (a website helps, a description helps more).
This goes to `app/api/analyze/route.ts` as a small JSON object.

## Step 2: The Research Agent builds a factual baseline

Before anything else happens, one AI call
(`lib/ai/prompts/research.ts`) asks Claude: "What do you actually know about
this company?" — headquarters, founders, sector, funding, the problem it
solves. Every fact it returns is tagged with how confident it really is
(see "The Evidence Engine" below). This becomes the shared starting point
every other agent builds on.

## Step 3: Specialist agents each look at one thing

Instead of one AI call trying to analyze everything, there are 13 more
agents, each with a narrow, focused job — market sizing, product
differentiation, business model, traction, competitors, moat, founders,
strategic fit, Pegasus fit, Japan opportunity, Devil's Advocate,
diligence questions, and the final memo. Each one is a separate prompt file
you can open and read in `lib/ai/prompts/`.

Why not one big prompt? Because a model asked to do 14 different kinds of
analysis in one shot tends to do all of them shallowly. A model asked to do
ONE thing carefully does that one thing better. This is the same reason a
real due-diligence team splits work across specialists instead of having
one person do everything.

## Step 4: Every answer is checked before it's trusted

Each agent is required to respond with JSON in an exact shape (see
`lib/ai/schemas.ts`). After the AI responds, the code checks the JSON
against that shape using a library called Zod. If a required field is
missing, or the wrong type, the code sends it back to the AI once with the
specific error and asks it to fix it. If it still doesn't match, the app
fails that step loudly instead of quietly showing broken or half-made-up
data. This is `lib/ai/callAgent.ts`.

## Step 5: The Evidence Engine — facts vs. AI reasoning

This is the most important idea in the whole app. Every specific claim in
an analysis — a funding number, a founder's background, a market size — is
labeled with one of four statuses:

- **VERIFIED FACT** — there's a specific, named source behind this
- **AI ANALYSIS** — this is the model's own reasoning or interpretation
- **ASSUMPTION** — this has to be true for part of the thesis to hold
- **UNKNOWN** — nobody, including the AI, could establish this

Every agent's instructions (`lib/ai/prompts/shared.ts`) explicitly forbid
inventing specific numbers (revenue, ARR, valuations, market size) without a
real basis — the correct move when the AI doesn't actually know something is
to say `"unknown"`, not to guess a plausible-sounding number. This is the
difference between an analysis you can trust and a confident-sounding
hallucination.

## Step 6: Devil's Advocate — fighting confirmation bias on purpose

One agent's entire job is different from the others: it's told to actively
try to disprove the optimistic case, not evaluate it neutrally. This exists
because investors (and 13-year-olds, and everyone else) tend to
unconsciously look for evidence that confirms what they already want to
believe. Having a dedicated "argue the other side" step, every single time,
is a deliberate structural fix for that — not something you'd remember to
do consistently on your own.

## Step 7: Turning research into questions

The Diligence Agent doesn't add new research — it converts everything
already found into three concrete outputs: the 5 questions most likely to
change the whole thesis if answered, specific questions to ask the
founders, and a prioritized checklist of what to investigate next. This is
the step that turns "here's a report" into "here's what to actually do
next."

## Step 8: The memo, and the one thing it never says

The final Investment Committee Memo pulls together everything the earlier
agents found into one readable document. It is explicitly instructed —
every single agent is — to **never** output the words "invest," "don't
invest," "buy," or "sell." That decision is always the human's. AARAN AI's
entire value is in making the thinking behind that decision sharper, not in
making the decision itself.

## Where AI can go wrong (and what limits the damage here)

- **Hallucination**: the model states something confidently that isn't
  true. Mitigated by the Evidence Engine's discipline (mark unknowns as
  unknown) — but not eliminated. Nothing in this app should be treated as
  verified without checking the actual source.
- **Training data cutoff**: without a live web-search integration, the
  model's knowledge of very recent events is limited. The `.env.example`
  has a slot for a search API key for exactly this reason, but it's not
  wired in by default.
- **Schema-shaped ≠ true**: passing Zod validation only means the AI's
  answer has the right *shape* — it doesn't mean the content is correct.
  Validation catches malformed output, not wrong-but-well-formed output.

See `docs/QUESTIONS_ANIS_MIGHT_ASK.md` for more on this, including "how do
you reduce hallucinations" and "what happens when AI is wrong."
