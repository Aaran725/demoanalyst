"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SubHeading, BulletList } from "@/components/analysis/SectionShell";
import type { AaranAnswers, ComparisonResult, FullAnalysis } from "@/lib/ai/schemas";

type CompareState =
  | { status: "loading" }
  | { status: "live"; comparison: ComparisonResult }
  | { status: "unavailable"; notice: string };

/**
 * Shows "AARAN'S VIEW vs AI ANALYSIS". Calls /api/compare once on mount.
 * Never shows a numerical grade — the point is developing investment
 * thinking, not scoring a 13-year-old against an AI.
 */
export function AaranVsAI({ answers, analysis }: { answers: AaranAnswers; analysis: FullAnalysis }) {
  const [state, setState] = useState<CompareState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aaranAnswers: answers,
        devilsAdvocate: analysis.devilsAdvocate,
        moat: analysis.moat,
        founderQuestions: analysis.founderQuestions,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.mode === "live") setState({ status: "live", comparison: data.comparison });
        else setState({ status: "unavailable", notice: data.notice });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "unavailable", notice: "Comparison unavailable." });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-ink-950">Aaran&apos;s View vs. AI Analysis</h2>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="space-y-2 p-4">
            <SubHeading>Aaran said: biggest risks</SubHeading>
            <p className="text-sm text-ink-800">{answers.risks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <SubHeading>Aaran said: possible moat</SubHeading>
            <p className="text-sm text-ink-800">{answers.moat}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-4">
            <SubHeading>Aaran said: first founder question</SubHeading>
            <p className="text-sm text-ink-800">{answers.founderQuestion}</p>
          </CardContent>
        </Card>
      </div>

      {state.status === "loading" && <p className="text-sm text-ink-400">Comparing...</p>}

      {state.status === "unavailable" && (
        <Card className="border-evidence-assumptionBg bg-evidence-assumptionBg/40">
          <CardContent className="p-4 text-sm text-ink-700">{state.notice}</CardContent>
        </Card>
      )}

      {state.status === "live" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="space-y-2 p-4">
              <SubHeading>Where We Agreed</SubHeading>
              <BulletList items={state.comparison.whereWeAgreed} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-4">
              <SubHeading>What AI Found That Aaran Missed</SubHeading>
              <BulletList items={state.comparison.whatAIFoundThatAaranMissed} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-4">
              <SubHeading>What Aaran Found That AI Missed</SubHeading>
              <BulletList items={state.comparison.whatAaranFoundThatAIMissed} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
