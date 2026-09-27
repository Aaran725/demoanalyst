import { CheckCircle2, XCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionShell, SubHeading, BulletList } from "@/components/analysis/SectionShell";
import { CompanyEvidenceTag } from "../CompanyEvidenceTag";
import type { CeoPromiseTracker, ManagementPromise } from "@/lib/ai/company-schemas";

const STATUS_CONFIG: Record<ManagementPromise["status"], { label: string; icon: typeof CheckCircle2; className: string }> = {
  achieved: { label: "ACHIEVED", icon: CheckCircle2, className: "text-tier-verified" },
  partially_achieved: { label: "PARTIALLY ACHIEVED", icon: TrendingUp, className: "text-tier-estimate" },
  behind_trajectory: { label: "BEHIND TRAJECTORY", icon: AlertTriangle, className: "text-tier-inference" },
  missed: { label: "MISSED", icon: XCircle, className: "text-tier-unverified" },
  pending: { label: "PENDING", icon: Clock, className: "text-ink-400" },
};

export function CeoPromiseTrackerSection({ tracker }: { tracker: CeoPromiseTracker }) {
  const r = tracker.executionRecord;
  return (
    <SectionShell title="CEO Promise Tracker" description="Specific, measurable management statements checked against real outcomes — never an arbitrary score.">
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-5">
          <Stat label="Tracked" value={r.promisesTracked} />
          <Stat label="Achieved" value={r.achieved} className="text-tier-verified" />
          <Stat label="Partial" value={r.partiallyAchieved} className="text-tier-estimate" />
          <Stat label="Missed" value={r.missed} className="text-tier-unverified" />
          <Stat label="Pending" value={r.pending} className="text-ink-400" />
        </CardContent>
      </Card>

      {tracker.promises.length === 0 ? (
        <Card>
          <CardContent className="p-5 text-sm text-ink-400">
            No specific, checkable management promises could be verified for this company yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tracker.promises.map((p, i) => {
            const cfg = STATUS_CONFIG[p.status];
            const Icon = cfg.icon;
            return (
              <Card key={i}>
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-400">{p.statementDate}</div>
                    <CompanyEvidenceTag tier={p.confidence} />
                  </div>
                  <p className="text-sm italic text-ink-900">&ldquo;{p.statementText}&rdquo;</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Target</div>
                      <div className="text-sm text-ink-700">{p.targetMetric}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Actual</div>
                      <div className="text-sm text-ink-700">{p.actualOutcome}</div>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 text-sm font-semibold ${cfg.className}`}>
                    <Icon size={15} /> {cfg.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardContent className="space-y-3 p-5">
          <SubHeading>Capital Allocation History</SubHeading>
          <BulletList items={tracker.capitalAllocationHistory} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-2 p-5">
          <SubHeading>Strategic Consistency</SubHeading>
          <p className="text-sm leading-relaxed text-ink-800">{tracker.strategicConsistencyNarrative}</p>
        </CardContent>
      </Card>
    </SectionShell>
  );
}

function Stat({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div>
      <div className={`text-2xl font-bold ${className ?? "text-ink-950"}`}>{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</div>
    </div>
  );
}
