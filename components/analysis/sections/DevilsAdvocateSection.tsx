import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionShell, SubHeading, BulletList } from "../SectionShell";
import type { DevilsAdvocate } from "@/lib/ai/schemas";

const RISK_ROWS: Array<[keyof DevilsAdvocate, string]> = [
  ["technologyRisk", "Technology Risk"],
  ["marketRisk", "Market Risk"],
  ["competitionRisk", "Competition Risk"],
  ["executionRisk", "Execution Risk"],
  ["financingRisk", "Financing Risk"],
  ["customerRisk", "Customer Risk"],
  ["regulatoryRisk", "Regulatory Risk"],
];

export function DevilsAdvocateSection({ devilsAdvocate: da }: { devilsAdvocate: DevilsAdvocate }) {
  return (
    <SectionShell className="space-y-6">
      <div className="rounded-lg bg-ink-950 px-6 py-8 text-white">
        <div className="flex items-center gap-2 text-risk-high">
          <Flame size={18} />
          <span className="text-xs font-semibold uppercase tracking-widest">Devil&apos;s Advocate</span>
        </div>
        <h2 className="mt-2 text-xl font-semibold">Actively trying to disprove the thesis</h2>
        <p className="mt-1 max-w-2xl text-sm text-ink-300">
          This section exists to fight confirmation bias — it argues against the deal on purpose.
        </p>

        <div className="mt-6 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            5 Reasons This Company Could Fail
          </div>
          <ol className="space-y-2">
            {da.reasonsThisCouldFail.map((reason, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-100">
                <span className="mt-0.5 shrink-0 font-mono text-risk-high">{i + 1}</span>
                {reason}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Card className="border-red-100 bg-red-50/40">
        <CardContent className="space-y-2 p-5">
          <SubHeading>What Would Make The Thesis Wrong?</SubHeading>
          <p className="text-sm font-medium leading-relaxed text-ink-900">{da.whatWouldMakeTheThesisWrong}</p>
        </CardContent>
      </Card>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card><CardContent className="space-y-3 p-5"><SubHeading>Assumptions That Must Be True</SubHeading><BulletList items={da.assumptionsThatMustBeTrue} /></CardContent></Card>
        <Card><CardContent className="space-y-3 p-5"><SubHeading>What Investors May Be Missing</SubHeading><BulletList items={da.whatInvestorsMayBeMissing} /></CardContent></Card>
      </div>

      <div>
        <SubHeading>Risk Breakdown</SubHeading>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {RISK_ROWS.map(([key, label]) => (
            <Card key={key}>
              <CardContent className="space-y-1 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</div>
                <p className="text-sm text-ink-700">{da[key] as string}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
