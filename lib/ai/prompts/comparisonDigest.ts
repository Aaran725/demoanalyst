import { computeEvidenceBreakdown, countCompetitorsByCategory } from "../../analysis-stats";
import type { ComparisonDigest, Confidence, FullAnalysis } from "../schemas";

/**
 * Condenses a full FullAnalysis into only what StartupComparisonAgent needs
 * — modeled on memoDigest.ts's pattern. Runs CLIENT-SIDE (in
 * app/world-cup/page.tsx, before the fetch), so only this small digest,
 * never the full analysis, goes over the wire to /api/compare-startups.
 */
export function buildComparisonDigest(analysis: FullAnalysis): ComparisonDigest {
  const evidence = computeEvidenceBreakdown(analysis);
  const competitorCounts = countCompetitorsByCategory(analysis.competitors.competitors);

  const moatCounts = { strong_evidence: 0, some_evidence: 0, weak_evidence: 0, unknown: 0 };
  analysis.moat.factors.forEach((f) => moatCounts[f.strength]++);

  const CONFIDENCE_RANK: Record<Confidence, number> = { high: 3, medium: 2, low: 1 };
  const topConfidence = analysis.strategicFit.matches.reduce<Confidence | null>(
    (top, m) => (!top || CONFIDENCE_RANK[m.confidence] > CONFIDENCE_RANK[top] ? m.confidence : top),
    null
  );

  return {
    id: analysis.id,
    company: {
      name: analysis.snapshot.companyName,
      sector: analysis.snapshot.sector,
      stage: analysis.snapshot.stage,
    },
    evidence,
    moatCounts,
    competitorCounts,
    traction: {
      revenue: analysis.traction.revenue.text,
      arr: analysis.traction.arr.text,
      growth: analysis.traction.growth.text,
      customers: analysis.traction.customers.text,
      signals: analysis.traction.signals,
    },
    topRisks: analysis.devilsAdvocate.reasonsThisCouldFail.slice(0, 3),
    strategicFit: { count: analysis.strategicFit.matches.length, topConfidence },
  };
}
