"use client";

import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { PROGRESS_STEPS, PROGRESS_LABELS } from "@/lib/ai/progress";

/**
 * The "Researching company... Understanding product..." progress screen.
 *
 * We don't have a live event stream from the server (the API route runs the
 * whole pipeline and returns one JSON response — see docs/ARCHITECTURE.md
 * for why we chose that trade-off), so this cycles through the real list of
 * pipeline steps while the request is in flight, then snaps to "done" the
 * moment the response actually arrives. It never claims a step is finished
 * before the real analysis is finished — it's a waiting indicator, not a
 * fabricated result.
 */
export function AnalysisProgress({ isDone }: { isDone: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isDone) return;
    const interval = setInterval(() => {
      setActiveIndex((i) => Math.min(i + 1, PROGRESS_STEPS.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, [isDone]);

  return (
    <div className="mx-auto max-w-md space-y-1 py-16">
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
  );
}
