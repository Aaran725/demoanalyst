"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import { PROGRESS_STEPS, PROGRESS_LABELS, PROGRESS_ROUND } from "@/lib/ai/progress";
import type { ProgressStep } from "@/lib/ai/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * The "Researching company... Understanding product..." progress screen.
 *
 * `currentStep` comes from a real, streamed event sent by the server the
 * instant each pipeline round actually starts (see app/api/analyze/route.ts
 * and lib/useAnalyze.ts) — this is genuine pipeline state, not a simulation.
 *
 * The pipeline runs several agents in parallel per round (see
 * lib/ai/orchestrator.ts), and the server announces a whole round's step
 * names together, right as that round starts — before any of them have
 * actually finished. So a step is only ever shown as complete once a LATER
 * round has started (proving the earlier round's Promise.all resolved);
 * every step in the round matching `currentStep` is shown as active
 * (in-flight), never as already done. See lib/ai/progress.ts's
 * PROGRESS_ROUND for the round each step belongs to.
 *
 * What's always real and live regardless of streaming: the elapsed-time
 * counter below, with a Cancel button that genuinely stops the in-flight
 * API calls (see lib/useAnalyze.ts), not just the browser's wait.
 */
export function AnalysisProgress({
  isDone,
  startedAt,
  currentStep,
  onCancel,
}: {
  isDone: boolean;
  startedAt: number;
  currentStep?: ProgressStep;
  onCancel?: () => void;
}) {
  const [elapsedMs, setElapsedMs] = useState(() => Date.now() - startedAt);

  useEffect(() => {
    if (isDone) return;
    const interval = setInterval(() => setElapsedMs(Date.now() - startedAt), 1000);
    return () => clearInterval(interval);
  }, [isDone, startedAt]);

  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  const currentRound = currentStep ? PROGRESS_ROUND[currentStep] : 0;

  return (
    <div className="mx-auto max-w-md py-16">
      <Card className="space-y-6 p-8">
        <div className="text-center">
          <div className="font-mono text-4xl font-bold tabular-nums tracking-tight text-ink-950">
            {formatElapsed(elapsedMs)}
          </div>
          <p className="mt-2 text-xs text-ink-400">
            {elapsedSeconds < 20
              ? "Working..."
              : elapsedSeconds < 90
                ? "Still working — real analysis typically takes 30 seconds to 2 minutes."
                : elapsedSeconds < 180
                  ? "Taking longer than usual, but real API calls can vary — still working."
                  : "This is well beyond normal. It may be stuck — cancel and try again if it doesn't finish soon."}
          </p>
        </div>

        <div className="space-y-1 border-t border-ink-100 pt-4">
          {PROGRESS_STEPS.map((step) => {
            const isComplete = isDone || PROGRESS_ROUND[step] < currentRound;
            const isActive = !isDone && PROGRESS_ROUND[step] === currentRound;
            return (
              <div key={step} className="flex items-center gap-3 py-1.5">
                {isComplete ? (
                  <Check size={16} className="shrink-0 text-evidence-fact" />
                ) : isActive ? (
                  <Loader2 size={16} className="shrink-0 animate-spin text-signal-600" />
                ) : (
                  <span className="h-4 w-4 shrink-0 rounded-full border border-ink-200" />
                )}
                <span className={isComplete || isActive ? "text-sm text-ink-800" : "text-sm text-ink-300"}>
                  {PROGRESS_LABELS[step]}
                </span>
              </div>
            );
          })}
        </div>

        {!isDone && onCancel && (
          <div className="flex justify-center">
            <Button variant="secondary" size="sm" onClick={onCancel}>
              <X size={14} /> Cancel
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
