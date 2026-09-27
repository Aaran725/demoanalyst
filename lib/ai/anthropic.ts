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
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929";

  return {
    name: "anthropic",
    async complete({ system, user }) {
      const response = await client.messages.create({
        model,
        max_tokens: 4096,
        system,
        messages: [{ role: "user", content: user }],
      });

      const textBlock = response.content.find((block) => block.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("Claude returned no text content.");
      }
      return textBlock.text;
    },
  };
}
