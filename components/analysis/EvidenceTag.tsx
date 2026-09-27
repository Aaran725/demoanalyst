import { AlertTriangle, CheckCircle2, HelpCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvidenceStatus } from "@/lib/ai/schemas";

/**
 * The Evidence Engine badge. Every claim in the app shows one of these four
 * labels so the reader always knows whether they're looking at a verified
 * fact, the AI's own reasoning, an assumption the thesis depends on, or
 * something nobody could establish. See lib/ai/schemas.ts for the full
 * explanation of why this exists.
 */
const CONFIG: Record<
  EvidenceStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  verified_fact: {
    label: "VERIFIED FACT",
    icon: CheckCircle2,
    className: "bg-evidence-factBg text-evidence-fact",
  },
  ai_analysis: {
    label: "AI ANALYSIS",
    icon: Sparkles,
    className: "bg-evidence-analysisBg text-evidence-analysis",
  },
  assumption: {
    label: "ASSUMPTION",
    icon: AlertTriangle,
    className: "bg-evidence-assumptionBg text-evidence-assumption",
  },
  unknown: {
    label: "UNKNOWN",
    icon: HelpCircle,
    className: "bg-evidence-unknownBg text-evidence-unknown",
  },
};

export function EvidenceTag({ status, className }: { status: EvidenceStatus; className?: string }) {
  const { label, icon: Icon, className: colorClass } = CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-wide",
        colorClass,
        className
      )}
    >
      <Icon size={11} strokeWidth={2.5} />
      {label}
    </span>
  );
}
