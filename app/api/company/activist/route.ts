import { NextResponse } from "next/server";
import { companyInputSchema, activistMemoSchema } from "@/lib/ai/company-schemas";
import { buildFinancialBundle } from "@/lib/data/company-financials";
import { buildFinancialSnapshot } from "@/lib/ai/build-financial-snapshot";
import { buildActivistPrompt } from "@/lib/ai/prompts/company/activist";
import { callAgent } from "@/lib/ai/callAgent";
import { createAnthropicProvider } from "@/lib/ai/anthropic";

/** POST /api/company/activist — on-demand "Activist Investor Analysis", reusing the already-fetched real financial data. */
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
        businessVsExecution: "DEMO DATA — illustrative: a strong underlying business with room to tighten operating discipline.",
        marginOpportunity: "DEMO DATA — illustrative operating margin could expand further with cost discipline.",
        capitalAllocationCritique: "DEMO DATA — illustrative buyback pace could be more aggressive given net cash position.",
        excessCashOrAssetValue: "DEMO DATA — illustrative net cash balance sheet is under-levered for this business's cash generation.",
        buybackOrDivestitureOpportunity: "DEMO DATA — illustrative case for a larger, programmatic buyback.",
        pricingPower: "DEMO DATA — illustrative software attach pricing has room to increase.",
        governanceAndIncentives: "DEMO DATA — illustrative management incentives could tie more directly to FCF per share.",
        operationalImprovements: "DEMO DATA — illustrative opportunity to streamline hardware manufacturing costs.",
        valueUnlockOpportunities: [
          { opportunity: "DEMO DATA — larger buyback authorization", rationale: "DEMO DATA — net cash and strong FCF support it.", potentialImpact: "DEMO DATA — illustrative EPS accretion." },
          { opportunity: "DEMO DATA — incentive redesign toward FCF/share", rationale: "DEMO DATA — better aligns management with shareholders.", potentialImpact: "DEMO DATA — illustrative capital-discipline improvement." },
        ],
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
    const prompt = buildActivistPrompt(snapshot);
    const memo = await callAgent(provider, "ActivistAgent", activistMemoSchema, prompt.system, prompt.user, request.signal);
    return NextResponse.json({ mode: "live", memo });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return NextResponse.json({ mode: "cancelled" });
    console.error("Activist engine failed:", err);
    return NextResponse.json({ mode: "error", error: "Activist Engine unavailable right now — try again in a moment." }, { status: 200 });
  }
}
