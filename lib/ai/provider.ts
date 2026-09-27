/**
 * AI Provider abstraction.
 *
 * Every agent talks to "an AIProvider" instead of talking to Anthropic
 * directly. This means swapping in OpenAI or Gemini later only requires
 * writing one new file (like anthropic.ts) that implements this interface —
 * nothing in lib/ai/prompts/ or lib/ai/orchestrator.ts has to change.
 */
export interface AIProvider {
  /** Short name for logging, e.g. "anthropic" */
  name: string;
  /** Send a system + user prompt, get back the raw text response. */
  complete(params: { system: string; user: string }): Promise<string>;
}
