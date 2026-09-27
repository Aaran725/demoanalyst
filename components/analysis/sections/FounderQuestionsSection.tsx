import { Card, CardContent } from "@/components/ui/card";
import { SectionShell, SubHeading, BulletList } from "../SectionShell";
import type { FounderQuestions } from "@/lib/ai/schemas";

const GROUPS: Array<[keyof FounderQuestions, string]> = [
  ["product", "Product"],
  ["market", "Market"],
  ["competition", "Competition"],
  ["economics", "Economics"],
  ["execution", "Execution"],
];

export function FounderQuestionsSection({ founderQuestions }: { founderQuestions: FounderQuestions }) {
  return (
    <SectionShell title="Questions for the Founders">
      <div className="grid gap-4 sm:grid-cols-2">
        {GROUPS.map(([key, label]) => (
          <Card key={key}>
            <CardContent className="space-y-3 p-5">
              <SubHeading>{label}</SubHeading>
              <BulletList items={founderQuestions[key]} />
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
