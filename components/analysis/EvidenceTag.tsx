import { cn } from "@/lib/utils";
import type { EvidenceStatus } from "@/lib/ai/schemas";

/**
 * The Evidence Engine badge. Every claim in the app shows one of these four
 * labels so the reader always knows whether they're looking at a verified
 * fact, the AI's own reasoning, an assumption the thesis depends on, or
 * something nobody could establish. See lib/ai/schemas.ts for the full
 * explanation of why this exists. Colors are locked (verified_fact/
 * ai_analysis/assumption/unknown map 1:1 to tailwind.config.ts's `evidence`
 * scale) — only the pill+dot presentation below is up for redesign.
 */
const CONFIG: Record<EvidenceStatus, { label: string; className: string; dotClassName: string }> = {
  verified_fact: {
    label: "VERIFIED FACT",
    className: "bg-evidence-factBg text-evidence-fact",
    dotClassName: "bg-evidence-fact",
  },
  ai_analysis: {
    label: "AI ANALYSIS",
    className: "bg-evidence-analysisBg text-evidence-analysis",
    dotClassName: "bg-evidence-analysis",
  },
  assumption: {
    label: "ASSUMPTION",
    className: "bg-evidence-assumptionBg text-evidence-assumption",
    dotClassName: "bg-evidence-assumption",
  },
  unknown: {
    label: "UNKNOWN",
    className: "bg-evidence-unknownBg text-evidence-unknown",
    dotClassName: "bg-evidence-unknown",
  },
};

export function EvidenceTag({ status, className }: { status: EvidenceStatus; className?: string }) {
  const { label, className: colorClass, dotClassName } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide",
        colorClass,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClassName)} />
      {label}
    </span>
  );
}
