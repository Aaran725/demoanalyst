import type {
  Claim,
  StartupSnapshot,
  MarketIntelligence,
  ProductAnalysis,
  BusinessModel,
  Traction,
  FounderAnalysis,
  FactCheckResult,
} from "./schemas";

export interface CollectedClaim {
  id: string;
  label: string;
  claim: Claim;
}

/**
 * Labels matching these patterns get sorted first, so a model that reads
 * top-to-bottom naturally checks the highest-value claims first even if it
 * doesn't perfectly follow the prompt's prioritization instructions.
 */
const HIGH_STAKES = [/^Traction >/, /^Snapshot > Funding Raised$/, /^Founder .* > Background/];

/**
 * Enumerates every real Claim-typed field across the sections that have
 * any (snapshot/market/product/businessModel/traction/founders — verified
 * against the actual schemas in schemas.ts, not a generic structural walk,
 * since we need human-readable labels for the prompt AND a safe way to
 * mutate the exact claim object in place afterward). Only claims already
 * marked "verified_fact" are candidates — there's nothing to independently
 * check about a claim the original research already called ai_analysis,
 * assumption, or unknown.
 */
export function collectVerifiedFactClaims(sections: {
  snapshot: StartupSnapshot;
  market: MarketIntelligence;
  product: ProductAnalysis;
  businessModel: BusinessModel;
  traction: Traction;
  founders: FounderAnalysis;
}): CollectedClaim[] {
  const out: CollectedClaim[] = [];
  let n = 0;

  const push = (label: string, claim: Claim) => {
    if (claim.status !== "verified_fact") return;
    // `claim` is the live object reference embedded in the analysis tree —
    // applyFactCheckVerdicts mutates it directly by id lookup, no string-path
    // parsing needed.
    out.push({ id: `fc-${n++}`, label, claim });
  };
  const pushList = (prefix: string, claims: Claim[]) => {
    claims.forEach((c, i) => push(`${prefix} #${i + 1}`, c));
  };

  const { snapshot, market, product, businessModel, traction, founders } = sections;

  push("Snapshot > Headquarters", snapshot.headquarters);
  push("Snapshot > Founded", snapshot.founded);
  push("Snapshot > Funding Raised", snapshot.fundingRaised);
  push("Snapshot > Employees", snapshot.employees);
  push("Snapshot > Problem", snapshot.problem);
  push("Snapshot > Solution", snapshot.solution);
  push("Snapshot > Product", snapshot.product);
  push("Snapshot > Customer", snapshot.customer);
  push("Snapshot > Business Model Summary", snapshot.businessModelSummary);
  push("Snapshot > Why Now", snapshot.whyNow);
  push("Snapshot > Traction Summary", snapshot.tractionSummary);
  push("Snapshot > Technology", snapshot.technology);

  push("Market > TAM", market.tam);
  push("Market > SAM", market.sam);
  push("Market > SOM", market.som);
  push("Market > Growth Rate", market.growthRate);
  push("Market > Regulatory Environment", market.regulatoryEnvironment);
  push("Market > Geographic Opportunity", market.geographicOpportunity);
  pushList("Market > Market Driver", market.marketDrivers);
  pushList("Market > Customer Demand Signal", market.customerDemandSignals);
  pushList("Market > Technology Trend", market.technologyTrends);

  push("Product > Technology Differentiation", product.technologyDifferentiation);
  push("Product > Workflow Differentiation", product.workflowDifferentiation);
  push("Product > Cost Advantage", product.costAdvantage);
  push("Product > Data Advantage", product.dataAdvantage);
  push("Product > Distribution Advantage", product.distributionAdvantage);
  push("Product > Customer Experience", product.customerExperience);
  push("Product > Switching Costs", product.switchingCosts);
  push("Product > Integration Advantage", product.integrationAdvantage);
  pushList("Product > Unique Aspect", product.uniqueAspects);

  push("Business Model > Revenue Model", businessModel.revenueModel);
  push("Business Model > Pricing Model", businessModel.pricingModel);
  push("Business Model > Recurring Revenue", businessModel.recurringRevenue);
  push("Business Model > Gross Margin Potential", businessModel.grossMarginPotential);
  push("Business Model > Customer Acquisition", businessModel.customerAcquisition);
  push("Business Model > Sales Cycle", businessModel.salesCycle);
  push("Business Model > Capital Intensity", businessModel.capitalIntensity);
  push("Business Model > Scalability", businessModel.scalability);
  push("Business Model > Customer Concentration", businessModel.customerConcentration);
  push("Business Model > Expansion Revenue", businessModel.expansionRevenue);
  push("Business Model > Distribution", businessModel.distribution);

  push("Traction > Revenue", traction.revenue);
  push("Traction > ARR", traction.arr);
  push("Traction > Growth", traction.growth);
  push("Traction > Customers", traction.customers);
  push("Traction > Users", traction.users);
  push("Traction > Retention", traction.retention);
  push("Traction > Partnerships", traction.partnerships);
  push("Traction > Funding", traction.funding);
  push("Traction > Product Adoption", traction.productAdoption);
  push("Traction > International Expansion", traction.internationalExpansion);

  founders.founders.forEach((f) => pushList(`Founder ${f.name} > Background`, f.background));

  out.sort(
    (a, b) =>
      Number(HIGH_STAKES.some((p) => p.test(b.label))) - Number(HIGH_STAKES.some((p) => p.test(a.label)))
  );
  return out;
}

/**
 * Mutates the ACTUAL claim objects embedded in the analysis tree in place —
 * this only works because collectVerifiedFactClaims handed back live
 * references, not copies. Must run before Diligence/Memo read these same
 * objects, so corrected data flows downstream instead of the original
 * unverified claims.
 *
 * Honest limitation: this does not guarantee zero wrong facts in the final
 * analysis. It only adds one extra, budget-limited independent check on
 * top of the original research. A claim not present in `result.checked`
 * (left out for budget reasons, never asserted as "fine" by the model
 * itself) is exactly as reliable as it was before this pass ran, no more.
 */
export function applyFactCheckVerdicts(candidates: CollectedClaim[], result: FactCheckResult): void {
  const byId = new Map(candidates.map((c) => [c.id, c]));
  for (const entry of result.checked) {
    const found = byId.get(entry.id);
    if (!found) continue; // model echoed an id we never sent — ignore rather than guess which claim it meant
    const { claim } = found;
    if (entry.verdict === "confirmed") {
      if (entry.source) claim.sources = [...(claim.sources ?? []), entry.source];
    } else if (entry.verdict === "contradicted") {
      if (entry.source) claim.sources = [...(claim.sources ?? []), entry.source];
      claim.conflicting = true;
      claim.status = "unknown"; // sources disagreeing means it's no longer honestly "established"
    } else if (entry.verdict === "inconclusive") {
      claim.status = "unknown";
    }
  }
}
