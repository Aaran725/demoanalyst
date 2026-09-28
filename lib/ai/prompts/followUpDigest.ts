import type { FollowUpDigest, FullAnalysis } from "../schemas";

/**
 * Condenses a full FullAnalysis into what FollowUpAgent needs — modeled on
 * memoDigest.ts's pattern, but richer/narrative rather than numeric-only
 * (unlike comparisonDigest.ts), since answering an arbitrary live question
 * needs real prose context to draw on, not just counts.
 *
 * Runs CLIENT-SIDE (in FollowUpQA.tsx, before the fetch), so only this
 * digest — never the full analysis — goes over the wire to /api/follow-up.
 */
export function buildFollowUpDigest(analysis: FullAnalysis): FollowUpDigest {
  const { snapshot, market, traction, competitors, moat, founders, devilsAdvocate, strategicFit, businessModel } =
    analysis;

  return {
    company: { name: snapshot.companyName, sector: snapshot.sector, stage: snapshot.stage },
    snapshot: {
      problem: snapshot.problem.text,
      solution: snapshot.solution.text,
      product: snapshot.product.text,
      customer: snapshot.customer.text,
      businessModelSummary: snapshot.businessModelSummary.text,
      whyNow: snapshot.whyNow.text,
    },
    market: {
      category: market.category,
      tam: market.tam.text,
      sam: market.sam.text,
      som: market.som.text,
      whyNow: market.whyNow,
    },
    traction: {
      revenue: traction.revenue.text,
      arr: traction.arr.text,
      growth: traction.growth.text,
      customers: traction.customers.text,
      signals: traction.signals,
    },
    competitors: competitors.competitors.map((c) => ({
      name: c.name,
      category: c.category,
      differentiation: c.differentiation,
    })),
    moatSummary: moat.factors.map((f) => ({ factor: f.factor, strength: f.strength, reasoning: f.reasoning })),
    founders: founders.founders.map((f) => ({
      name: f.name,
      role: f.role,
      background: f.background.map((c) => c.text),
    })),
    devilsAdvocate: {
      reasonsThisCouldFail: devilsAdvocate.reasonsThisCouldFail,
      whatWouldMakeTheThesisWrong: devilsAdvocate.whatWouldMakeTheThesisWrong,
    },
    strategicFitSummaries: strategicFit.matches.map((m) => `${m.companyOrIndustry}: ${m.rationale}`),
    openQuestions: [...businessModel.openQuestions],
  };
}
