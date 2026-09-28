import { NextResponse } from "next/server";
import { callAgent } from "@/lib/ai/callAgent";
import { createAnthropicProvider } from "@/lib/ai/anthropic";
import { buildFollowUpPrompt } from "@/lib/ai/prompts/followUp";
import { followUpDigestSchema, followUpAnswerSchema } from "@/lib/ai/schemas";
import { z } from "zod";

const requestSchema = z.object({
  digest: followUpDigestSchema,
  question: z.string().min(1).max(500),
});

/**
 * POST /api/follow-up — the live "Ask AARAN Anything" box shown above the
 * report tabs (see components/analysis/FollowUpQA.tsx). Only a small digest
 * of the analysis goes over the wire (see lib/ai/prompts/followUpDigest.ts),
 * not the full FullAnalysis — same on-demand-agent idiom as
 * app/api/market-entry/route.ts.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ mode: "error", error: "Invalid request." }, { status: 400 });
  }
  const { digest, question } = parsed.data;

  const demoMode = process.env.DEMO_MODE === "true" || !process.env.ANTHROPIC_API_KEY;
  if (demoMode) {
    return NextResponse.json({
      mode: "unavailable",
      notice: "Live follow-up questions require live AI (ANTHROPIC_API_KEY).",
    });
  }

  try {
    const provider = createAnthropicProvider();
    const prompt = buildFollowUpPrompt(digest, question);
    const result = await callAgent(
      provider,
      "FollowUpAgent",
      followUpAnswerSchema,
      prompt.system,
      prompt.user,
      request.signal,
      5
    );
    return NextResponse.json({ mode: "live", result });
  } catch (err) {
    console.error("Follow-up question failed:", err);
    return NextResponse.json({
      mode: "error",
      error: "Live follow-up answer failed. Please try again.",
    });
  }
}
