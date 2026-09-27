import { buildCompanySystemPrompt, describeFinancials } from "./shared";
import type { FinancialSnapshot } from "../../company-schemas";
import type { BusinessQuality, MoatEngine, ValuationEngine } from "../../company-schemas";

/** BullAgent — builds the strongest evidence-supported case, using only real evidence already gathered. */
export function buildBullPrompt(
  snapshot: FinancialSnapshot,
  businessQuality: BusinessQuality,
  moat: MoatEngine,
  valuation: ValuationEngine
) {
  const system = buildCompanySystemPrompt(`
Your job: build the strongest EVIDENCE-SUPPORTED bull case for this stock.
You are an advocate, not a cheerleader — every point must trace back to a
real number or a specific, checkable piece of evidence from the research
already gathered below. Do not use hype language. Do not claim certainty.
`);

  const user = `
${describeFinancials(snapshot)}

Business quality research: ${JSON.stringify(businessQuality)}
Moat research: ${JSON.stringify(moat)}
Valuation research: ${JSON.stringify(valuation)}

Respond with ONLY a JSON object with exactly these keys:
{
  "thesisStatement": string,
  "strongestEvidence": [
    {"point": string, "confidence": "verified"|"estimate"|"consensus"|"inference"|"unverified", "sources"?: [{"label": string, "url"?: string, "date"?: string, "claimSupported": string}]}
  ],
  "keyDrivers": string[]
}
Include at least 3 strongestEvidence entries, each tracing to something
specific in the research above — no generic "strong market position" points.
`.trim();

  return { system, user };
}
