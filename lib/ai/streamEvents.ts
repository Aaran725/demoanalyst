import type { ProgressStep } from "./progress";
import type { FullAnalysis } from "./schemas";

/**
 * The wire format for POST /api/analyze's streamed response — one of these,
 * JSON-stringified, per newline. NDJSON rather than the EventSource/SSE
 * format because we need a POST body (the startup input) and EventSource
 * only supports GET; a plain streamed Response read via
 * `response.body.getReader()` works for any HTTP method.
 *
 * The `agent_*` variants are the "Live Agent Theater" events — real,
 * per-agent activity (search queries actually run, source URLs actually
 * found) streamed the instant it happens, not a simulation. See
 * lib/ai/callAgent.ts's LiveAgentEvent, which these mirror 1:1.
 */
export type AnalyzeStreamEvent =
  | { type: "progress"; step: ProgressStep }
  | { type: "agent_start"; agent: string }
  | { type: "agent_search"; agent: string; query: string }
  | { type: "agent_sources"; agent: string; sources: { url: string; title: string }[] }
  | { type: "agent_done"; agent: string; durationMs: number; webSearchCount: number }
  | { type: "done"; mode: "live" | "demo"; analysis: FullAnalysis; notice?: string }
  | { type: "error"; error: string; demoFallback?: FullAnalysis }
  | { type: "cancelled" };
