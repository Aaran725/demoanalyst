import { NextResponse } from "next/server";
import { callAgent } from "@/lib/ai/callAgent";
import { createAnthropicProvider } from "@/lib/ai/anthropic";
import { buildMarketEntryPrompt } from "@/lib/ai/prompts/marketEntry";
import { startupInputSchema, startupSnapshotSchema, marketEntryOpportunitySchema } from "@/lib/ai/schemas";
import { z } from "zod";

const requestSchema = z.object({
  input: startupInputSchema,
  snapshot: startupSnapshotSchema,
  market: z.string().min(1).max(80),
});

/**
 * POST /api/market-entry — the on-demand "explore another market" tool
 * beneath the pinned Japan Opportunity tab (see
 * components/analysis/MarketEntryExplorer.tsx). Both `input` and `snapshot`
 * are already on the client's FullAnalysis, so no extra data fetching is
 * needed — this just runs one more single-shot agent call, same pattern as
 * /api/compare (which powers "Ask Aaran First").
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ mode: "error", error: "Invalid request." }, { status: 400 });
  }
  const { input, snapshot, market } = parsed.data;

  const demoMode = process.env.DEMO_MODE === "true" || !process.env.ANTHROPIC_API_KEY;
  if (demoMode) {
    return NextResponse.json({
      mode: "unavailable",
      notice: "Exploring a market on demand requires live AI (ANTHROPIC_API_KEY).",
    });
  }

  try {
    const provider = createAnthropicProvider();
    const prompt = buildMarketEntryPrompt(input, snapshot, market);
    const result = await callAgent(
      provider,
      "MarketEntryAgent",
      marketEntryOpportunitySchema,
      prompt.system,
      prompt.user,
      request.signal,
      true
    );
    return NextResponse.json({ mode: "live", result });
  } catch (err) {
    console.error("Market entry analysis failed:", err);
    return NextResponse.json({
      mode: "error",
      error: "Live market entry analysis failed. Please try again.",
    });
  }
}
