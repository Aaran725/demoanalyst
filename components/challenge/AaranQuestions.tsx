"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AaranAnswers } from "@/lib/ai/schemas";

const QUESTIONS: Array<{ key: keyof AaranAnswers; prompt: string }> = [
  { key: "risks", prompt: "What do YOU think are the three biggest risks?" },
  { key: "moat", prompt: "What could be this company's moat?" },
  { key: "founderQuestion", prompt: "What question would YOU ask the founder first?" },
];

const inputClass =
  "w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-signal-600 focus:outline-none focus:ring-1 focus:ring-signal-600";

/**
 * "Ask Aaran First" — collects Aaran's own thinking BEFORE the AI analysis
 * runs, so the later comparison is honest (not reverse-engineered after
 * seeing the answer).
 */
export function AaranQuestions({ onSubmit }: { onSubmit: (answers: AaranAnswers) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const canSubmit = QUESTIONS.every((q) => (answers[q.key] ?? "").trim().length > 0);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-ink-950">Ask Aaran First</h2>
        <p className="mt-1 text-sm text-ink-500">
          Answer these before AARAN AI runs its analysis — this is what shows AI is being used to
          sharpen thinking, not replace it.
        </p>
      </div>

      <div className="space-y-4">
        {QUESTIONS.map((q) => (
          <Card key={q.key}>
            <CardContent className="space-y-2 p-4">
              <label className="text-sm font-medium text-ink-800">{q.prompt}</label>
              <textarea
                className={inputClass}
                rows={2}
                value={answers[q.key] ?? ""}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        size="lg"
        disabled={!canSubmit}
        onClick={() =>
          onSubmit({
            risks: answers.risks,
            moat: answers.moat,
            founderQuestion: answers.founderQuestion,
          })
        }
      >
        Lock In My Answers — Run AARAN AI
      </Button>
    </div>
  );
}
