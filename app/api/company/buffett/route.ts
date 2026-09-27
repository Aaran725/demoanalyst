import { NextResponse } from "next/server";
import { companyInputSchema, buffettMemoSchema } from "@/lib/ai/company-schemas";
import { buildFinancialBundle } from "@/lib/data/company-financials";
import { buildFinancialSnapshot } from "@/lib/ai/build-financial-snapshot";
import { buildBuffettPrompt } from "@/lib/ai/prompts/company/buffett";
import { callAgent } from "@/lib/ai/callAgent";
import { createAnthropicProvider } from "@/lib/ai/anthropic";

/** POST /api/company/buffett — on-demand "Analyze Like Buffett" memo, reusing the already-fetched real financial data. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = companyInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ mode: "error", error: "Please provide a valid ticker symbol." }, { status: 400 });
  }

  const demoMode = process.env.DEMO_MODE === "true" || !process.env.ANTHROPIC_API_KEY;
  if (demoMode) {
    return NextResponse.json({
      mode: "demo",
      memo: {
        business: "DEMO DATA — illustrative: an industrial-automation business with a growing recurring-software layer.",
        competitiveAdvantage: "DEMO DATA — illustrative data/switching-cost moat around the installed base.",
        economics: "DEMO DATA — illustrative high incremental margins on the software attach.",
        management: "DEMO DATA — illustrative mostly consistent capital allocation.",
        capitalAllocation: "DEMO DATA — illustrative modest buybacks funded by strong FCF.",
        financialQuality: "DEMO DATA — illustrative FCF conversion above net income.",
        valuation: "DEMO DATA — illustrative valuation already assumes a long runway of premium growth.",
        risks: "DEMO DATA — illustrative customer concentration and execution risk abroad.",
        whatMustBeTrue: ["DEMO DATA — software attach rate keeps rising", "DEMO DATA — no major customer churn"],
        whatCouldBreakTheThesis: ["DEMO DATA — growth decelerates faster than the market expects"],
        sources: [{ label: "AARAN AI Demo Data", claimSupported: "Illustrative only." }],
      },
    });
  }

  try {
    const bundle = await buildFinancialBundle(parsed.data.ticker);
    if (!bundle) {
      return NextResponse.json(
        { mode: "error", error: `"${parsed.data.ticker}" was not found in SEC EDGAR.` },
        { status: 200 }
      );
    }
    const snapshot = buildFinancialSnapshot(bundle);
    const provider = createAnthropicProvider();
    const prompt = buildBuffettPrompt(snapshot);
    const memo = await callAgent(provider, "BuffettAgent", buffettMemoSchema, prompt.system, prompt.user, request.signal, true);
    return NextResponse.json({ mode: "live", memo });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return NextResponse.json({ mode: "cancelled" });
    console.error("Buffett engine failed:", err);
    return NextResponse.json({ mode: "error", error: "Buffett Engine unavailable right now — try again in a moment." }, { status: 200 });
  }
}
