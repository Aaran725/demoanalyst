"use client";

import { useState } from "react";
import { Swords, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "@/components/challenge/Timer";
import { AaranQuestions } from "@/components/challenge/AaranQuestions";
import { AaranVsAI } from "@/components/challenge/AaranVsAI";
import { AnalysisProgress } from "@/components/analysis/AnalysisProgress";
import { ChallengeResults } from "@/components/challenge/ChallengeResults";
import { useAnalyze } from "@/lib/useAnalyze";
import type { AaranAnswers } from "@/lib/ai/schemas";

type Stage = "intro" | "aaran-questions" | "running" | "results";

export default function ChallengePage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [companyQuery, setCompanyQuery] = useState("");
  const [askAaranFirst, setAskAaranFirst] = useState(false);
  const [aaranAnswers, setAaranAnswers] = useState<AaranAnswers | null>(null);
  const { state, runAnalysis, useDemoFallback } = useAnalyze();

  function startChallenge() {
    if (askAaranFirst) {
      setStage("aaran-questions");
    } else {
      setStage("running");
      runAnalysis({ companyName: companyQuery.trim() });
    }
  }

  function handleAaranAnswers(answers: AaranAnswers) {
    setAaranAnswers(answers);
    setStage("running");
    runAnalysis({ companyName: companyQuery.trim() });
  }

  if (stage === "intro") {
    return (
      <div className="mx-auto max-w-xl space-y-8 py-8 text-center">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-ink-950">Give Aaran any startup.</h1>
          <p className="mt-3 text-ink-500">
            A company name, a website, or what&apos;s on a pitch deck. Five minutes on the clock.
          </p>
        </div>

        <div className="space-y-3 text-left">
          <input
            className="w-full rounded-md border border-ink-200 bg-white px-4 py-3 text-center text-lg text-ink-900 placeholder:text-ink-300 focus:border-signal-600 focus:outline-none focus:ring-1 focus:ring-signal-600"
            placeholder="Company name or website"
            value={companyQuery}
            onChange={(e) => setCompanyQuery(e.target.value)}
          />
          <label className="flex items-center justify-center gap-2 text-sm text-ink-500">
            <input
              type="checkbox"
              checked={askAaranFirst}
              onChange={(e) => setAskAaranFirst(e.target.checked)}
              className="rounded border-ink-300"
            />
            Ask Aaran First (answer 3 questions before seeing the AI&apos;s analysis)
          </label>
        </div>

        <Button size="lg" disabled={!companyQuery.trim()} onClick={startChallenge}>
          <Swords size={16} /> Challenge AARAN AI
        </Button>
      </div>
    );
  }

  if (stage === "aaran-questions") {
    return <AaranQuestions onSubmit={handleAaranAnswers} />;
  }

  if (stage === "running") {
    return (
      <div className="space-y-8">
        <div className="flex justify-center">
          <Timer running={state.status === "loading"} />
        </div>

        {state.status === "loading" && <AnalysisProgress isDone={false} />}

        {state.status === "error" && (
          <Card className="mx-auto max-w-lg border-red-100 bg-red-50/40">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start gap-2">
                <AlertTriangle size={16} className="mt-0.5 shrink-0 text-risk-high" />
                <p className="text-sm text-ink-800">{state.error}</p>
              </div>
              {state.demoFallback && (
                <Button size="sm" variant="secondary" onClick={useDemoFallback}>
                  Use Demo Analysis Instead
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {state.status === "success" && (
          <div className="space-y-10">
            {aaranAnswers && <AaranVsAI answers={aaranAnswers} analysis={state.analysis} />}
            <ChallengeResults analysis={state.analysis} />
          </div>
        )}
      </div>
    );
  }

  return null;
}
