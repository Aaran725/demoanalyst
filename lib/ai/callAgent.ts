import { z } from "zod";
import type { AIProvider, ProviderLiveEvent } from "./provider";

/** Raised when an agent's output fails schema validation even after a retry. */
export class AgentError extends Error {
  constructor(public agentName: string, message: string) {
    super(message);
    this.name = "AgentError";
  }
}

/**
 * Pulls a JSON object out of a model response, tolerating the common ways
 * models wrap JSON (markdown code fences, a stray sentence before/after).
 */
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1) return candidate.trim();
  return candidate.slice(start, end + 1);
}

/** One entry in a completed analysis's Agent Trace panel — see AgentTracePanel.tsx. */
export interface AgentTraceInfo {
  agentName: string;
  durationMs: number;
  attempts: number;
  webSearchCount: number;
}

/**
 * Real-time event for the live "watch AARAN research" progress view (see
 * components/analysis/AnalysisProgress.tsx) — fired AS a call happens, not
 * after. Distinct from AgentTraceInfo/onTrace above, which is a post-hoc
 * summary collected for the Agent Trace panel; this is additive live
 * streaming of the same underlying activity, tagged per-agent so a UI
 * tracking all 13 agents at once can tell them apart.
 */
export type LiveAgentEvent =
  | { type: "start"; agentName: string }
  | { type: "search"; agentName: string; query: string }
  | { type: "sources"; agentName: string; sources: { url: string; title: string }[] }
  | { type: "done"; agentName: string; durationMs: number; webSearchCount: number };

/**
 * Calls one AI agent and validates its output against a Zod schema.
 *
 * If the model's JSON doesn't match the schema (missing field, wrong type,
 * invented structure), we send it back one time with the validation error
 * and ask it to fix itself. If it still fails, we throw an AgentError
 * instead of showing broken data — the caller (orchestrator) decides how
 * to surface that to the user.
 *
 * `onTrace` is optional and purely additive: it fires once, only on
 * success, with real timing/search-usage instrumentation for the Agent
 * Trace panel. A failed call never produces a trace entry — Promise.all
 * rejection aborts the whole pipeline anyway, so there's nothing to show.
 *
 * `onLive` is also optional and additive: it fires `start` once immediately
 * (a retry isn't a new "start" from the UI's perspective), `search`/
 * `sources` as real web search activity happens mid-call, and `done` at the
 * same point `onTrace` fires. Never fires on failure, same as `onTrace`.
 */
export async function callAgent<T>(
  provider: AIProvider,
  agentName: string,
  schema: z.ZodType<T>,
  system: string,
  user: string,
  signal?: AbortSignal,
  enableWebSearch?: boolean | number,
  onTrace?: (info: AgentTraceInfo) => void,
  onLive?: (event: LiveAgentEvent) => void
): Promise<T> {
  const startedAt = Date.now();
  let lastError = "";
  let webSearchCount = 0;

  onLive?.({ type: "start", agentName });
  const forwardLiveEvent = (e: ProviderLiveEvent) =>
    onLive?.(e.type === "search" ? { type: "search", agentName, query: e.query } : { type: "sources", agentName, sources: e.sources });

  for (let attempt = 0; attempt < 2; attempt++) {
    if (signal?.aborted) throw new DOMException("Analysis cancelled", "AbortError");

    const prompt =
      attempt === 0
        ? user
        : `${user}\n\nYour previous response failed validation with this error:\n${lastError}\n\nRespond again with ONLY the corrected JSON object.`;

    let raw: string;
    try {
      const response = await provider.complete({
        system,
        user: prompt,
        signal,
        enableWebSearch,
        onEvent: onLive ? forwardLiveEvent : undefined,
      });
      raw = response.text;
      webSearchCount += response.meta.webSearchCount;
    } catch (err) {
      // Cancellation isn't a failure worth retrying — stop immediately so
      // we don't keep spending on an analysis nobody's waiting for anymore.
      if (err instanceof Error && err.name === "AbortError") throw err;
      lastError = err instanceof Error ? err.message : String(err);
      continue;
    }

    const jsonText = extractJson(raw);
    try {
      const parsed = JSON.parse(jsonText);
      const result = schema.safeParse(parsed);
      if (result.success) {
        const durationMs = Date.now() - startedAt;
        onTrace?.({ agentName, durationMs, attempts: attempt + 1, webSearchCount });
        onLive?.({ type: "done", agentName, durationMs, webSearchCount });
        return result.data;
      }
      lastError = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
    } catch (err) {
      lastError = `Could not parse JSON: ${err instanceof Error ? err.message : String(err)}`;
    }
  }

  throw new AgentError(
    agentName,
    `${agentName} failed to produce valid output after retrying. Last error: ${lastError}`
  );
}
