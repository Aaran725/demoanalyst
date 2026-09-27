import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/company-format";
import type { FinancialSnapshot } from "@/lib/ai/company-schemas";

export function CompanyHeader({ financials, isDemoData }: { financials: FinancialSnapshot; isDemoData: boolean }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">{financials.companyName}</h1>
          <span className="rounded-sm bg-ink-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-ink-600">
            {financials.ticker}
          </span>
          {isDemoData && <Badge variant="outline">DEMO DATA</Badge>}
        </div>
        <p className="mt-1 text-sm text-ink-400">{financials.sector ?? "Sector: DATA NOT AVAILABLE"}</p>
      </div>
      <div className="flex gap-6 text-right">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Price</div>
          <div className="font-mono text-xl font-semibold text-ink-950">{formatMoney(financials.price)}</div>
          <div className="text-[11px] text-ink-300">as of {financials.priceAsOf ?? "unknown"}</div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Market Cap</div>
          <div className="font-mono text-xl font-semibold text-ink-950">{formatMoney(financials.marketCap)}</div>
        </div>
      </div>
    </div>
  );
}
