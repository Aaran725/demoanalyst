import { Card, CardContent } from "@/components/ui/card";
import { SectionShell, SubHeading } from "@/components/analysis/SectionShell";
import { CompanyClaimBlock } from "../CompanyClaimBlock";
import { CompanyEvidenceTag } from "../CompanyEvidenceTag";
import { SnapshotMetric } from "../SnapshotMetric";
import { formatMoney } from "@/lib/company-format";
import type { ValuationEngine, FinancialSnapshot } from "@/lib/ai/company-schemas";

const ZONE_LABEL: Record<string, string> = {
  strong_value: "Strong Value",
  attractive: "Attractive",
  fair_value: "Fair Value",
  expensive: "Expensive",
  extreme_expectation: "Extreme Expectation",
};
const ZONE_COLOR: Record<string, string> = {
  strong_value: "border-tier-verified bg-tier-verifiedBg",
  attractive: "border-tier-verified bg-tier-verifiedBg",
  fair_value: "border-tier-estimate bg-tier-estimateBg",
  expensive: "border-tier-inference bg-tier-inferenceBg",
  extreme_expectation: "border-tier-unverified bg-tier-unverifiedBg",
};

export function ValuationSection({ valuation, financials }: { valuation: ValuationEngine; financials: FinancialSnapshot }) {
  return (
    <SectionShell title="Valuation Engine" description="What today's price already assumes — not a single 'fair value' guess.">
      <Card>
        <CardContent className="grid grid-cols-2 gap-5 p-5 sm:grid-cols-4">
          <SnapshotMetric financials={financials} metricKey="pe_ratio" label="P/E (trailing)" kind="ratio" />
          <SnapshotMetric financials={financials} metricKey="ps_ratio" label="P/S" kind="ratio" />
          <SnapshotMetric financials={financials} metricKey="pb_ratio" label="P/B" kind="ratio" />
          <SnapshotMetric financials={financials} metricKey="ev_to_sales" label="EV/Sales" kind="ratio" />
          <SnapshotMetric financials={financials} metricKey="ev_to_ebitda_approx" label="EV/EBITDA (approx.)" kind="ratio" />
          <SnapshotMetric financials={financials} metricKey="fcf_yield" label="FCF Yield" kind="pct" />
          <SnapshotMetric financials={financials} metricKey="roic" label="ROIC (approx.)" kind="pct" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-5">
          <SubHeading>What Is the Market Already Pricing In?</SubHeading>
          <p className="text-sm leading-relaxed text-ink-800">{valuation.valuationSummaryNarrative}</p>
          <div className="rounded-md bg-ink-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">Reverse DCF (Implied Growth Required)</span>
              <CompanyEvidenceTag tier="estimate" />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold text-ink-950">
                  {valuation.reverseDcf.impliedRevenueGrowthPct !== null
                    ? `${valuation.reverseDcf.impliedRevenueGrowthPct.toFixed(1)}%`
                    : "N/A"}
                </div>
                <div className="text-[11px] uppercase tracking-wide text-ink-400">Revenue Growth / yr</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ink-950">
                  {valuation.reverseDcf.impliedOperatingMarginPct !== null
                    ? `${valuation.reverseDcf.impliedOperatingMarginPct.toFixed(1)}%`
                    : "N/A"}
                </div>
                <div className="text-[11px] uppercase tracking-wide text-ink-400">Held Operating Margin</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ink-950">{valuation.reverseDcf.yearsModeled}yr</div>
                <div className="text-[11px] uppercase tracking-wide text-ink-400">Modeled</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-700">{valuation.reverseDcf.assumptionsNarrative}</p>
            <p className="mt-2 text-xs italic text-ink-400">{valuation.reverseDcf.methodologyNote}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-5">
          <SubHeading>Price Opportunity Zones — What Price Becomes Interesting?</SubHeading>
          <div className="space-y-2">
            {valuation.priceOpportunityZones.map((z) => (
              <div key={z.zone} className={`rounded-md border p-3 ${ZONE_COLOR[z.zone] ?? ""}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink-900">{ZONE_LABEL[z.zone] ?? z.zone}</span>
                  <span className="font-mono text-sm font-semibold text-ink-900">
                    {z.rangeLow !== null || z.rangeHigh !== null
                      ? `${z.rangeLow !== null ? formatMoney(z.rangeLow) : "$0"} – ${z.rangeHigh !== null ? formatMoney(z.rangeHigh) : "∞"}`
                      : "DATA NOT AVAILABLE"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-600">{z.rationale}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-5">
          <SubHeading>Expectation Gap</SubHeading>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-ink-100 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">Market Implied</div>
              <p className="mt-1 text-sm text-ink-700">{valuation.expectationGap.marketImpliedSummary}</p>
            </div>
            <div className="rounded-md border border-ink-100 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">Historical Performance</div>
              <p className="mt-1 text-sm text-ink-700">{valuation.expectationGap.historicalPerformanceSummary}</p>
            </div>
          </div>
          <CompanyClaimBlock label="Analyst Consensus" claim={valuation.expectationGap.analystConsensusSummary} />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-tier-estimate/30 bg-tier-estimateBg p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">AARAN AI Base Scenario</div>
              <p className="mt-1 text-sm text-ink-700">{valuation.expectationGap.baseScenario}</p>
            </div>
            <div className="rounded-md border border-tier-verified/30 bg-tier-verifiedBg p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">Bull Scenario</div>
              <p className="mt-1 text-sm text-ink-700">{valuation.expectationGap.bullScenario}</p>
            </div>
            <div className="rounded-md border border-tier-unverified/30 bg-tier-unverifiedBg p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">Bear Scenario</div>
              <p className="mt-1 text-sm text-ink-700">{valuation.expectationGap.bearScenario}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  );
}
