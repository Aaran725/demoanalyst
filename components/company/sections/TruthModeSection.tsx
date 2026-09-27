import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "@/components/analysis/SectionShell";
import { CompanyEvidenceTag } from "../CompanyEvidenceTag";
import { computeSourceAudit } from "@/lib/company-analysis-stats";
import type { FullCompanyAnalysis, ConfidenceTier } from "@/lib/ai/company-schemas";

const TIER_ORDER: ConfidenceTier[] = ["verified", "estimate", "consensus", "inference", "unverified"];
const TIER_LABEL: Record<ConfidenceTier, string> = {
  verified: "Verified",
  estimate: "Estimated",
  consensus: "Consensus",
  inference: "Inferences",
  unverified: "Unverified",
};

export function TruthModeSection({ analysis }: { analysis: FullCompanyAnalysis }) {
  const audit = computeSourceAudit(analysis);

  return (
    <SectionShell
      title="Truth Mode"
      description="Every significant claim in this report, tagged and counted — evidence coverage, not prediction accuracy."
    >
      <Card className="border-2 border-ink-900">
        <CardContent className="flex flex-col items-center gap-2 p-6 text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">Data Integrity</div>
          <div className="text-5xl font-bold text-ink-950">
            {audit.dataIntegrityPct !== null ? `${audit.dataIntegrityPct}%` : "N/A"}
          </div>
          <p className="max-w-md text-xs text-ink-400">
            Share of all tagged claims that are Verified, Estimated, or Consensus (grounded in something
            concrete) rather than bare Inference or Unverified. This measures evidence coverage and source
            quality — it is NOT a prediction-accuracy score.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500">Source Audit</div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {TIER_ORDER.map((tier) => (
              <div key={tier} className="space-y-1.5">
                <CompanyEvidenceTag tier={tier} />
                <div className="text-2xl font-bold text-ink-950">{audit.counts[tier]}</div>
                <div className="text-xs text-ink-400">{TIER_LABEL[tier]}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-ink-100 pt-3 text-sm text-ink-500">
            Total tagged claims across every section of this report: <span className="font-semibold text-ink-900">{audit.total}</span>
          </div>
        </CardContent>
      </Card>
    </SectionShell>
  );
}
