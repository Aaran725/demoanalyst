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
    async complete({ system, user, signal }) {
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
        },
        { signal }
      );

      const textBlock = response.content.find((block) => block.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("Claude returned no text content.");
      }
      return textBlock.text;
    },
  };
}
