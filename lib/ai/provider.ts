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
  /**
   * Send a system + user prompt, get back the raw text response plus small
   * metadata about the call (currently just how many web searches it ran,
   * surfaced in the UI's Agent Trace panel — see components/analysis/
   * AgentTracePanel.tsx). `signal` lets the caller cancel an in-flight
   * request — wired all the way from the browser's "Cancel" button through
   * to the actual Claude API call, so cancelling really stops spending, not
   * just stops waiting. `enableWebSearch` is a hint, not a hard requirement:
   * a provider that doesn't support live search (or a future provider
   * implementation) can just ignore it and answer from its own knowledge
   * instead — in that case `meta.webSearchCount` is simply 0.
   */
  complete(params: {
    system: string;
    user: string;
    signal?: AbortSignal;
    enableWebSearch?: boolean;
  }): Promise<{ text: string; meta: { webSearchCount: number } }>;
}
