import { MetricStat } from "./CompanyClaimBlock";
import { formatMoney, formatPct, formatRatio } from "@/lib/company-format";
import type { FinancialSnapshot } from "@/lib/ai/company-schemas";

/** Looks up one metric by key from a FinancialSnapshot and renders it as a MetricStat — the standard way every section shows a computed number. */
export function SnapshotMetric({
  financials,
  metricKey,
  label,
  kind = "number",
}: {
  financials: FinancialSnapshot;
  metricKey: string;
  label: string;
  kind?: "money" | "pct" | "ratio" | "number";
}) {
  const dp = financials.metrics[metricKey];
  if (!dp) {
    return <MetricStat label={label} formatted="DATA NOT AVAILABLE" confidence="unverified" />;
  }
  const formatted =
    kind === "money"
      ? formatMoney(dp.value)
      : kind === "pct"
        ? formatPct(dp.value)
        : kind === "ratio"
          ? formatRatio(dp.value)
          : dp.value !== null
            ? String(dp.value)
            : "DATA NOT AVAILABLE";
  return <MetricStat label={label} formatted={formatted} confidence={dp.confidence} source={dp.source} note={dp.note} />;
}
