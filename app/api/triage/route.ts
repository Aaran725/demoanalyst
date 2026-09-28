import { NextResponse } from "next/server";
import { callAgent } from "@/lib/ai/callAgent";
import { createAnthropicProvider } from "@/lib/ai/anthropic";
import { buildTriagePrompt } from "@/lib/ai/prompts/triage";
import { triageEntrySchema } from "@/lib/ai/schemas";
import { z } from "zod";

const requestSchema = z.object({
  companyNames: z.array(z.string().min(1).max(120)).min(2).max(10),
});

/**
 * POST /api/triage — Deal Flow Triage: a fast, lightweight pass over 2-10
 * companies at once, side by side. Uses Promise.allSettled (NOT
 * Promise.all) deliberately — one company's failure (a name Claude can't
 * find anything on, a transient error) must not sink the whole batch, so
 * every company gets its own success/error outcome. No NDJSON streaming
 * here: a single batched round-trip is the right scope for this much
 * smaller per-company workload.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ mode: "error", error: "Invalid request — provide 2-10 company names." }, { status: 400 });
  }
  const { companyNames } = parsed.data;

  const demoMode = process.env.DEMO_MODE === "true" || !process.env.ANTHROPIC_API_KEY;
  if (demoMode) {
    return NextResponse.json({
      mode: "unavailable",
      notice: "Deal Flow Triage requires live AI (ANTHROPIC_API_KEY).",
    });
  }

  const provider = createAnthropicProvider();
  const outcomes = await Promise.allSettled(
    companyNames.map(async (companyName) => {
      const prompt = buildTriagePrompt(companyName);
      return callAgent(provider, "TriageAgent", triageEntrySchema, prompt.system, prompt.user, request.signal, 3);
    })
  );

  const results = outcomes.map((outcome, i) => {
    const companyName = companyNames[i];
    if (outcome.status === "fulfilled") {
      return { companyName, status: "ok" as const, entry: outcome.value };
    }
    return {
      companyName,
      status: "error" as const,
      error: outcome.reason instanceof Error ? outcome.reason.message : "Triage failed for this company.",
    };
  });

  return NextResponse.json({ mode: "live", results });
}
