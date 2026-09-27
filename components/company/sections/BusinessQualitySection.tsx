import { Card, CardContent } from "@/components/ui/card";
import { SectionShell, SubHeading } from "@/components/analysis/SectionShell";
import { CompanyClaimBlock } from "../CompanyClaimBlock";
import { SnapshotMetric } from "../SnapshotMetric";
import type { BusinessQuality, FinancialSnapshot } from "@/lib/ai/company-schemas";

export function BusinessQualitySection({
  businessQuality,
  financials,
}: {
  businessQuality: BusinessQuality;
  financials: FinancialSnapshot;
}) {
  return (
    <SectionShell title="Business Quality Engine" description="Not just what the numbers are — why they're moving.">
      <Card>
        <CardContent className="grid grid-cols-2 gap-5 p-5 sm:grid-cols-4">
          <SnapshotMetric financials={financials} metricKey="revenue_growth_yoy" label="Revenue Growth YoY" kind="pct" />
          <SnapshotMetric financials={financials} metricKey="revenue_cagr_3y" label="Revenue CAGR (3y)" kind="pct" />
          <SnapshotMetric financials={financials} metricKey="revenue_cagr_5y" label="Revenue CAGR (5y)" kind="pct" />
          <SnapshotMetric financials={financials} metricKey="eps_growth_yoy" label="EPS Growth YoY" kind="pct" />
          <SnapshotMetric financials={financials} metricKey="gross_margin" label="Gross Margin" kind="pct" />
          <SnapshotMetric financials={financials} metricKey="operating_margin" label="Operating Margin" kind="pct" />
          <SnapshotMetric financials={financials} metricKey="net_margin" label="Net Margin" kind="pct" />
          <SnapshotMetric financials={financials} metricKey="roe" label="ROE" kind="pct" />
          <SnapshotMetric financials={financials} metricKey="roic" label="ROIC (approx.)" kind="pct" />
          <SnapshotMetric financials={financials} metricKey="debt_to_equity" label="Debt / Equity" kind="ratio" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-5">
          <SubHeading>The Economic Engine</SubHeading>
          <CompanyClaimBlock claim={businessQuality.economicEngineSummary} />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Why Is Growth Changing?</SubHeading>
            <div className="flex flex-wrap gap-1.5">
              {businessQuality.primaryGrowthDrivers.map((d) => (
                <span key={d} className="rounded-sm bg-signal-50 px-2 py-0.5 text-xs font-medium text-signal-700">
                  {d.replace(/_/g, " ")}
                </span>
              ))}
            </div>
            <CompanyClaimBlock claim={businessQuality.growthDriverExplanation} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Why Are Margins Changing?</SubHeading>
            <div className="flex flex-wrap gap-1.5">
              {businessQuality.primaryMarginDrivers.map((d) => (
                <span key={d} className="rounded-sm bg-signal-50 px-2 py-0.5 text-xs font-medium text-signal-700">
                  {d.replace(/_/g, " ")}
                </span>
              ))}
            </div>
            <CompanyClaimBlock claim={businessQuality.marginDriverExplanation} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
          <CompanyClaimBlock label="Customer Concentration" claim={businessQuality.customerConcentration} />
          <CompanyClaimBlock label="Geographic Concentration" claim={businessQuality.geographicConcentration} />
          <CompanyClaimBlock label="Capital Intensity" claim={businessQuality.capitalIntensity} />
          <CompanyClaimBlock label="Working Capital Trend" claim={businessQuality.workingCapitalTrend} />
          <CompanyClaimBlock label="Recurring Revenue Character" claim={businessQuality.recurringRevenueCharacter} />
        </CardContent>
      </Card>

      {businessQuality.segmentEconomics.length > 0 && (
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Segment Economics</SubHeading>
            <div className="space-y-2">
              {businessQuality.segmentEconomics.map((s, i) => (
                <div key={i} className="text-sm">
                  <span className="font-medium text-ink-900">{s.segment}:</span> <span className="text-ink-700">{s.note}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </SectionShell>
  );
}
