import { buildSystemPrompt, describeStartup } from "./shared";
import type { StartupInput, StartupSnapshot } from "../schemas";

/** MarketAgent — sizes the market and explains market timing ("why now"). */
export function buildMarketPrompt(input: StartupInput, snapshot: StartupSnapshot) {
  const system = buildSystemPrompt(`
Your job: analyze the market this startup competes in.

Cover category, TAM/SAM/SOM, growth rate, market drivers, customer demand
signals, technology trends, regulatory environment, and geographic
opportunity. Only give specific market-size numbers when you have a credible
basis for them — otherwise set status to "unknown" and say "Reliable
market-size data not verified" in the text. Explain why now might be a
meaningful moment for this market, and what could change or undermine it.
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
