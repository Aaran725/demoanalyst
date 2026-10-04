import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot } from "../schemas";

/** MarketAgent — sizes the market and explains market timing ("why now"). */
export function buildMarketPrompt(input: StartupInput, snapshot: StartupSnapshot) {
  const system = buildSystemPrompt(`
Your job: analyze the market this startup competes in.

Cover category, TAM/SAM/SOM, growth rate, market drivers, customer demand
signals, technology trends, regulatory environment, and geographic
opportunity. Explain why now might be a meaningful moment for this market,
and what could change or undermine it.

TAM/SAM/SOM AND GROWTH RATE — you have live web search. USE IT to find a
real, credible, cited estimate for each: a market research firm (Gartner,
IDC, Grand View Research, etc.), an analyst report, or credible press
coverage of market sizing for this category. When you find one, report it
as "verified_fact" with a real source. Different publishers often estimate
differently — that's normal and expected, not a reason to give up. Pick
the most credible/recent figure you find, cite its real source, and note
in the text that estimates vary by methodology if relevant — that
combination is still a "verified_fact" with a real source, not "unknown."
A specific remembered number you cannot actually search for and cite is
still not acceptable (never invent one), but "I didn't bother to search"
is not the same as "no credible estimate exists" — for almost any notable
market, one does, and you have the tool to find it. Only use "unknown",
with "Reliable market-size data not verified" in the text, when you
genuinely searched and found nothing credible.
`);

  const user = `
${describeStartup(input)}

Research so far (from ResearchAgent):
${JSON.stringify(snapshot, null, 2)}

Respond with ONLY a JSON object with exactly these keys:
{
  "category": string,
  "tam": Claim, "sam": Claim, "som": Claim,
  "growthRate": Claim,
  "marketDrivers": Claim[],
  "customerDemandSignals": Claim[],
  "technologyTrends": Claim[],
  "regulatoryEnvironment": Claim,
  "geographicOpportunity": Claim,
  "whyNow": string,
  "whatCouldChangeThisMarket": string[]
}
Claim = { "text": string, "status": "verified_fact"|"ai_analysis"|"assumption"|"unknown", "sources"?: [{"label": string, "url"?: string, "date"?: string, "claimSupported": string}], "conflicting"?: boolean }
`.trim();

  return { system, user };
}
