# The 14 AI Agents

Every agent is a plain function that builds a system prompt + user prompt,
in its own file under `lib/ai/prompts/`. None of them are "real" separate
programs or models — they're all the same Claude model, called 14 times
with 14 different, focused instructions. Open any file listed below to read
its exact prompt.

| # | Agent | File | Job |
|---|---|---|---|
| 1 | ResearchAgent | `prompts/research.ts` | Builds the factual baseline every other agent starts from: HQ, founders, sector, funding, problem/solution. **Has live web search.** |
| 2 | MarketAgent | `prompts/market.ts` | Market category, TAM/SAM/SOM (only if verifiable), drivers, why now |
| 3 | ProductAgent | `prompts/product.ts` | What's actually differentiated about the product, and why customers might not choose it |
| 4 | BusinessModelAgent | `prompts/businessModel.ts` | Revenue model, margins, scalability, concentration risk |
| 5 | TractionAgent | `prompts/traction.ts` | Revenue, growth, customers, retention — marked "unknown" wherever not publicly verifiable. **Has live web search.** |
| 6 | CompetitionAgent | `prompts/competition.ts` | Direct/indirect/incumbent/emerging competitors, and what makes this startup different |
| 7 | FounderAgent | `prompts/founder.ts` | Founder background from public information only — never judges character or intelligence. **Has live web search.** |
| 8 | MoatAgent | `prompts/moat.ts` | Rates 10 specific moat factors as strong/some/weak/unknown evidence — never a numeric score |
| 9 | StrategicFitAgent | `prompts/strategicFit.ts` | Which corporations/industries could strategically benefit from this startup, with a confidence rating |
| 10 | PegasusFitAgent | `prompts/pegasusFit.ts` | A "VC-as-a-service" lens — always labeled as general reasoning, never a confirmed Pegasus relationship |
| 11 | JapanAgent | `prompts/japan.ts` | Japan market-entry analysis and a 5-phase entry strategy |
| 12 | DevilsAdvocateAgent | `prompts/devilsAdvocate.ts` | Actively tries to disprove the bull case — 5 specific reasons this could fail |
| 13 | DiligenceAgent | `prompts/diligence.ts` | Converts everything into 5 Critical Questions, Founder Questions, and a prioritized diligence checklist |
| 14 | MemoAgent | `prompts/memo.ts` | Writes the Executive Summary and compiles Missing Information + Sources for the IC Memo |

There's also a 15th, smaller agent that only runs in Challenge Mode's "Ask
Aaran First" feature:

| — | ComparisonAgent | `prompts/comparison.ts` | Compares Aaran's own first-pass answers against the AI's Devil's Advocate / Moat / Founder Questions findings — never assigns a grade |

## Every agent shares the same ground rules

`lib/ai/prompts/shared.ts` defines `CORE_RULES`, which every single agent's
system prompt starts with:

- Never output "invest," "don't invest," "buy," or "sell"
- Tone: curious, analytical, skeptical, concise, humble about uncertainty
- Every factual claim must be tagged `verified_fact`, `ai_analysis`,
  `assumption`, or `unknown`
- Never invent specific numbers (revenue, funding, users, valuations) —
  say "unknown" instead
- Be information-dense, not padded — this app is timed for a live demo, so
  every agent is told to write tight sentences and never restate the
  question, without ever changing how many items a schema requires
- Respond with ONLY a JSON object matching the given shape, nothing else

## The orchestrator decides the order

`lib/ai/orchestrator.ts` runs the agents in 4 rounds, in an order that
respects what each one actually needs as input (you can't analyze
competitors' relationship to a company before you know what the company
does). Agents that don't depend on each other run in parallel to keep the
whole analysis fast:

```
Round 1: ResearchAgent (has live web search)
Round 2 (parallel): MarketAgent, ProductAgent, BusinessModelAgent,
                     TractionAgent (has live web search), CompetitionAgent,
                     FounderAgent (has live web search), PegasusFitAgent,
                     JapanAgent
Round 3 (parallel): MoatAgent, StrategicFitAgent, DevilsAdvocateAgent
Round 4: DiligenceAgent, then MemoAgent
```

PegasusFitAgent and JapanAgent only ever needed Round 1's output, so they
run alongside Round 2 instead of waiting behind it for no reason — that
used to needlessly add a whole extra round of latency to a live analysis.

## How output gets validated

Every agent's raw text response goes through `lib/ai/callAgent.ts`, which:

1. Strips markdown code fences if the model added them anyway
2. Parses the result as JSON
3. Validates it against that agent's Zod schema (`lib/ai/schemas.ts`)
4. If invalid, sends it back once with the specific validation error and
   asks for a corrected version
5. If still invalid, throws an `AgentError` naming exactly which agent and
   why — the API route catches this and falls back to demo data rather than
   showing the user broken output
