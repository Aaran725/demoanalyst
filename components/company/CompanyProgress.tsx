"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X } from "lucide-react";
import { COMPANY_PROGRESS_STEPS, COMPANY_PROGRESS_LABELS, AGENT_DISPLAY_NAMES } from "@/lib/ai/company-progress";
import { Button } from "@/components/ui/button";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * The "10 AI AGENTS DEPLOYED... IC CHAIRMAN SYNTHESIZING..." screen —
 * mirrors components/analysis/AnalysisProgress.tsx's honesty contract: this
 * never claims a step finished before the real pipeline actually finished.
 * The step list cycles visually while the request is in flight and snaps to
 * "done" the moment the real response arrives; only the elapsed-time
 * counter is truly live.
 */
export function CompanyProgress({
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
      setActiveIndex((i) => Math.min(i + 1, COMPANY_PROGRESS_STEPS.length - 1));
    }, 900);
    return () => clearInterval(interval);
  }, [isDone]);

  const elapsedSeconds = Math.floor(elapsedMs / 1000);
  // Agent grid is "deployed" as soon as filings are fetched (step index 1+).
  const agentsDeployed = isDone || activeIndex >= 1;
  const agentsComplete = isDone || activeIndex >= COMPANY_PROGRESS_STEPS.length - 1;

  return (
    <div className="mx-auto max-w-xl space-y-8 py-16">
      <div className="text-center">
        <div className="font-mono text-2xl font-semibold text-ink-950">{formatElapsed(elapsedMs)}</div>
        <p className="mt-1 text-xs text-ink-400">
          {elapsedSeconds < 20
            ? "Working..."
            : elapsedSeconds < 90
              ? "Still working — real SEC filings + Claude analysis typically takes 30-90 seconds."
              : "Taking longer than usual — still working. Cancel and retry if it doesn't finish soon."}
        </p>
      </div>

      <div className="rounded-lg border border-ink-100 bg-ink-50 p-5 text-center">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">
          {agentsDeployed ? "10 AI Agents Deployed" : "Deploying AI Investment Committee..."}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-left sm:grid-cols-2">
          {AGENT_DISPLAY_NAMES.map((name, i) => {
            // Distribute the 10 named agents across the 9 real "agent" progress steps (index 1..9).
            const stepIndex = 1 + Math.floor((i * 9) / AGENT_DISPLAY_NAMES.length);
            const done = isDone || activeIndex > stepIndex;
            return (
              <div key={name} className="flex items-center gap-2 text-sm">
                {done ? (
                  <Check size={14} className="shrink-0 text-evidence-fact" />
                ) : (
                  <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-ink-200" />
                )}
                <span className={done ? "text-ink-800" : "text-ink-300"}>{name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {agentsComplete && (
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-signal-700">
          {!isDone && <Loader2 size={14} className="animate-spin" />}
          IC CHAIRMAN SYNTHESIZING...
        </div>
      )}

      <div className="space-y-1 text-xs text-ink-400">
        <p className="text-center">{COMPANY_PROGRESS_LABELS[COMPANY_PROGRESS_STEPS[activeIndex]]}</p>
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
