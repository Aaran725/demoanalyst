"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X, Search } from "lucide-react";
import { PROGRESS_STEPS, PROGRESS_LABELS, PROGRESS_ROUND } from "@/lib/ai/progress";
import type { ProgressStep } from "@/lib/ai/progress";
import type { AgentLiveState } from "@/lib/useAnalyze";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function formatElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/** A short, human display name from a raw agent name like "MarketAgent" -> "Market". */
function displayName(agentName: string): string {
  return agentName.replace(/Agent$/, "");
}

/**
 * "Live Agent Theater" — the row for one real agent. Every query/source
 * shown here is the literal Anthropic API response for that agent's call in
 * THIS run — nothing here is simulated or timer-driven.
 */
function AgentRow({ agentName, agent }: { agentName: string; agent: AgentLiveState }) {
  const lastQuery = agent.queries[agent.queries.length - 1];
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      {agent.status === "done" ? (
        <Check size={14} className="mt-0.5 shrink-0 text-evidence-fact" />
      ) : (
        <Loader2 size={14} className="mt-0.5 shrink-0 animate-spin text-signal-600" />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-ink-800">{displayName(agentName)}</span>
          {agent.status === "done" && agent.durationMs !== undefined && (
            <span className="shrink-0 font-mono text-[11px] text-ink-300">
              {(agent.durationMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>
        {agent.status === "running" && lastQuery && (
          <p className="truncate font-mono text-xs text-ink-400">
            <Search size={10} className="mr-1 inline shrink-0 text-signal-600" />
            &ldquo;{lastQuery}&rdquo;
          </p>
        )}
        {agent.sourceCount > 0 && (
          <p className="truncate text-[11px] text-ink-300">
            {agent.sourceCount} source{agent.sourceCount === 1 ? "" : "s"} found
            {agent.sources[0] && ` — ${agent.sources[agent.sources.length - 1].title}`}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * The live progress screen for a real (non-demo) analysis run.
 *
 * Centerpiece: the "Live Agent Theater" list below the elapsed-time counter.
 * The pipeline runs many real Claude agents in parallel, each making real
 * hosted web searches (see lib/ai/orchestrator.ts) — this renders the
 * literal search queries and source URLs/titles as the Anthropic API
 * actually returns them (see lib/ai/anthropic.ts's onEvent, threaded through
 * lib/ai/callAgent.ts and lib/useAnalyze.ts). Nothing here is a fake/timer
 * progress bar. `agents` is undefined only when the caller hasn't wired the
 * live-event stream (shouldn't happen via useAnalyze, but kept optional so
 * this component degrades gracefully rather than crashing).
 *
 * `currentStep`/`PROGRESS_ROUND` still exist and are used for the summary
 * status line, but the round-level checklist that used to be the whole UI is
 * gone — the per-agent list below is strictly more informative and more
 * honest about what's actually happening right now.
 */
export function AnalysisProgress({
  isDone,
  startedAt,
  currentStep,
  agents,
  onCancel,
}: {
  isDone: boolean;
  startedAt: number;
  currentStep?: ProgressStep;
  agents?: Record<string, AgentLiveState>;
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

  const agentEntries = Object.entries(agents ?? {});
  const totalSearches = agentEntries.reduce((sum, [, a]) => sum + a.searchCount, 0);
  const totalSources = agentEntries.reduce((sum, [, a]) => sum + a.sourceCount, 0);
  const doneCount = agentEntries.filter(([, a]) => a.status === "done").length;

  return (
    <div className="mx-auto max-w-lg py-16">
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

        {agentEntries.length > 0 && (
          <div className="space-y-3 border-t border-ink-100 pt-4">
            <p className="text-center font-mono text-xs text-ink-500">
              <span className="font-semibold text-ink-900">{totalSearches}</span> real web search
              {totalSearches === 1 ? "" : "es"} &middot;{" "}
              <span className="font-semibold text-ink-900">{totalSources}</span> source
              {totalSources === 1 ? "" : "s"} found &middot;{" "}
              <span className="font-semibold text-ink-900">
                {doneCount}/{agentEntries.length}
              </span>{" "}
              agents complete
            </p>
            <div className="max-h-80 divide-y divide-ink-50 overflow-y-auto">
              {agentEntries.map(([agentName, agent]) => (
                <AgentRow key={agentName} agentName={agentName} agent={agent} />
              ))}
            </div>
          </div>
        )}

        {agentEntries.length === 0 && currentStep && (
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
        )}

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
