import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionShell, SubHeading } from "@/components/analysis/SectionShell";
import { CompanyClaimBlock } from "../CompanyClaimBlock";
import { CompanyEvidenceTag } from "../CompanyEvidenceTag";
import { SnapshotMetric } from "../SnapshotMetric";
import type { MoneyMachine, FinancialSnapshot } from "@/lib/ai/company-schemas";
import { cn } from "@/lib/utils";

const QOE_STYLE: Record<MoneyMachine["qualityOfEarnings"], string> = {
  strong: "text-tier-verified",
  mixed: "text-tier-estimate",
  weak: "text-tier-unverified",
};
const SEVERITY_VARIANT: Record<string, "low" | "medium" | "high"> = { low: "low", medium: "medium", high: "high" };

export function MoneyMachineSection({ moneyMachine, financials }: { moneyMachine: MoneyMachine; financials: FinancialSnapshot }) {
  return (
    <SectionShell title="Money Machine" description="An AI forensic accountant checking whether reported profit is backed by real cash.">
      <Card>
        <CardContent className="grid grid-cols-2 gap-5 p-5 sm:grid-cols-4">
          <SnapshotMetric financials={financials} metricKey="revenue_growth_yoy" label="Revenue" kind="pct" />
          <SnapshotMetric financials={financials} metricKey="free_cash_flow" label="Free Cash Flow" kind="money" />
          <SnapshotMetric financials={financials} metricKey="fcf_conversion" label="FCF Conversion" kind="pct" />
          <SnapshotMetric financials={financials} metricKey="net_debt" label="Net Debt" kind="money" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <SubHeading>Quality of Earnings</SubHeading>
            <span className={cn("text-lg font-bold uppercase", QOE_STYLE[moneyMachine.qualityOfEarnings])}>
              {moneyMachine.qualityOfEarnings}
            </span>
          </div>
          <CompanyClaimBlock claim={moneyMachine.qualityReasoning} />
        </CardContent>
      </Card>

      {moneyMachine.earningsQualityAlerts.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="space-y-3 p-5">
            <SubHeading>Earnings Quality Alerts</SubHeading>
            {moneyMachine.earningsQualityAlerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md border border-ink-100 bg-white p-3">
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-risk-medium" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink-900">{alert.alertText}</span>
                    <Badge variant={SEVERITY_VARIANT[alert.severity]}>{alert.severity.toUpperCase()}</Badge>
                  </div>
                  <p className="text-sm text-ink-600">{alert.explanation}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-3 p-5">
          <SubHeading>Discrepancy Checks</SubHeading>
          <div className="grid gap-2 sm:grid-cols-2">
            {moneyMachine.discrepancyChecks.map((d, i) => (
              <div key={i} className="space-y-1 rounded-md border border-ink-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">{d.area.replace(/_/g, " ")}</span>
                  <CompanyEvidenceTag tier={d.confidence} />
                </div>
                <p className="text-sm text-ink-700">{d.observation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  );
}
