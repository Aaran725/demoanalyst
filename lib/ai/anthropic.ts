import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider } from "./provider";
import { CORE_RULES } from "./prompts/shared";

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
      // Every one of this app's ~15 agent calls builds its system prompt via
      // buildSystemPrompt() (lib/ai/prompts/shared.ts), which always starts
      // with the same, large, byte-identical CORE_RULES block. Splitting
      // that shared prefix into its own cached content block means the
      // cache written by the FIRST call in a pipeline run (ResearchAgent)
      // is reused by every later call in that same run (well within the
      // ephemeral cache's ~5-minute TTL) — real cost and latency savings
      // with zero effect on what any agent is asked. Falls back to sending
      // `system` uncached if it doesn't start with CORE_RULES (e.g. a
      // future prompt not built via buildSystemPrompt).
      const systemParam = system.startsWith(CORE_RULES)
        ? [
            { type: "text" as const, text: CORE_RULES, cache_control: { type: "ephemeral" as const } },
            { type: "text" as const, text: system.slice(CORE_RULES.length) },
          ]
        : system;

      const response = await client.messages.create(
        {
          model,
          max_tokens: 8000,
          // Every agent here does focused, single-step JSON generation from
          // context it's already been given — not multi-step reasoning — so
          // extended thinking (on by default on this model) only adds latency
          // and cost without improving output quality. Turned off for speed.
          thinking: { type: "disabled" },
          system: systemParam,
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
      const cacheRead = response.usage.cache_read_input_tokens ?? 0;
      const cacheCreated = response.usage.cache_creation_input_tokens ?? 0;
      if (cacheRead || cacheCreated) {
        console.log(`[cache] read ${cacheRead} tokens, wrote ${cacheCreated} tokens`);
      }
      return { text: combinedText, meta: { webSearchCount } };
    },
  };
}
