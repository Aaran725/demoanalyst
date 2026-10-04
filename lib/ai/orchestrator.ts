import type { AIProvider } from "./provider";
import type { ProgressStep } from "./progress";
import { callAgent, type AgentTraceInfo, type LiveAgentEvent } from "./callAgent";
import {
  startupInputSchema,
  startupSnapshotSchema,
  marketIntelligenceSchema,
  productAnalysisSchema,
  businessModelSchema,
  tractionSchema,
  competitorMapSchema,
  competitiveMoatSchema,
  founderAnalysisSchema,
  strategicFitSchema,
  pegasusFitSchema,
  japanOpportunitySchema,
  devilsAdvocateSchema,
  criticalQuestionsSchema,
  founderQuestionsSchema,
  nextDiligenceSchema,
  icMemoSchema,
  factCheckResultSchema,
  type StartupInput,
  type FullAnalysis,
  type AgentTraceEntry,
} from "./schemas";
import { collectVerifiedFactClaims, applyFactCheckVerdicts } from "./factCheckCollector";
import { buildFactCheckPrompt } from "./prompts/factCheck";
import { buildResearchPrompt } from "./prompts/research";
import { buildMarketPrompt } from "./prompts/market";
import { buildProductPrompt } from "./prompts/product";
import { buildBusinessModelPrompt } from "./prompts/businessModel";
import { buildTractionPrompt } from "./prompts/traction";
import { buildCompetitionPrompt } from "./prompts/competition";
import { buildMoatPrompt } from "./prompts/moat";
import { buildFounderPrompt } from "./prompts/founder";
import { buildStrategicFitPrompt } from "./prompts/strategicFit";
import { buildPegasusFitPrompt } from "./prompts/pegasusFit";
import { buildJapanPrompt } from "./prompts/japan";
import { buildDevilsAdvocatePrompt } from "./prompts/devilsAdvocate";
import { buildDiligencePrompt } from "./prompts/diligence";
import { buildMemoPrompt } from "./prompts/memo";
import { z } from "zod";

/**
 * The AARAN AI pipeline.
 * -----------------------
 * Conceptually the 14 agents run one after another (see docs/AI_AGENTS.md
 * for the full diagram). In practice, many of them only need the same
 * up-front research and don't depend on each other, so we run those in
 * parallel — this keeps a real Claude-backed analysis far shallower than
 * 14 network round-trips deep, which matters a lot for a live demo.
 *
 *   Round 1: ResearchAgent (everything else needs this first)
 *   Round 2: MarketAgent, ProductAgent, BusinessModelAgent, TractionAgent,
 *            CompetitionAgent, FounderAgent, PegasusFitAgent, JapanAgent
 *            (all just need Round 1's output)
 *   Round 3: MoatAgent, StrategicFitAgent, DevilsAdvocateAgent
 *            (need Round 2's output — but NOT all of it, see below)
 *   Round 4: DiligenceAgent, then MemoAgent (need everything)
 *
 * Below, each Round 3/4 agent is wired to await only the SPECIFIC Round 2/3
 * promises it actually reads (per its own prompt-builder's parameters),
 * not a blanket "wait for the whole round" barrier. StrategicFitAgent only
 * reads `market`; MoatAgent only reads `product`+`competitors`;
 * DevilsAdvocateAgent only reads `market`+`competitors` — none of them use
 * `businessModel`, `traction`, `founders`, `pegasusFit`, or `japan`, so
 * there's no reason for them to wait on whichever of those 5 happens to be
 * slowest. Likewise DiligenceAgent reads `businessModel`, `traction`,
 * `competitors`, `devilsAdvocate` — never `moat` or `strategicFit` — so it
 * shouldn't wait for those either. This is pure waste elimination: it
 * changes when a call fires, never what any agent is asked or how it
 * reasons, so it carries no quality risk. (Trade-off, accepted: if one
 * agent fails, e.g. FounderAgent, other agents that don't depend on it
 * still run to completion before the final Promise.all surfaces the
 * failure — slightly more wasted spend in that rare case, in exchange for
 * real parallelism on every successful run.)
 */

export async function runAnalysisPipeline(
  provider: AIProvider,
  rawInput: unknown,
  onProgress?: (step: ProgressStep) => void,
  signal?: AbortSignal,
  onLiveEvent?: (event: LiveAgentEvent) => void
): Promise<FullAnalysis> {
  const input: StartupInput = startupInputSchema.parse(rawInput);

  // Real per-agent timing/web-search instrumentation for the Agent Trace
  // panel (components/analysis/AgentTracePanel.tsx) — see AgentTraceInfo in
  // callAgent.ts. Collected locally rather than threaded through onProgress
  // since it's meant to be inspected after the fact, not streamed live.
  const traces: AgentTraceEntry[] = [];
  const recordTrace = (round: number) => (t: AgentTraceInfo) =>
    traces.push({ ...t, round, usedWebSearch: t.webSearchCount > 0 });

  onProgress?.("researching");
  const researchPrompt = buildResearchPrompt(input);
  const snapshot = await callAgent(
    provider,
    "ResearchAgent",
    startupSnapshotSchema,
    researchPrompt.system,
    researchPrompt.user,
    signal,
    true,
    recordTrace(1),
    onLiveEvent
  );

  // Round 2 — kick off all 8 immediately. `runStep`/`callAgent` start the
  // actual network request the instant they're called (a JS Promise is
  // eager), so these fire concurrently right here, before anything below
  // ever awaits them.
  const marketPromise = runStep(
    provider,
    "MarketAgent",
    marketIntelligenceSchema,
    buildMarketPrompt(input, snapshot),
    signal,
    // Without search this agent has no way to ever find a real, citable
    // TAM/SAM/SOM — it only sees ResearchAgent's company-level snapshot,
    // which has no market-sizing field. Budget 5 covers TAM, SAM, SOM, and
    // growth rate as the specific numeric facts worth individually
    // searching for (market drivers/signals/trends stay analytical).
    5,
    recordTrace(2),
    onLiveEvent
  );
  const productPromise = runStep(
    provider,
    "ProductAgent",
    productAnalysisSchema,
    buildProductPrompt(input, snapshot),
    signal,
    // Data/distribution/integration advantage are real, findable facts
    // (real partnerships, real integrations) for a documented company —
    // without search this agent could only guess from the thin snapshot,
    // which was leaving genuinely-findable specifics marked "unknown".
    5,
    recordTrace(2),
    onLiveEvent
  );
  const businessModelPromise = runStep(
    provider,
    "BusinessModelAgent",
    businessModelSchema,
    buildBusinessModelPrompt(input, snapshot),
    signal,
    // Revenue/pricing model are often genuinely public for a notable
    // company (published pricing pages, press on business model) — same
    // "give it the tool before expecting it to find the fact" fix as
    // MarketAgent/ProductAgent above.
    6,
    recordTrace(2),
    onLiveEvent
  );
  const tractionPromise = runStep(
    provider,
    "TractionAgent",
    tractionSchema,
    buildTractionPrompt(input, snapshot),
    signal,
    // TractionAgent has to verify ~10 distinct financial/usage metrics
    // (revenue, ARR, growth, customers, users, retention, partnerships,
    // funding, product adoption, international expansion) — the default
    // 4-search budget (see anthropic.ts) isn't enough to run a separate
    // targeted search per metric, which was leaving genuinely-findable
    // figures marked "unknown" just because the searches ran out.
    8,
    recordTrace(2),
    onLiveEvent
  );
  const competitorsPromise = runStep(
    provider,
    "CompetitionAgent",
    competitorMapSchema,
    buildCompetitionPrompt(input, snapshot),
    signal,
    // Real, named competitors with real funding/scale details need actual
    // search, not recall — without it this agent could only name whatever
    // competitors it happened to remember from training, possibly stale.
    6,
    recordTrace(2),
    onLiveEvent
  );
  const foundersPromise = runStep(
    provider,
    "FounderAgent",
    founderAnalysisSchema,
    buildFounderPrompt(input, snapshot),
    signal,
    true,
    recordTrace(2),
    onLiveEvent
  );
  const pegasusFitPromise = runStep(
    provider,
    "PegasusFitAgent",
    pegasusFitSchema,
    buildPegasusFitPrompt(input, snapshot),
    signal,
    true,
    recordTrace(2),
    onLiveEvent
  );
  const japanPromise = runStep(
    provider,
    "JapanAgent",
    japanOpportunitySchema,
    buildJapanPrompt(input, snapshot),
    signal,
    true,
    recordTrace(2),
    onLiveEvent
  );
  [
    "product",
    "market",
    "business_model",
    "traction",
    "competitors",
    "founders",
    "pegasus_fit",
    "japan",
  ].forEach((s) => onProgress?.(s as ProgressStep));

  // Round 3 — each agent awaits only ITS OWN real inputs (see the doc
  // comment above), not the whole Round 2 batch. onProgress fires the
  // instant each one's request actually starts, which is more accurate
  // than announcing a whole round upfront.
  const moatPromise = Promise.all([productPromise, competitorsPromise]).then(([product, competitors]) => {
    onProgress?.("moat");
    return runStep(
      provider,
      "MoatAgent",
      competitiveMoatSchema,
      buildMoatPrompt(input, snapshot, product, competitors),
      signal,
      // Small budget — lets it check specifics (brand reputation,
      // regulatory position, real partnerships) across 10 factors rather
      // than reasoning purely over Product/Competitors' already-passed-in
      // output.
      4,
      recordTrace(3),
      onLiveEvent
    );
  });
  const strategicFitPromise = marketPromise.then((market) => {
    onProgress?.("strategic_fit");
    return runStep(
      provider,
      "StrategicFitAgent",
      strategicFitSchema,
      buildStrategicFitPrompt(input, snapshot, market),
      signal,
      undefined,
      recordTrace(3),
      onLiveEvent
    );
  });
  const devilsAdvocatePromise = Promise.all([marketPromise, competitorsPromise]).then(([market, competitors]) => {
    onProgress?.("devils_advocate");
    return runStep(
      provider,
      "DevilsAdvocateAgent",
      devilsAdvocateSchema,
      buildDevilsAdvocatePrompt(input, snapshot, market, competitors),
      signal,
      undefined,
      recordTrace(3),
      onLiveEvent
    );
  });

  // FactCheckerAgent — also Round 3: an independent re-verification pass
  // over the highest-stakes "verified_fact" claims from Round 2. Needs
  // every Round 2 section that can contain a Claim (market, product,
  // businessModel, traction, founders — see factCheckCollector.ts), so it
  // waits on all 5, same as any other Round 3 agent waiting on its actual
  // inputs. Candidates are collected here (not before Round 2 resolves)
  // since collectVerifiedFactClaims needs the real Round 2 output objects.
  const factCheckPromise = Promise.all([
    marketPromise,
    productPromise,
    businessModelPromise,
    tractionPromise,
    foundersPromise,
  ]).then(async ([market, product, businessModel, traction, founders]) => {
    onProgress?.("fact_check");
    const candidates = collectVerifiedFactClaims({ snapshot, market, product, businessModel, traction, founders });
    if (candidates.length === 0) {
      return { candidates, result: { checked: [] } };
    }
    const result = await runStep(
      provider,
      "FactCheckerAgent",
      factCheckResultSchema,
      buildFactCheckPrompt(input, snapshot, candidates),
      signal,
      6,
      recordTrace(3),
      onLiveEvent
    );
    return { candidates, result };
  });

  // Round 4 (Diligence) — needs businessModel/traction/competitors +
  // devilsAdvocate, NOT moat or strategicFit, so it starts as soon as
  // those four are ready rather than waiting for all of Round 3.
  const diligenceSchema = z.object({
    criticalQuestions: criticalQuestionsSchema,
    founderQuestions: founderQuestionsSchema,
    nextDiligence: nextDiligenceSchema,
  });
  const diligencePromise = Promise.all([
    businessModelPromise,
    tractionPromise,
    competitorsPromise,
    devilsAdvocatePromise,
  ]).then(([businessModel, traction, competitors, devilsAdvocate]) => {
    onProgress?.("diligence");
    return runStep(
      provider,
      "DiligenceAgent",
      diligenceSchema,
      buildDiligencePrompt(input, snapshot, businessModel, traction, competitors, devilsAdvocate),
      signal,
      undefined,
      recordTrace(4),
      onLiveEvent
    );
  });

  // Resolve everything together — whatever the true last constraint turns
  // out to be for this particular run, this is where it's actually awaited.
  const [
    market,
    product,
    businessModel,
    traction,
    competitors,
    founders,
    pegasusFit,
    japan,
    moat,
    strategicFit,
    devilsAdvocate,
    diligence,
    factCheck,
  ] = await Promise.all([
    marketPromise,
    productPromise,
    businessModelPromise,
    tractionPromise,
    competitorsPromise,
    foundersPromise,
    pegasusFitPromise,
    japanPromise,
    moatPromise,
    strategicFitPromise,
    devilsAdvocatePromise,
    diligencePromise,
    factCheckPromise,
  ]);

  // Apply fact-check verdicts before building analysisSoFar/calling Memo, so
  // the corrected claim status/sources flow into the final report. Honest
  // limitation: DiligenceAgent runs concurrently with FactCheckerAgent (both
  // are Round 3/4), so its output was generated from the pre-fact-check
  // claims — only Memo and the rendered report itself see the corrected data.
  applyFactCheckVerdicts(factCheck.candidates, factCheck.result);

  const analysisSoFar = {
    snapshot,
    market,
    product,
    businessModel,
    traction,
    competitors,
    moat,
    founders,
    strategicFit,
    pegasusFit,
    japan,
    devilsAdvocate,
    criticalQuestions: diligence.criticalQuestions,
    founderQuestions: diligence.founderQuestions,
    nextDiligence: diligence.nextDiligence,
  };

  onProgress?.("memo");
  const memoOutput = await runStep(
    provider,
    "MemoAgent",
    z.object({
      executiveSummary: z.string(),
      missingInformation: z.array(z.string()),
      sources: icMemoSchema.shape.sources,
    }),
    buildMemoPrompt(input, analysisSoFar),
    signal,
    undefined,
    recordTrace(4),
    onLiveEvent
  );

  onProgress?.("done");

  return {
    id: crypto.randomUUID(),
    input,
    isDemoData: false,
    createdAt: new Date().toISOString(),
    ...analysisSoFar,
    icMemo: {
      ...memoOutput,
      generatedAt: new Date().toISOString(),
    },
    agentTrace: traces,
  };
}

/** Small helper so Promise.all entries above read as one line each. */
function runStep<T>(
  provider: AIProvider,
  agentName: string,
  schema: z.ZodType<T>,
  prompt: { system: string; user: string },
  signal?: AbortSignal,
  enableWebSearch?: boolean | number,
  onTrace?: (info: AgentTraceInfo) => void,
  onLive?: (event: LiveAgentEvent) => void
): Promise<T> {
  return callAgent(provider, agentName, schema, prompt.system, prompt.user, signal, enableWebSearch, onTrace, onLive);
}
