"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import { PROGRESS_STEPS, PROGRESS_LABELS } from "@/lib/ai/progress";
import { Button } from "@/components/ui/button";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * The "Researching company... Understanding product..." progress screen.
 *
 * We don't have a live event stream from the server (the API route runs the
 * whole pipeline and returns one JSON response — see docs/ARCHITECTURE.md
 * for why we chose that trade-off), so the step list cycles visually while
 * the request is in flight, then snaps to "done" the moment the response
 * actually arrives. It never claims a step is finished before the real
 * analysis is finished — it's a waiting indicator, not a fabricated result.
 *
 * What IS always real and live: the elapsed-time counter below. It proves
 * the page hasn't frozen, and past a certain point it tells you plainly
 * that something's unusual — with a Cancel button that genuinely stops the
 * in-flight API calls (see lib/useAnalyze.ts), not just the browser's wait.
 */
export function AnalysisProgress({
  isDone,
  startedAt,
  onCancel,
}: {
  isDone: boolean;
  startedAt: number;
  onCancel?: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(() => Date.now() - startedAt);

  useEffect(() => {
    if (isDone) return;
    const interval = setInterval(() => setElapsedMs(Date.now() - startedAt), 1000);
    return () => clearInterval(interval);
  }, [isDone, startedAt]);

  useEffect(() => {
    if (isDone) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => Math.min(i + 1, PROGRESS_STEPS.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, [isDone]);

  const elapsedSeconds = Math.floor(elapsedMs / 1000);

  return (
    <div className="mx-auto max-w-md space-y-6 py-16">
      <div className="text-center">
        <div className="font-mono text-2xl font-semibold text-ink-950">{formatElapsed(elapsedMs)}</div>
        <p className="mt-1 text-xs text-ink-400">
          {elapsedSeconds < 20
            ? "Working..."
            : elapsedSeconds < 90
              ? "Still working — real analysis typically takes 30 seconds to 2 minutes."
              : elapsedSeconds < 180
                ? "Taking longer than usual, but real API calls can vary — still working."
                : "This is well beyond normal. It may be stuck — cancel and try again if it doesn't finish soon."}
        </p>
      </div>

      <div className="space-y-1">
        {PROGRESS_STEPS.map((step, i) => {
          const isComplete = isDone || i < activeIndex;
          const isActive = !isDone && i === activeIndex;
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
    </div>
  );
}
