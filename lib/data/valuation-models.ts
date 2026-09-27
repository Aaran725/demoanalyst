/**
 * Deterministic valuation math — reverse DCF and price-opportunity-zone
 * boundaries. These are plain arithmetic, computed in code, NOT by an LLM.
 * A Claude agent later writes the plain-English narrative around these
 * numbers, but the orchestrator always overwrites the numeric fields with
 * what's computed here before the result reaches the UI — see
 * lib/ai/company-orchestrator.ts. This is the one place a hallucinated
 * number in a "computed metric" simply cannot survive.
 */

const DISCOUNT_RATE = 0.09;
const TERMINAL_GROWTH = 0.03;
const YEARS_MODELED = 10;

export interface ReverseDcfResult {
  impliedRevenueGrowthPct: number | null;
  impliedOperatingMarginPct: number | null;
  impliedTerminalGrowthPct: number;
  yearsModeled: number;
  discountRatePct: number;
  methodologyNote: string;
}

/**
 * Solves for the constant annual revenue growth rate that makes a simple
 * 10-year FCF projection (FCF margin held at today's level), discounted at
 * a fixed WACC assumption with a fixed terminal growth rate, equal today's
 * enterprise value. Deliberately simplified — margin and discount rate
 * aren't modeled year-by-year — and the methodology note says so plainly.
 */
export function computeReverseDcf(params: {
  enterpriseValue: number | null;
  latestRevenue: number | null;
  fcfMargin: number | null;
  operatingMarginPct: number | null;
}): ReverseDcfResult {
  const base: Omit<ReverseDcfResult, "impliedRevenueGrowthPct"> = {
    impliedOperatingMarginPct: params.operatingMarginPct !== null ? params.operatingMarginPct * 100 : null,
    impliedTerminalGrowthPct: TERMINAL_GROWTH * 100,
    yearsModeled: YEARS_MODELED,
    discountRatePct: DISCOUNT_RATE * 100,
    methodologyNote: `Simplified reverse DCF, not a full multi-driver model: solves for the single constant annual revenue growth rate over ${YEARS_MODELED} years, holding FCF margin at today's level, that makes the discounted FCF (at a ${(DISCOUNT_RATE * 100).toFixed(0)}% discount rate assumption with a ${(TERMINAL_GROWTH * 100).toFixed(0)}% terminal growth assumption) equal today's enterprise value. Real markets price in changing margins and multiple growth phases — this isolates one number for intuition, not a precise fair-value model.`,
  };

  const { enterpriseValue, latestRevenue, fcfMargin } = params;
  if (
    enterpriseValue === null ||
    latestRevenue === null ||
    fcfMargin === null ||
    fcfMargin <= 0 ||
    enterpriseValue <= 0 ||
    latestRevenue <= 0
  ) {
    return { impliedRevenueGrowthPct: null, ...base };
  }

  function pvAtGrowth(g: number): number {
    let revenue = latestRevenue as number;
    let fcf = 0;
    let pv = 0;
    for (let t = 1; t <= YEARS_MODELED; t++) {
      revenue = revenue * (1 + g);
      fcf = revenue * (fcfMargin as number);
      pv += fcf / Math.pow(1 + DISCOUNT_RATE, t);
    }
    if (DISCOUNT_RATE <= TERMINAL_GROWTH) return pv;
    const terminalValue = (fcf * (1 + TERMINAL_GROWTH)) / (DISCOUNT_RATE - TERMINAL_GROWTH);
    pv += terminalValue / Math.pow(1 + DISCOUNT_RATE, YEARS_MODELED);
    return pv;
  }

  let lo = -0.3;
  let hi = 2.0;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (pvAtGrowth(mid) < enterpriseValue) lo = mid;
    else hi = mid;
  }

  return { impliedRevenueGrowthPct: ((lo + hi) / 2) * 100, ...base };
}

export type PriceZoneKey = "strong_value" | "attractive" | "fair_value" | "expensive" | "extreme_expectation";

export interface PriceZoneBoundary {
  zone: PriceZoneKey;
  rangeLow: number | null;
  rangeHigh: number | null;
  fcfYieldLow: number | null;
  fcfYieldHigh: number | null;
}

/**
 * Price-opportunity zones, derived from FCF-yield thresholds against the
 * company's own trailing free cash flow per share. Every boundary is a
 * transparent function of a real, already-verified number (FCF) — no zone
 * boundary is picked by an LLM.
 */
export function computePriceZones(fcfPerShare: number | null): PriceZoneBoundary[] {
  const thresholds: { zone: PriceZoneKey; yieldLow: number; yieldHigh: number | null }[] = [
    { zone: "strong_value", yieldLow: 0.08, yieldHigh: null },
    { zone: "attractive", yieldLow: 0.05, yieldHigh: 0.08 },
    { zone: "fair_value", yieldLow: 0.03, yieldHigh: 0.05 },
    { zone: "expensive", yieldLow: 0.015, yieldHigh: 0.03 },
    { zone: "extreme_expectation", yieldLow: 0, yieldHigh: 0.015 },
  ];

  if (fcfPerShare === null || fcfPerShare <= 0) {
    return thresholds.map((t) => ({ zone: t.zone, rangeLow: null, rangeHigh: null, fcfYieldLow: t.yieldLow, fcfYieldHigh: t.yieldHigh }));
  }

  return thresholds.map((t) => ({
    zone: t.zone,
    // price = FCF per share / yield — a higher required yield means a lower price.
    rangeHigh: t.yieldLow > 0 ? fcfPerShare / t.yieldLow : null,
    rangeLow: t.yieldHigh !== null ? fcfPerShare / t.yieldHigh : null,
    fcfYieldLow: t.yieldLow,
    fcfYieldHigh: t.yieldHigh,
  }));
}
