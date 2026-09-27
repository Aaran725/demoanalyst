import { Card, CardContent } from "@/components/ui/card";
import { ClaimList } from "../ClaimBlock";
import { SectionShell, SubHeading, BulletList } from "../SectionShell";
import type { FounderAnalysis } from "@/lib/ai/schemas";

export function FoundersSection({ founders }: { founders: FounderAnalysis }) {
  return (
    <SectionShell title="Founder & Team Analysis">
      <div className="grid gap-4 sm:grid-cols-2">
        {founders.founders.map((f, i) => (
          <Card key={i}>
            <CardContent className="space-y-3 p-5">
              <div>
                <div className="font-medium text-ink-900">{f.name}</div>
                {f.role && <div className="text-xs text-ink-400">{f.role}</div>}
              </div>
              <ClaimList claims={f.background} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Relevant Team Experience</SubHeading>
            <BulletList items={founders.relevantTeamExperience} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Team Questions</SubHeading>
            <BulletList items={founders.teamQuestions} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-3 p-5">
            <SubHeading>Information to Verify</SubHeading>
            <BulletList items={founders.informationToVerify} />
          </CardContent>
        </Card>
      </div>
    </SectionShell>
  );
}
