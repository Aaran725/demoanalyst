import { NextResponse } from "next/server";
import { callAgent } from "@/lib/ai/callAgent";
import { createAnthropicProvider } from "@/lib/ai/anthropic";
import { buildStartupComparisonPrompt } from "@/lib/ai/prompts/startupComparison";
import { comparisonDigestSchema, startupComparisonSchema } from "@/lib/ai/schemas";
import { z } from "zod";

const requestSchema = z.object({
  digests: z.array(comparisonDigestSchema).min(2).max(4),
});

/**
 * POST /api/compare-startups — the real Startup Comparison Engine behind
 * World Cup Scout (app/world-cup/page.tsx). Distinct route/agent name from
 * the existing, unrelated /api/compare (which powers "Ask Aaran First").
 * Only ever receives small digests (see lib/ai/prompts/comparisonDigest.ts),
 * never full FullAnalysis objects.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ mode: "error", error: "Invalid request." }, { status: 400 });
  }
  const { digests } = parsed.data;

  const demoMode = process.env.DEMO_MODE === "true" || !process.env.ANTHROPIC_API_KEY;
  if (demoMode) {
    return NextResponse.json({
      mode: "unavailable",
      notice: "Comparing companies requires live AI (ANTHROPIC_API_KEY).",
    });
  }

  try {
    const provider = createAnthropicProvider();
    const prompt = buildStartupComparisonPrompt(digests);
    const comparison = await callAgent(
      provider,
      "StartupComparisonAgent",
      startupComparisonSchema,
      prompt.system,
      prompt.user,
      request.signal
    );
    return NextResponse.json({ mode: "live", comparison });
  } catch (err) {
    console.error("Startup comparison failed:", err);
    return NextResponse.json({
      mode: "error",
      error: "Live comparison failed. Please try again.",
    });
  }
}
