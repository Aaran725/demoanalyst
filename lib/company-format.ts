/** Formatting helpers shared by every public-equity UI component. */

export function formatMoney(value: number | null): string {
  if (value === null || Number.isNaN(value)) return "DATA NOT AVAILABLE";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e12) return `${sign}$${(abs / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(1)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}

export function formatPct(value: number | null, digits = 1): string {
  if (value === null || Number.isNaN(value)) return "DATA NOT AVAILABLE";
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatRatio(value: number | null, digits = 1): string {
  if (value === null || Number.isNaN(value)) return "DATA NOT AVAILABLE";
  return `${value.toFixed(digits)}x`;
}

export function formatSignedPct(value: number | null, digits = 1): string {
  if (value === null || Number.isNaN(value)) return "DATA NOT AVAILABLE";
  const sign = value >= 0 ? "+" : "";
  return `${sign}${(value * 100).toFixed(digits)}%`;
}

export function arrow(value: number | null): "↑" | "↓" | "" {
  if (value === null) return "";
  return value >= 0 ? "↑" : "↓";
}
