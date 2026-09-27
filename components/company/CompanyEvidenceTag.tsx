import { CheckCircle2, Calculator, Users, Lightbulb, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConfidenceTier } from "@/lib/ai/company-schemas";

/**
 * The Truth Mode badge for public-equity claims — the 5-tier scale from the
 * product spec (🟢🟡🔵🟠🔴), distinct from the startup side's 4-tier
 * EvidenceTag. Every quantitative or qualitative claim on a company
 * dashboard renders one of these.
 */
const CONFIG: Record<ConfidenceTier, { label: string; icon: typeof CheckCircle2; className: string }> = {
  verified: { label: "VERIFIED", icon: CheckCircle2, className: "bg-tier-verifiedBg text-tier-verified" },
  estimate: { label: "ESTIMATE", icon: Calculator, className: "bg-tier-estimateBg text-tier-estimate" },
  consensus: { label: "CONSENSUS", icon: Users, className: "bg-tier-consensusBg text-tier-consensus" },
  inference: { label: "INFERENCE", icon: Lightbulb, className: "bg-tier-inferenceBg text-tier-inference" },
  unverified: { label: "UNVERIFIED", icon: HelpCircle, className: "bg-tier-unverifiedBg text-tier-unverified" },
};

export function CompanyEvidenceTag({ tier, className }: { tier: ConfidenceTier; className?: string }) {
  const { label, icon: Icon, className: colorClass } = CONFIG[tier];
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
