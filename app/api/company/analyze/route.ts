import { NextResponse } from "next/server";
import { runCompanyAnalysisPipeline, CompanyNotFoundError } from "@/lib/ai/company-orchestrator";
import { createAnthropicProvider } from "@/lib/ai/anthropic";
import { companyInputSchema } from "@/lib/ai/company-schemas";
import { DEMO_COMPANY_ANALYSIS } from "@/lib/demo-data/company-demo";

/**
 * POST /api/company/analyze
 * ---------------------------
 * The only server route that runs the public-equity Investment Committee
 * pipeline. Mirrors app/api/analyze/route.ts's contract exactly (mode:
 * "demo" | "live" | "error" | "cancelled") so the client hook can reuse the
 * same shape.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsedInput = companyInputSchema.safeParse(body);

  if (!parsedInput.success) {
    return NextResponse.json({ mode: "error", error: "Please provide a valid ticker symbol." }, { status: 400 });
  }
  const { ticker } = parsedInput.data;

  const demoMode = process.env.DEMO_MODE === "true" || !process.env.ANTHROPIC_API_KEY;

  if (demoMode) {
    return NextResponse.json({
      mode: "demo",
      analysis: { ...DEMO_COMPANY_ANALYSIS, input: { ticker: ticker.toUpperCase() } },
      notice: !process.env.ANTHROPIC_API_KEY
        ? "No ANTHROPIC_API_KEY configured — showing an illustrative demo company, not real data for this ticker."
        : "Demo Mode is enabled — showing an illustrative demo company, not real data for this ticker.",
    });
  }

  try {
    const provider = createAnthropicProvider();
    const analysis = await runCompanyAnalysisPipeline(provider, ticker, undefined, request.signal);
    return NextResponse.json({ mode: "live", analysis });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ mode: "cancelled" });
    }
    if (err instanceof CompanyNotFoundError) {
      return NextResponse.json({ mode: "error", error: err.message }, { status: 200 });
    }
    console.error("Company analysis failed:", err);
    return NextResponse.json(
      {
        mode: "error",
        error:
          "Live research unavailable right now. This can happen if SEC EDGAR or the AI service is rate-limited or times out — try again in a moment.",
      },
      { status: 200 }
    );
  }
}
