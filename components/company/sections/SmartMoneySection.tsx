import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionShell, SubHeading } from "@/components/analysis/SectionShell";
import { CompanyEvidenceTag } from "../CompanyEvidenceTag";
import { formatSignedPct } from "@/lib/company-format";
import type { InstitutionalIntelligence } from "@/lib/ai/company-schemas";

const CLASSIFICATION_LABEL: Record<string, string> = {
  new_position: "NEW POSITION",
  increased: "INCREASED",
  reduced: "REDUCED",
  exited: "EXITED",
  unchanged: "UNCHANGED",
  conviction_increase: "CONVICTION INCREASE",
};
const INTERPRETATION_STYLE: Record<string, string> = {
  accumulation: "text-tier-verified",
  neutral: "text-ink-500",
  distribution: "text-tier-unverified",
};

export function SmartMoneySection({ institutional }: { institutional: InstitutionalIntelligence }) {
  if (!institutional.dataAvailable) {
    return (
      <SectionShell title="Smart Money" description="Institutional Intelligence">
        <Card className="border-ink-200 bg-ink-50">
          <CardContent className="flex items-start gap-3 p-5">
            <Info size={16} className="mt-0.5 shrink-0 text-ink-400" />
            <div className="space-y-1">
              <div className="text-sm font-semibold text-ink-900">DATA NOT AVAILABLE</div>
              <p className="text-sm text-ink-600">{institutional.notice}</p>
            </div>
          </CardContent>
        </Card>
      </SectionShell>
    );
  }

  return (
    <SectionShell title="Smart Money" description="Institutional Intelligence — disclosed 13F positions, never presented as real-time.">
      {institutional.isDemoData && (
        <div className="flex items-center gap-2 rounded-md border border-ink-200 bg-ink-50 p-3 text-xs text-ink-600">
          <Badge variant="outline">DEMO DATA</Badge>
          {institutional.notice}
        </div>
      )}

      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
          <div>
            <div className="text-2xl font-bold text-ink-950">
              {institutional.institutionalOwnershipPct !== null ? `${(institutional.institutionalOwnershipPct * 100).toFixed(0)}%` : "N/A"}
            </div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Institutional Ownership</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-tier-verified">{institutional.newPositions ?? "N/A"}</div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-400">New Positions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ink-950">{institutional.increasingPositions ?? "N/A"}</div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Increasing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-tier-unverified">{institutional.exitedPositions ?? "N/A"}</div>
            <div className="text-xs font-medium uppercase tracking-wide text-ink-400">Exited</div>
          </div>
        </CardContent>
      </Card>

      {institutional.interpretation && (
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <SubHeading>Institutional Conviction</SubHeading>
            <span className={`text-lg font-bold uppercase ${INTERPRETATION_STYLE[institutional.interpretation]}`}>
              {institutional.interpretation}
            </span>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SubHeading>Reporting Details</SubHeading>
            <CompanyEvidenceTag tier="verified" />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div>
              <div className="text-xs uppercase text-ink-400">Reporting Period</div>
              <div className="text-ink-800">{institutional.reportingPeriod ?? "N/A"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-ink-400">Filed</div>
              <div className="text-ink-800">{institutional.filingDate ?? "N/A"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-ink-400">Data Age</div>
              <div className="text-ink-800">{institutional.dataAgeDays !== null ? `${institutional.dataAgeDays} days` : "N/A"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {institutional.topHolders.length > 0 && (
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Top Disclosed Holders</SubHeading>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="py-1.5 font-medium">Holder</th>
                  <th className="py-1.5 font-medium">Shares</th>
                  <th className="py-1.5 font-medium">Change</th>
                  <th className="py-1.5 font-medium">Classification</th>
                </tr>
              </thead>
              <tbody>
                {institutional.topHolders.map((h, i) => (
                  <tr key={i} className="border-b border-ink-50">
                    <td className="py-1.5 text-ink-900">{h.name}</td>
                    <td className="py-1.5 font-mono text-ink-700">{h.currentShares?.toLocaleString() ?? "N/A"}</td>
                    <td className="py-1.5 font-mono text-ink-700">{formatSignedPct(h.changeSharesPct)}</td>
                    <td className="py-1.5 text-xs font-medium text-ink-600">{CLASSIFICATION_LABEL[h.classification]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </SectionShell>
  );
}
