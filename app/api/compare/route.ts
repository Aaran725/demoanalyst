import { NextResponse } from "next/server";
import { callAgent } from "@/lib/ai/callAgent";
import { createAnthropicProvider } from "@/lib/ai/anthropic";
import { buildComparisonPrompt } from "@/lib/ai/prompts/comparison";
import {
  aaranAnswersSchema,
  comparisonResultSchema,
  devilsAdvocateSchema,
  competitiveMoatSchema,
  founderQuestionsSchema,
} from "@/lib/ai/schemas";
import { z } from "zod";

const requestSchema = z.object({
  aaranAnswers: aaranAnswersSchema,
  devilsAdvocate: devilsAdvocateSchema,
  moat: competitiveMoatSchema,
  founderQuestions: founderQuestionsSchema,
});

/**
 * POST /api/compare — powers "Ask Aaran First".
 *
 * Real semantic comparison requires an LLM (deciding whether Aaran's
 * free-text answer and the AI's structured finding are "the same idea in
 * different words" isn't something a keyword match can do honestly). When
 * no live AI is configured, we don't fake that judgment — we say so and let
 * the UI show the raw answers side by side instead.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ mode: "error", error: "Invalid request." }, { status: 400 });
  }
  const { aaranAnswers, devilsAdvocate, moat, founderQuestions } = parsed.data;

  const demoMode = process.env.DEMO_MODE === "true" || !process.env.ANTHROPIC_API_KEY;
  if (demoMode) {
    return NextResponse.json({
      mode: "unavailable",
      notice:
        "A real side-by-side comparison requires live AI (ANTHROPIC_API_KEY). Showing your answers alongside AARAN AI's findings instead.",
    });
  }

  try {
    const provider = createAnthropicProvider();
    const prompt = buildComparisonPrompt(aaranAnswers, devilsAdvocate, moat, founderQuestions);
    const comparison = await callAgent(
      provider,
      "ComparisonAgent",
      comparisonResultSchema,
      prompt.system,
      prompt.user
    );
    return NextResponse.json({ mode: "live", comparison });
  } catch (err) {
    console.error("Comparison failed:", err);
    return NextResponse.json({
      mode: "unavailable",
      notice: "Live comparison failed. Showing your answers alongside AARAN AI's findings instead.",
    });
  }
}
