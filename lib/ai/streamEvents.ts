import type { ProgressStep } from "./progress";
import type { FullAnalysis } from "./schemas";

/**
 * The wire format for POST /api/analyze's streamed response — one of these,
 * JSON-stringified, per newline. NDJSON rather than the EventSource/SSE
 * format because we need a POST body (the startup input) and EventSource
 * only supports GET; a plain streamed Response read via
 * `response.body.getReader()` works for any HTTP method.
 */
export type AnalyzeStreamEvent =
  | { type: "progress"; step: ProgressStep }
  | { type: "done"; mode: "live" | "demo"; analysis: FullAnalysis; notice?: string }
  | { type: "error"; error: string; demoFallback?: FullAnalysis }
  | { type: "cancelled" };
