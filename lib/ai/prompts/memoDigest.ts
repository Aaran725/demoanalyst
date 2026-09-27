import type { Claim, FullAnalysis, Source } from "../schemas";

/**
 * A condensed version of the full analysis, built specifically for
 * MemoAgent. The full analysis (every claim's sources, every moat factor's
 * paragraph of reasoning, every Japan localization detail) is a lot of text
 * that MemoAgent doesn't actually need — its whole job is a 3-5 sentence
 * executive summary plus a missing-information list and a source list.
 * Sending it the full nested JSON just makes its prompt bigger and slower
 * to process for no benefit. This digest keeps only what that job needs.
 */
export interface MemoDigest {
  company: { name: string; sector: string; stage: string };
  snapshotHighlights: Record<string, string>;
  market: { category: string; tam: string; sam: string; som: string; growthRate: string; whyNow: string };
  traction: { revenue: string; arr: string; growth: string; customers: string; signals: string[] };
  businessModel: { revenueModel: string; scalability: string; risks: string[]; openQuestions: string[] };
  competitors: { name: string; category: string }[];
  moatSummary: { factor: string; strength: string }[];
  founders: { name: string; role?: string }[];
  strategicFitHighlights: string[];
  devilsAdvocate: { reasonsThisCouldFail: string[]; whatWouldMakeTheThesisWrong: string };
  criticalQuestions: string[];
  nextDiligenceCritical: string[];
  /** Computed here, not left to the LLM to re-derive from scratch. */
  allUnknownClaims: string[];
  allSources: Source[];
}

type AnalysisSections = Omit<FullAnalysis, "id" | "createdAt" | "isDemoData" | "icMemo" | "input">;

export function buildMemoDigest(analysis: AnalysisSections): MemoDigest {
  const { snapshot, market, businessModel, traction, competitors, moat, founders, strategicFit, devilsAdvocate, criticalQuestions, nextDiligence } = analysis;

  return {
    company: { name: snapshot.companyName, sector: snapshot.sector, stage: snapshot.stage },
    snapshotHighlights: {
      headquarters: snapshot.headquarters.text,
      founded: snapshot.founded.text,
      fundingRaised: snapshot.fundingRaised.text,
      employees: snapshot.employees.text,
      problem: snapshot.problem.text,
      solution: snapshot.solution.text,
      product: snapshot.product.text,
      customer: snapshot.customer.text,
      businessModelSummary: snapshot.businessModelSummary.text,
      whyNow: snapshot.whyNow.text,
      tractionSummary: snapshot.tractionSummary.text,
    },
    market: {
      category: market.category,
      tam: market.tam.text,
      sam: market.sam.text,
      som: market.som.text,
      growthRate: market.growthRate.text,
      whyNow: market.whyNow,
    },
    traction: {
      revenue: traction.revenue.text,
      arr: traction.arr.text,
      growth: traction.growth.text,
      customers: traction.customers.text,
      signals: traction.signals,
    },
    businessModel: {
      revenueModel: businessModel.revenueModel.text,
      scalability: businessModel.scalability.text,
      risks: businessModel.risks,
      openQuestions: businessModel.openQuestions,
    },
    competitors: competitors.competitors.map((c) => ({ name: c.name, category: c.category })),
    moatSummary: moat.factors.map((f) => ({ factor: f.factor, strength: f.strength })),
    founders: founders.founders.map((f) => ({ name: f.name, role: f.role })),
    strategicFitHighlights: strategicFit.matches
      .filter((m) => m.confidence === "high" || m.confidence === "medium")
      .map((m) => m.companyOrIndustry),
    devilsAdvocate: {
      reasonsThisCouldFail: devilsAdvocate.reasonsThisCouldFail,
      whatWouldMakeTheThesisWrong: devilsAdvocate.whatWouldMakeTheThesisWrong,
    },
    criticalQuestions: criticalQuestions.questions.map((q) => q.question),
    nextDiligenceCritical: nextDiligence.items
      .filter((i) => i.priority === "critical")
      .map((i) => i.item),
    allUnknownClaims: collectUnknownClaims(analysis),
    allSources: collectAllSources(analysis),
  };
}

/** Walks every claim-shaped value in the analysis and collects "unknown" ones, labeled by where they came from. */
function collectUnknownClaims(analysis: AnalysisSections): string[] {
  const found: string[] = [];
  walkClaims(analysis, (path, claim) => {
    if (claim.status === "unknown") found.push(`${path}: ${claim.text}`);
  });
  return found;
}

/** Walks every claim-shaped value in the analysis and collects every source, deduped by label+url. */
function collectAllSources(analysis: AnalysisSections): Source[] {
  const seen = new Map<string, Source>();
  walkClaims(analysis, (_path, claim) => {
    claim.sources?.forEach((s) => seen.set(`${s.label}|${s.url ?? ""}`, s));
  });
  return Array.from(seen.values());
}

/** Recurses through an object/array tree and calls `visit` on anything shaped like a Claim. */
function walkClaims(value: unknown, visit: (path: string, claim: Claim) => void, path = ""): void {
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkClaims(item, visit, `${path}[${i}]`));
    return;
  }
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.text === "string" && typeof obj.status === "string") {
      visit(path, obj as unknown as Claim);
      return;
    }
    for (const [key, child] of Object.entries(obj)) {
      walkClaims(child, visit, path ? `${path}.${key}` : key);
    }
  }
}
