import { z } from "zod";

/**
 * AARAN AI — Public Equity Analysis Schemas ("Truth Mode")
 * ---------------------------------------------------------
 * Mirrors the role lib/ai/schemas.ts plays for the startup/VC side, but
 * uses the 5-tier confidence scale from the product spec instead of the
 * 4-tier startup scale — public markets have a meaningfully different
 * evidence landscape (analyst consensus, market-implied pricing) that the
 * startup side doesn't.
 *
 * 🟢 verified · 🟡 estimate · 🔵 consensus · 🟠 inference · 🔴 unverified
 *
 * Every agent's output is validated against these shapes before it reaches
 * the UI (see lib/ai/callAgent.ts) — an agent that returns something that
 * doesn't fit gets rejected and retried, never silently shown.
 */

export const confidenceTierSchema = z.enum(["verified", "estimate", "consensus", "inference", "unverified"]);
export type ConfidenceTier = z.infer<typeof confidenceTierSchema>;

export const companySourceSchema = z.object({
  label: z.string(),
  url: z.string().optional(),
  date: z.string().optional(),
  claimSupported: z.string(),
});
export type CompanySource = z.infer<typeof companySourceSchema>;

/** The building block for every qualitative statement on the public-equity side. */
export const companyClaimSchema = z.object({
  text: z.string(),
  confidence: confidenceTierSchema,
  sources: z.array(companySourceSchema).optional(),
});
export type CompanyClaim = z.infer<typeof companyClaimSchema>;

export const companyInputSchema = z.object({
  ticker: z.string().min(1).max(10),
});
export type CompanyInput = z.infer<typeof companyInputSchema>;

// ---------------------------------------------------------------------------
// 1. Business Quality Engine (Fundamental + Industry Analyst)
// ---------------------------------------------------------------------------

export const growthDriverSchema = z.enum([
  "volume",
  "pricing",
  "acquisitions",
  "new_products",
  "international_expansion",
  "ai_demand",
  "market_share_gains",
  "unclear",
]);

export const marginDriverSchema = z.enum([
  "operating_leverage",
  "product_mix",
  "pricing",
  "lower_costs",
  "accounting_effects",
  "unclear",
]);

export const businessQualitySchema = z.object({
  economicEngineSummary: companyClaimSchema.describe("Plain-English explanation of how this business actually makes money"),
  primaryGrowthDrivers: z.array(growthDriverSchema).min(1),
  growthDriverExplanation: companyClaimSchema,
  primaryMarginDrivers: z.array(marginDriverSchema).min(1),
  marginDriverExplanation: companyClaimSchema,
  segmentEconomics: z.array(z.object({ segment: z.string(), note: z.string() })),
  customerConcentration: companyClaimSchema,
  geographicConcentration: companyClaimSchema,
  capitalIntensity: companyClaimSchema,
  workingCapitalTrend: companyClaimSchema,
  recurringRevenueCharacter: companyClaimSchema,
});
export type BusinessQuality = z.infer<typeof businessQualitySchema>;

// ---------------------------------------------------------------------------
// 2. Money Machine / Earnings Quality (Forensic Accountant)
// ---------------------------------------------------------------------------

export const qualityRatingSchema = z.enum(["strong", "mixed", "weak"]);

export const discrepancyAreaSchema = z.enum([
  "accounts_receivable",
  "inventory",
  "accounts_payable",
  "deferred_revenue",
  "capitalized_expenses",
  "stock_compensation",
  "acquisitions",
  "restructuring",
  "one_time_gains",
  "one_time_expenses",
  "tax_effects",
]);

export const earningsQualityAlertSchema = z.object({
  alertText: z.string().describe("e.g. 'Net income increased 35% while operating cash flow increased only 8%.'"),
  severity: z.enum(["low", "medium", "high"]),
  explanation: z.string(),
});

export const moneyMachineSchema = z.object({
  qualityOfEarnings: qualityRatingSchema,
  qualityReasoning: companyClaimSchema,
  discrepancyChecks: z.array(
    z.object({ area: discrepancyAreaSchema, observation: z.string(), confidence: confidenceTierSchema })
  ),
  earningsQualityAlerts: z.array(earningsQualityAlertSchema),
});
export type MoneyMachine = z.infer<typeof moneyMachineSchema>;

// ---------------------------------------------------------------------------
// 3. Valuation Engine + Reverse DCF + Price Opportunity Zones
// ---------------------------------------------------------------------------

export const reverseDcfSchema = z.object({
  impliedRevenueGrowthPct: z.number().nullable(),
  impliedOperatingMarginPct: z.number().nullable(),
  impliedTerminalGrowthPct: z.number().nullable(),
  yearsModeled: z.number().nullable(),
  assumptionsNarrative: z.string().describe("What the current price requires to be true, in plain English"),
  methodologyNote: z.string(),
});
export type ReverseDcf = z.infer<typeof reverseDcfSchema>;

export const priceZoneSchema = z.enum([
  "strong_value",
  "attractive",
  "fair_value",
  "expensive",
  "extreme_expectation",
]);

export const priceZoneRangeSchema = z.object({
  zone: priceZoneSchema,
  rangeLow: z.number().nullable(),
  rangeHigh: z.number().nullable(),
  rationale: z.string(),
});

export const expectationGapSchema = z.object({
  marketImpliedSummary: z.string(),
  historicalPerformanceSummary: z.string(),
  analystConsensusSummary: companyClaimSchema.describe("Mark confidence 'unverified' if no licensed consensus feed is connected"),
  baseScenario: z.string(),
  bullScenario: z.string(),
  bearScenario: z.string(),
});

export const valuationEngineSchema = z.object({
  valuationSummaryNarrative: z.string(),
  reverseDcf: reverseDcfSchema,
  priceOpportunityZones: z.array(priceZoneRangeSchema).min(1),
  expectationGap: expectationGapSchema,
});
export type ValuationEngine = z.infer<typeof valuationEngineSchema>;

// ---------------------------------------------------------------------------
// 4. Investment View (BUY / HOLD / SELL analytical framework)
// ---------------------------------------------------------------------------

export const investmentViewLabelSchema = z.enum(["buy_range", "hold_watch", "reduce_sell_review"]);
export const qualityLabelSchema = z.enum(["strong", "mixed", "weak"]);
export const directionLabelSchema = z.enum(["strengthening", "stable", "weakening"]);
export const riskLevelSchema = z.enum(["low", "moderate", "high", "extreme"]);

export const investmentViewSchema = z.object({
  view: investmentViewLabelSchema,
  baseCaseLow: z.number().nullable(),
  baseCaseHigh: z.number().nullable(),
  bullCaseValue: z.number().nullable(),
  bearCaseValue: z.number().nullable(),
  timeHorizon: z.string(),
  confidenceLevel: z.enum(["high", "medium", "low"]),
  businessQuality: qualityLabelSchema,
  financialQuality: qualityLabelSchema,
  valuationRisk: riskLevelSchema,
  earningsQuality: qualityLabelSchema,
  moatDirection: directionLabelSchema,
  managementExecution: qualityLabelSchema,
  expectationRisk: riskLevelSchema,
  whyNarrative: z.string(),
});
export type InvestmentView = z.infer<typeof investmentViewSchema>;

// ---------------------------------------------------------------------------
// 5. Innovation & Moat Engine
// ---------------------------------------------------------------------------

export const moatFactorNameSchema = z.enum([
  "technology_rnd",
  "patents_ip",
  "data_advantage",
  "network_effects",
  "switching_costs",
  "scale_advantages",
  "brand",
  "distribution",
  "regulatory_barriers",
  "talent_ecosystem",
  "developer_ecosystem",
]);

export const moatFactorSchema = z.object({
  factor: moatFactorNameSchema,
  evidence: z.string(),
  confidence: confidenceTierSchema,
});

export const moatEngineSchema = z.object({
  moatDirection: directionLabelSchema,
  moatNarrative: z.string().describe("Why this direction — never a bare score"),
  factors: z.array(moatFactorSchema).min(1),
  competitiveLandscapeNarrative: z.string(),
});
export type MoatEngine = z.infer<typeof moatEngineSchema>;

// ---------------------------------------------------------------------------
// 6. CEO Promise Tracker (Management Analyst)
// ---------------------------------------------------------------------------

export const promiseStatusSchema = z.enum(["achieved", "partially_achieved", "behind_trajectory", "missed", "pending"]);

export const managementPromiseSchema = z.object({
  statementText: z.string(),
  statementDate: z.string().describe("e.g. 'Q3 2023 earnings call' — approximate is fine if exact date unknown"),
  targetMetric: z.string(),
  actualOutcome: z.string(),
  status: promiseStatusSchema,
  confidence: confidenceTierSchema,
  sources: z.array(companySourceSchema).optional(),
});
export type ManagementPromise = z.infer<typeof managementPromiseSchema>;

export const ceoPromiseTrackerSchema = z.object({
  promises: z.array(managementPromiseSchema),
  executionRecord: z.object({
    promisesTracked: z.number(),
    achieved: z.number(),
    partiallyAchieved: z.number(),
    missed: z.number(),
    pending: z.number(),
  }),
  capitalAllocationHistory: z.array(z.string()),
  strategicConsistencyNarrative: z.string(),
});
export type CeoPromiseTracker = z.infer<typeof ceoPromiseTrackerSchema>;

// ---------------------------------------------------------------------------
// 7. Smart Money / Institutional Intelligence
// ---------------------------------------------------------------------------

export const institutionalHolderSchema = z.object({
  name: z.string(),
  currentShares: z.number().nullable(),
  previousShares: z.number().nullable(),
  changeSharesPct: z.number().nullable(),
  classification: z.enum(["new_position", "increased", "reduced", "exited", "unchanged", "conviction_increase"]),
});

/**
 * Real 13F aggregation (which institutions hold a given ticker, position
 * changes quarter over quarter) requires either a licensed data provider
 * (WhaleWisdom, Fintel, Financial Modeling Prep's institutional endpoints)
 * or a bulk EDGAR 13F-parsing pipeline well beyond a single ticker lookup.
 * Neither is wired up yet, so this is honest about being unavailable rather
 * than inventing holders. Set INSTITUTIONAL_DATA_PROVIDER in .env.local once
 * one is connected.
 */
export const institutionalIntelligenceSchema = z.object({
  dataAvailable: z.boolean(),
  notice: z.string(),
  reportingPeriod: z.string().nullable(),
  filingDate: z.string().nullable(),
  dataAgeDays: z.number().nullable(),
  institutionalOwnershipPct: z.number().nullable(),
  newPositions: z.number().nullable(),
  increasingPositions: z.number().nullable(),
  reducingPositions: z.number().nullable(),
  exitedPositions: z.number().nullable(),
  interpretation: z.enum(["accumulation", "neutral", "distribution"]).nullable(),
  topHolders: z.array(institutionalHolderSchema),
  isDemoData: z.boolean(),
});
export type InstitutionalIntelligence = z.infer<typeof institutionalIntelligenceSchema>;

// ---------------------------------------------------------------------------
// 8. Bull / Bear / Judge
// ---------------------------------------------------------------------------

export const evidencePointSchema = z.object({
  point: z.string(),
  confidence: confidenceTierSchema,
  sources: z.array(companySourceSchema).optional(),
});

export const bullCaseSchema = z.object({
  thesisStatement: z.string(),
  strongestEvidence: z.array(evidencePointSchema).min(3),
  keyDrivers: z.array(z.string()),
});
export type BullCase = z.infer<typeof bullCaseSchema>;

export const bearCaseSchema = z.object({
  attackStatement: z.string(),
  strongestEvidence: z.array(evidencePointSchema).min(3),
  keyRisks: z.array(z.string()),
});
export type BearCase = z.infer<typeof bearCaseSchema>;

export const claimClassificationSchema = z.enum(["fact", "inference", "estimate", "consensus", "unknown"]);

export const judgeVerdictSchema = z.object({
  classifiedClaims: z.array(z.object({ claim: z.string(), classification: claimClassificationSchema })),
  strongestBullPoint: z.string(),
  strongestBearPoint: z.string(),
  unresolvedQuestions: z.array(z.string()),
  criticalAssumptions: z.array(z.string()),
  informationGaps: z.array(z.string()),
});
export type JudgeVerdict = z.infer<typeof judgeVerdictSchema>;

// ---------------------------------------------------------------------------
// 9. Buffett Engine (on-demand)
// ---------------------------------------------------------------------------

export const buffettMemoSchema = z.object({
  business: z.string(),
  competitiveAdvantage: z.string(),
  economics: z.string(),
  management: z.string(),
  capitalAllocation: z.string(),
  financialQuality: z.string(),
  valuation: z.string(),
  risks: z.string(),
  whatMustBeTrue: z.array(z.string()),
  whatCouldBreakTheThesis: z.array(z.string()),
  sources: z.array(companySourceSchema),
});
export type BuffettMemo = z.infer<typeof buffettMemoSchema>;

// ---------------------------------------------------------------------------
// 10. Activist Engine (on-demand)
// ---------------------------------------------------------------------------

export const valueUnlockOpportunitySchema = z.object({
  opportunity: z.string(),
  rationale: z.string(),
  potentialImpact: z.string(),
});

export const activistMemoSchema = z.object({
  businessVsExecution: z.string(),
  marginOpportunity: z.string(),
  capitalAllocationCritique: z.string(),
  excessCashOrAssetValue: z.string(),
  buybackOrDivestitureOpportunity: z.string(),
  pricingPower: z.string(),
  governanceAndIncentives: z.string(),
  operationalImprovements: z.string(),
  valueUnlockOpportunities: z.array(valueUnlockOpportunitySchema),
});
export type ActivistMemo = z.infer<typeof activistMemoSchema>;

// ---------------------------------------------------------------------------
// 11. Investment Committee Memo (final synthesis)
// ---------------------------------------------------------------------------

export const catalystSchema = z.object({
  description: z.string(),
  timing: z.string(),
  confidence: confidenceTierSchema,
});

export const companyIcMemoSchema = z.object({
  executiveSummary: z.string(),
  investmentThesis: z.string(),
  businessQualitySummary: z.string(),
  financialQualitySummary: z.string(),
  valuationSummary: z.string(),
  managementSummary: z.string(),
  moatSummary: z.string(),
  institutionalActivitySummary: z.string(),
  positiveCatalysts: z.array(catalystSchema),
  negativeCatalysts: z.array(catalystSchema),
  risks: z.array(z.string()),
  bullCaseSummary: z.string(),
  baseCaseSummary: z.string(),
  bearCaseSummary: z.string(),
  marketExpectationsSummary: z.string(),
  upgradeConditions: z.array(z.string()),
  downgradeConditions: z.array(z.string()),
  criticalUnknowns: z.array(z.string()),
  sources: z.array(companySourceSchema),
  generatedAt: z.string(),
});
export type CompanyIcMemo = z.infer<typeof companyIcMemoSchema>;

// ---------------------------------------------------------------------------
// The full analysis object — one ticker, fully researched
// ---------------------------------------------------------------------------

/** Serializable snapshot of the real financial data the agents were given — kept on the result so the UI can show it directly instead of re-deriving. */
export const financialSnapshotSchema = z.object({
  companyName: z.string(),
  ticker: z.string(),
  cik: z.string(),
  sector: z.string().nullable(),
  price: z.number().nullable(),
  priceAsOf: z.string().nullable(),
  priceSource: z.string(),
  marketCap: z.number().nullable(),
  revenueLatest: z.number().nullable(),
  revenueFiscalYear: z.number().nullable(),
  netIncomeLatest: z.number().nullable(),
  epsLatest: z.number().nullable(),
  metrics: z.record(
    z.string(),
    z.object({
      value: z.number().nullable(),
      confidence: confidenceTierSchema,
      source: z.string(),
      note: z.string().optional(),
    })
  ),
  revenueHistory: z.array(z.object({ fiscalYear: z.number(), value: z.number() })),
  netIncomeHistory: z.array(z.object({ fiscalYear: z.number(), value: z.number() })),
  fcfHistory: z.array(z.object({ fiscalYear: z.number(), operatingCashFlow: z.number().nullable(), capex: z.number().nullable() })),
});
export type FinancialSnapshot = z.infer<typeof financialSnapshotSchema>;

export const fullCompanyAnalysisSchema = z.object({
  id: z.string(),
  input: companyInputSchema,
  isDemoData: z.boolean().default(false),
  createdAt: z.string(),
  financials: financialSnapshotSchema,
  businessQuality: businessQualitySchema,
  moneyMachine: moneyMachineSchema,
  valuation: valuationEngineSchema,
  investmentView: investmentViewSchema,
  moat: moatEngineSchema,
  ceoPromiseTracker: ceoPromiseTrackerSchema,
  institutional: institutionalIntelligenceSchema,
  bull: bullCaseSchema,
  bear: bearCaseSchema,
  judge: judgeVerdictSchema,
  icMemo: companyIcMemoSchema,
  buffett: buffettMemoSchema.optional(),
  activist: activistMemoSchema.optional(),
});
export type FullCompanyAnalysis = z.infer<typeof fullCompanyAnalysisSchema>;
