import { z } from "zod";
import type { AIProvider } from "./provider";

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

/**
 * Calls one AI agent and validates its output against a Zod schema.
 *
 * If the model's JSON doesn't match the schema (missing field, wrong type,
 * invented structure), we send it back one time with the validation error
 * and ask it to fix itself. If it still fails, we throw an AgentError
 * instead of showing broken data — the caller (orchestrator) decides how
 * to surface that to the user.
 */
export async function callAgent<T>(
  provider: AIProvider,
  agentName: string,
  schema: z.ZodType<T>,
  system: string,
  user: string,
  signal?: AbortSignal
): Promise<T> {
  let lastError = "";

  for (let attempt = 0; attempt < 2; attempt++) {
    if (signal?.aborted) throw new DOMException("Analysis cancelled", "AbortError");

    const prompt =
      attempt === 0
        ? user
        : `${user}\n\nYour previous response failed validation with this error:\n${lastError}\n\nRespond again with ONLY the corrected JSON object.`;

    let raw: string;
    try {
      raw = await provider.complete({ system, user: prompt, signal });
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
      if (result.success) return result.data;
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
