import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider } from "./provider";

/**
 * Anthropic (Claude) implementation of AIProvider.
 * This file is the ONLY place in the app that talks to the Anthropic SDK
 * directly. It only ever runs on the server (API routes) — see
 * app/api/analyze/route.ts — so ANTHROPIC_API_KEY is never sent to the browser.
 */
export function createAnthropicProvider(): AIProvider {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local, or set DEMO_MODE=true to run without it."
    );
  }

  const client = new Anthropic({ apiKey });
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";

  return {
    name: "anthropic",
    async complete({ system, user, signal, enableWebSearch }) {
      const response = await client.messages.create(
        {
          model,
          max_tokens: 8000,
          // Every agent here does focused, single-step JSON generation from
          // context it's already been given — not multi-step reasoning — so
          // extended thinking (on by default on this model) only adds latency
          // and cost without improving output quality. Turned off for speed.
          thinking: { type: "disabled" },
          system,
          messages: [{ role: "user", content: user }],
          // Claude's own hosted web search — no separate API key, billed
          // through ANTHROPIC_API_KEY above. Only a few agents ask for this
          // (see orchestrator.ts) since it adds latency and cost per search.
          // max_uses defaults to 4, but an agent checking many distinct
          // facts (e.g. TractionAgent's ~10 separate metrics) can ask for
          // more by passing a number instead of `true`.
          ...(enableWebSearch
            ? {
                tools: [
                  {
                    type: "web_search_20260209" as const,
                    name: "web_search" as const,
                    max_uses: typeof enableWebSearch === "number" ? enableWebSearch : 4,
                  },
                ],
              }
            : {}),
        },
        { signal }
      );

      // With web search on, Claude's answer can be split across multiple
      // text blocks interleaved with search-result blocks — grabbing only
      // the first one (like this used to) would silently drop the rest of
      // the JSON. Concatenate every text block in order instead; blocks only
      // split where a tool call interrupts the stream, never mid-sentence,
      // so plain concatenation reproduces the original text correctly.
      let combinedText = "";
      for (const block of response.content) {
        if (block.type === "text") {
          combinedText += block.text;
        } else if (block.type === "web_search_tool_result") {
          if (Array.isArray(block.content)) {
            console.log(`[web_search] ${block.content.length} result(s) returned`);
          } else {
            console.warn(`[web_search] search error: ${block.content.error_code}`);
          }
        }
      }

      if (!combinedText) {
        throw new Error("Claude returned no text content.");
      }
      const webSearchCount = response.usage.server_tool_use?.web_search_requests ?? 0;
      if (webSearchCount) {
        console.log(`[web_search] ${webSearchCount} search(es) run`);
      }
      return { text: combinedText, meta: { webSearchCount } };
    },
  };
}
