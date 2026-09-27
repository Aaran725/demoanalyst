import { NextResponse } from "next/server";
import { runAnalysisPipeline } from "@/lib/ai/orchestrator";
import { createAnthropicProvider } from "@/lib/ai/anthropic";
import { findDemoAnalysisForQuery } from "@/lib/demo-data";
import { startupInputSchema } from "@/lib/ai/schemas";

/**
 * POST /api/analyze
 * -------------------
 * This is the ONLY server route that talks to the Claude API. The browser
 * never sees ANTHROPIC_API_KEY — it only ever calls this endpoint.
 *
 * Behavior:
 *  - DEMO_MODE=true (or no ANTHROPIC_API_KEY set): always returns one of the
 *    3 built-in demo companies, picked by best name match. This is what
 *    makes the app "never fail" during a live presentation.
 *  - Otherwise: runs the real 14-agent Claude pipeline. If anything fails
 *    (rate limit, timeout, malformed output even after retry), we return a
 *    clear error PLUS a demo fallback so the UI can offer "Use demo
 *    analysis" instead of a dead end.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsedInput = startupInputSchema.safeParse(body);

  if (!parsedInput.success) {
    return NextResponse.json(
      { mode: "error", error: "Please provide at least a company name." },
      { status: 400 }
    );
  }
  const input = parsedInput.data;

  const demoMode = process.env.DEMO_MODE === "true" || !process.env.ANTHROPIC_API_KEY;

  if (demoMode) {
    const analysis = findDemoAnalysisForQuery(input.companyName);
    return NextResponse.json({
      mode: "demo",
      analysis,
      notice: !process.env.ANTHROPIC_API_KEY
        ? "No ANTHROPIC_API_KEY configured — showing demo data."
        : "Demo Mode is enabled — showing demo data.",
    });
  }

  try {
    const provider = createAnthropicProvider();
    const analysis = await runAnalysisPipeline(provider, input);
    return NextResponse.json({ mode: "live", analysis });
  } catch (err) {
    console.error("Live analysis failed:", err);
    const demoFallback = findDemoAnalysisForQuery(input.companyName);
    return NextResponse.json(
      {
        mode: "error",
        error:
          "Live research unavailable right now. This can happen if the AI service is rate-limited or times out.",
        demoFallback,
      },
      { status: 200 }
    );
  }
}
