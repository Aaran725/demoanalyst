import { ChevronRight } from "lucide-react";
import type { AgentTraceEntry } from "@/lib/ai/schemas";

function formatDuration(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

const ROUND_LABEL: Record<number, string> = {
  1: "Round 1 — Research",
  2: "Round 2 — Market, product, business model, traction, competitors, founders, Pegasus fit, Japan",
  3: "Round 3 — Moat, strategic fit, Devil's Advocate",
  4: "Round 4 — Diligence, IC memo",
};

/**
 * "Under the hood" transparency panel: which agents really ran, in which
 * round, how long each took, and whether it used live web search. Real
 * instrumentation captured in lib/ai/callAgent.ts, not decoration — see
 * AgentTraceInfo there and agentTraceEntrySchema in lib/ai/schemas.ts.
 *
 * Rounds run in parallel (see lib/ai/orchestrator.ts), so summing every
 * agent's durationMs would NOT be real elapsed time — we deliberately don't
 * present that sum as if it were, since that would itself be a small
 * fabrication in an app built around never doing that.
 */
export function AgentTracePanel({ trace }: { trace: AgentTraceEntry[] }) {
  if (trace.length === 0) return null;

  const totalSearches = trace.reduce((sum, t) => sum + t.webSearchCount, 0);
  const rounds = Array.from(new Set(trace.map((t) => t.round))).sort((a, b) => a - b);

  return (
    <details className="group rounded-xl border border-ink-100 bg-white shadow-card">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm">
        <span className="flex items-center gap-2 font-semibold text-ink-900">
          <ChevronRight size={14} className="shrink-0 transition-transform group-open:rotate-90" />
          Under the Hood — Agent Trace
        </span>
        <span className="font-mono text-xs text-ink-400">
          {trace.length} agents &middot; {totalSearches} web search{totalSearches === 1 ? "" : "es"}
        </span>
      </summary>
      <div className="space-y-4 border-t border-ink-100 p-4 pt-3">
        {rounds.map((round) => (
          <div key={round}>
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">
              {ROUND_LABEL[round] ?? `Round ${round}`}
            </div>
            <div className="mt-1.5 space-y-1">
              {trace
                .filter((t) => t.round === round)
                .map((t) => (
                  <div key={t.agentName} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-ink-700">{t.agentName}</span>
                    <span className="flex items-center gap-3 font-mono text-xs text-ink-400">
                      {t.attempts > 1 && <span className="text-evidence-assumption">{t.attempts} attempts</span>}
                      {t.usedWebSearch ? (
                        <span className="text-signal-600">
                          {t.webSearchCount} search{t.webSearchCount === 1 ? "" : "es"}
                        </span>
                      ) : (
                        <span>&mdash;</span>
                      )}
                      <span className="w-12 text-right text-ink-900">{formatDuration(t.durationMs)}</span>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
        <p className="text-xs text-ink-400">
          Rounds run their agents in parallel, so durations above don&apos;t sum to real elapsed time.
        </p>
      </div>
    </details>
  );
}
