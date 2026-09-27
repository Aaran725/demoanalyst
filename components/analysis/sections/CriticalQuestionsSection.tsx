import { Card, CardContent } from "@/components/ui/card";
import { SectionShell } from "../SectionShell";
import type { CriticalQuestions } from "@/lib/ai/schemas";

export function CriticalQuestionsSection({ criticalQuestions }: { criticalQuestions: CriticalQuestions }) {
  return (
    <SectionShell
      title="5 Things I'd Want to Know Before Spending More Time on This Company"
      description="The unanswered questions most likely to materially change the investment thesis."
    >
      <div className="space-y-3">
        {criticalQuestions.questions.map((q, i) => (
          <Card key={i}>
            <CardContent className="flex gap-4 p-5">
              <span className="mt-0.5 shrink-0 font-mono text-lg font-semibold text-signal-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="space-y-1">
                <p className="font-medium text-ink-950">{q.question}</p>
                <p className="text-sm text-ink-500">{q.whyItMatters}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
