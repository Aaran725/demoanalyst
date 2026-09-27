import { Card, CardContent } from "@/components/ui/card";
import { ClaimBlock } from "../ClaimBlock";
import { SectionShell, SubHeading } from "../SectionShell";
import type { StartupSnapshot } from "@/lib/ai/schemas";

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</div>
      <div className="text-sm text-ink-800">{value || "—"}</div>
    </div>
  );
}

export function SnapshotSection({ snapshot }: { snapshot: StartupSnapshot }) {
  return (
    <SectionShell title="Startup Snapshot">
      <Card>
        <CardContent className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
          <FactRow label="Company" value={snapshot.companyName} />
          <FactRow label="Website" value={snapshot.website ?? "Unknown"} />
          <FactRow label="Headquarters" value={snapshot.headquarters.text} />
          <FactRow label="Founded" value={snapshot.founded.text} />
          <FactRow label="Founders" value={snapshot.founders.join(", ") || "Unknown"} />
          <FactRow label="Sector" value={snapshot.sector} />
          <FactRow label="Stage" value={snapshot.stage} />
          <FactRow label="Funding" value={snapshot.fundingRaised.text} />
          <FactRow label="Employees" value={snapshot.employees.text} />
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-5">
            <SubHeading>Problem</SubHeading>
            <ClaimBlock claim={snapshot.problem} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-5">
            <SubHeading>Solution</SubHeading>
            <ClaimBlock claim={snapshot.solution} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-5">
            <SubHeading>Product</SubHeading>
            <ClaimBlock claim={snapshot.product} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-5">
            <SubHeading>Customer</SubHeading>
            <ClaimBlock claim={snapshot.customer} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-5">
            <SubHeading>Business Model</SubHeading>
            <ClaimBlock claim={snapshot.businessModelSummary} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-5">
            <SubHeading>Why Now</SubHeading>
            <ClaimBlock claim={snapshot.whyNow} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-5">
            <SubHeading>Traction</SubHeading>
            <ClaimBlock claim={snapshot.tractionSummary} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-5">
            <SubHeading>Technology</SubHeading>
            <ClaimBlock claim={snapshot.technology} />
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}
