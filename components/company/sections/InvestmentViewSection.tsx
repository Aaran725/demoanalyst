import { Card, CardContent } from "@/components/ui/card";
import { CompanyEvidenceTag } from "../CompanyEvidenceTag";
import { formatMoney } from "@/lib/company-format";
import type { InvestmentView } from "@/lib/ai/company-schemas";
import { cn } from "@/lib/utils";

const VIEW_LABEL: Record<InvestmentView["view"], string> = {
  buy_range: "BUY RANGE",
  hold_watch: "HOLD / WATCH",
  reduce_sell_review: "REDUCE / SELL REVIEW",
};
const VIEW_COLOR: Record<InvestmentView["view"], string> = {
  buy_range: "text-tier-verified",
  hold_watch: "text-tier-estimate",
  reduce_sell_review: "text-tier-unverified",
};

const QUALITY_COLOR: Record<string, string> = {
  strong: "text-tier-verified",
  mixed: "text-tier-estimate",
  weak: "text-tier-unverified",
  strengthening: "text-tier-verified",
  stable: "text-tier-estimate",
  weakening: "text-tier-unverified",
  low: "text-tier-verified",
  moderate: "text-tier-estimate",
  high: "text-tier-unverified",
  extreme: "text-tier-unverified",
};

function Dimension({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <div className="text-[11px] font-medium uppercase tracking-wide text-ink-400">{label}</div>
      <div className={cn("text-sm font-semibold uppercase", QUALITY_COLOR[value] ?? "text-ink-800")}>
        {value.replace(/_/g, " ")}
      </div>
    </div>
  );
}

export function InvestmentViewSection({ view, currentPrice }: { view: InvestmentView; currentPrice: number | null }) {
  return (
    <Card className="border-2 border-ink-900">
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Investment View</div>
            <div className={cn("text-3xl font-bold tracking-tight", VIEW_COLOR[view.view])}>{VIEW_LABEL[view.view]}</div>
          </div>
          <CompanyEvidenceTag tier="estimate" className="text-xs" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Current Price</div>
            <div className="font-mono text-lg font-semibold text-ink-950">{formatMoney(currentPrice)}</div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Base Case</div>
            <div className="font-mono text-lg font-semibold text-ink-950">
              {formatMoney(view.baseCaseLow)}–{formatMoney(view.baseCaseHigh)}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Bull Case</div>
            <div className="font-mono text-lg font-semibold text-tier-verified">{formatMoney(view.bullCaseValue)}</div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Bear Case</div>
            <div className="font-mono text-lg font-semibold text-tier-unverified">{formatMoney(view.bearCaseValue)}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 sm:grid-cols-4">
          <Dimension label="Business Quality" value={view.businessQuality} />
          <Dimension label="Financial Quality" value={view.financialQuality} />
          <Dimension label="Valuation Risk" value={view.valuationRisk} />
          <Dimension label="Earnings Quality" value={view.earningsQuality} />
          <Dimension label="Moat Direction" value={view.moatDirection} />
          <Dimension label="Management Execution" value={view.managementExecution} />
          <Dimension label="Expectation Risk" value={view.expectationRisk} />
          <Dimension label="Confidence" value={view.confidenceLevel} />
        </div>

        <div className="border-t border-ink-100 pt-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Time Horizon</div>
          <div className="text-sm text-ink-800">{view.timeHorizon}</div>
        </div>

        <div className="rounded-md bg-ink-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Why</div>
          <p className="mt-1 text-sm leading-relaxed text-ink-800">{view.whyNarrative}</p>
        </div>

        <p className="text-xs italic text-ink-400">
          This is an analytical research output, not a guarantee of future performance or personalized
          financial advice.
        </p>
      </CardContent>
    </Card>
  );
}
