import { z } from "zod";

/**
 * AARAN AI — Analysis Schemas
 * ---------------------------
 * This file defines the exact shape of everything an AI agent is allowed
 * to return. Every agent's output is validated against one of these Zod
 * schemas before it reaches the UI. If the AI returns something that
 * doesn't match (missing field, wrong type, made-up structure), the app
 * rejects it instead of silently showing broken or hallucinated data.
 *
 * The most important idea in this file is `evidenceStatusSchema` and
 * `claimSchema` — read those first. Every factual statement in the app
 * (revenue, funding, founder background, market size...) is wrapped in a
 * "claim" that says HOW confident we are in it. This is the Evidence
 * Engine described in the product spec.
 */

// ---------------------------------------------------------------------------
// Evidence Engine primitives
// ---------------------------------------------------------------------------

export const evidenceStatusSchema = z.enum([
  "verified_fact", // Confirmed by a named, checkable source
  "ai_analysis", // The AI's reasoning/interpretation, not a raw fact
  "assumption", // A premise that must be true for the thesis to hold
  "unknown", // We looked and could not establish this
]);
export type EvidenceStatus = z.infer<typeof evidenceStatusSchema>;

export const sourceSchema = z.object({
  label: z.string().describe("Human-readable source name, e.g. 'Company website'"),
  url: z.string().optional().describe("Link to the source, if available"),
  date: z.string().optional().describe("Date the source was published or accessed"),
  claimSupported: z.string().describe("Exactly what this source confirms"),
});
export type Source = z.infer<typeof sourceSchema>;

/**
 * A single factual/analytical statement, tagged with its evidence status.
 * This is the building block used everywhere in the app instead of plain
 * strings, so the UI can always show a VERIFIED FACT / AI ANALYSIS /
 * ASSUMPTION / UNKNOWN badge next to it.
 */
export const claimSchema = z.object({
  text: z.string(),
  status: evidenceStatusSchema,
  sources: z.array(sourceSchema).optional(),
  conflicting: z.boolean().optional().describe("True if credible sources disagree"),
});
export type Claim = z.infer<typeof claimSchema>;

const claimList = z.array(claimSchema);

// ---------------------------------------------------------------------------
// 1. Startup Snapshot
// ---------------------------------------------------------------------------

export const startupSnapshotSchema = z.object({
  companyName: z.string(),
  website: z.string().optional(),
  headquarters: claimSchema,
  founded: claimSchema,
  founders: z.array(z.string()).describe("Founder names, if known"),
  sector: z.string(),
  stage: z.string(),
  fundingRaised: claimSchema,
  employees: claimSchema,
  problem: claimSchema,
  solution: claimSchema,
  product: claimSchema,
  customer: claimSchema.describe("Who actually pays for this"),
  businessModelSummary: claimSchema,
  whyNow: claimSchema,
  tractionSummary: claimSchema,
  technology: claimSchema,
});
export type StartupSnapshot = z.infer<typeof startupSnapshotSchema>;

// ---------------------------------------------------------------------------
// 2. Market Intelligence
// ---------------------------------------------------------------------------

export const marketIntelligenceSchema = z.object({
  category: z.string(),
  tam: claimSchema,
  sam: claimSchema,
  som: claimSchema,
  growthRate: claimSchema,
  marketDrivers: claimList,
  customerDemandSignals: claimList,
  technologyTrends: claimList,
  regulatoryEnvironment: claimSchema,
  geographicOpportunity: claimSchema,
  whyNow: z.string().describe("Narrative: why this market matters right now"),
  whatCouldChangeThisMarket: z.array(z.string()),
});
export type MarketIntelligence = z.infer<typeof marketIntelligenceSchema>;

// ---------------------------------------------------------------------------
// 3. Product Analysis
// ---------------------------------------------------------------------------

export const productAnalysisSchema = z.object({
  uniqueAspects: claimList,
  technologyDifferentiation: claimSchema,
  workflowDifferentiation: claimSchema,
  costAdvantage: claimSchema,
  dataAdvantage: claimSchema,
  distributionAdvantage: claimSchema,
  customerExperience: claimSchema,
  switchingCosts: claimSchema,
  integrationAdvantage: claimSchema,
  whyCustomersMayChoose: z.array(z.string()),
  whyCustomersMayNotChoose: z.array(z.string()),
});
export type ProductAnalysis = z.infer<typeof productAnalysisSchema>;

// ---------------------------------------------------------------------------
// 4. Business Model
// ---------------------------------------------------------------------------

export const businessModelSchema = z.object({
  revenueModel: claimSchema,
  pricingModel: claimSchema,
  recurringRevenue: claimSchema,
  grossMarginPotential: claimSchema,
  customerAcquisition: claimSchema,
  salesCycle: claimSchema,
  capitalIntensity: claimSchema,
  scalability: claimSchema,
  customerConcentration: claimSchema,
  expansionRevenue: claimSchema,
  distribution: claimSchema,
  strengths: z.array(z.string()),
  risks: z.array(z.string()),
  openQuestions: z.array(z.string()),
});
export type BusinessModel = z.infer<typeof businessModelSchema>;

// ---------------------------------------------------------------------------
// 5. Traction
// ---------------------------------------------------------------------------

export const tractionSchema = z.object({
  revenue: claimSchema,
  arr: claimSchema,
  growth: claimSchema,
  customers: claimSchema,
  users: claimSchema,
  retention: claimSchema,
  partnerships: claimSchema,
  funding: claimSchema,
  productAdoption: claimSchema,
  internationalExpansion: claimSchema,
  signals: z.array(z.string()).describe("Qualitative evidence customers want this"),
  openQuestions: z.array(z.string()),
});
export type Traction = z.infer<typeof tractionSchema>;

// ---------------------------------------------------------------------------
// 6. Competitor Map
// ---------------------------------------------------------------------------

export const competitorSchema = z.object({
  name: z.string(),
  category: z.enum(["direct", "indirect", "incumbent", "emerging"]),
  product: z.string(),
  targetCustomer: z.string(),
  businessModel: z.string(),
  differentiation: z.string(),
  fundingOrScale: z.string().optional(),
});
export type Competitor = z.infer<typeof competitorSchema>;

export const competitorMapSchema = z.object({
  competitors: z.array(competitorSchema),
  whatMakesThisStartupDifferent: z.array(z.string()),
  whatCompetitorsCanCopy: z.array(z.string()),
  whyCustomersMightSwitch: z.array(z.string()),
  whyCustomersMightStayWithIncumbent: z.array(z.string()),
});
export type CompetitorMap = z.infer<typeof competitorMapSchema>;

// ---------------------------------------------------------------------------
// 7. Competitive Moat
// ---------------------------------------------------------------------------

export const moatStrengthSchema = z.enum([
  "strong_evidence",
  "some_evidence",
  "weak_evidence",
  "unknown",
]);
export type MoatStrength = z.infer<typeof moatStrengthSchema>;

export const moatFactorSchema = z.object({
  factor: z.enum([
    "technology",
    "proprietary_data",
    "network_effects",
    "distribution",
    "brand",
    "intellectual_property",
    "switching_costs",
    "economies_of_scale",
    "regulatory_advantage",
    "customer_relationships",
  ]),
  strength: moatStrengthSchema,
  reasoning: z.string().describe("Why this rating — never a bare number"),
});
export type MoatFactor = z.infer<typeof moatFactorSchema>;

export const competitiveMoatSchema = z.object({
  factors: z.array(moatFactorSchema),
});
export type CompetitiveMoat = z.infer<typeof competitiveMoatSchema>;

// ---------------------------------------------------------------------------
// 8. Founder / Team Analysis
// ---------------------------------------------------------------------------

export const founderProfileSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  background: claimList.describe("Education, previous companies, technical/industry experience"),
});
export type FounderProfile = z.infer<typeof founderProfileSchema>;

export const founderAnalysisSchema = z.object({
  founders: z.array(founderProfileSchema),
  relevantTeamExperience: z.array(z.string()),
  teamQuestions: z.array(z.string()),
  informationToVerify: z.array(z.string()),
});
export type FounderAnalysis = z.infer<typeof founderAnalysisSchema>;

// ---------------------------------------------------------------------------
// 9. Strategic Fit Engine
// ---------------------------------------------------------------------------

export const confidenceSchema = z.enum(["high", "medium", "low"]);
export type Confidence = z.infer<typeof confidenceSchema>;

export const strategicMatchSchema = z.object({
  companyOrIndustry: z.string(),
  rationale: z.string(),
  possibleCollaboration: z.string(),
  possiblePilotProject: z.string(),
  distributionOpportunity: z.string(),
  technologyIntegration: z.string(),
  geographicOpportunity: z.string(),
  confidence: confidenceSchema,
  confidenceReasoning: z.string(),
});
export type StrategicMatch = z.infer<typeof strategicMatchSchema>;

export const strategicFitSchema = z.object({
  matches: z.array(strategicMatchSchema),
});
export type StrategicFit = z.infer<typeof strategicFitSchema>;

// ---------------------------------------------------------------------------
// 10. Pegasus Strategic Fit
// ---------------------------------------------------------------------------

export const pegasusFitSchema = z.object({
  vcAsAServiceRationale: z.string(),
  enterprisePartnershipIdeas: z.array(z.string()),
  technologyPartnershipIdeas: z.array(z.string()),
  businessDevelopmentIdeas: z.array(z.string()),
  internationalExpansionIdeas: z.array(z.string()),
  corporatePilotIdeas: z.array(z.string()),
  distributionIdeas: z.array(z.string()),
  strategicInvestmentAngle: z.string(),
  disclaimer: z.string(),
});
export type PegasusFit = z.infer<typeof pegasusFitSchema>;

// ---------------------------------------------------------------------------
// 11. Japan Opportunity Engine
// ---------------------------------------------------------------------------

export const japanPhaseSchema = z.object({
  phase: z.number(),
  title: z.string(),
  description: z.string(),
});
export type JapanPhase = z.infer<typeof japanPhaseSchema>;

export const japanOpportunitySchema = z.object({
  couldEnterJapan: z.string(),
  beneficiaryIndustries: z.array(z.string()),
  potentialEnterpriseCustomers: z.array(z.string()),
  potentialStrategicPartners: z.array(z.string()),
  localizationRequirements: z.array(z.string()),
  regulatoryRequirements: z.array(z.string()),
  distributionConsiderations: z.string(),
  pricingConsiderations: z.string(),
  enterpriseSalesConsiderations: z.string(),
  languageConsiderations: z.string(),
  technologyIntegrationConsiderations: z.string(),
  localCompetition: z.array(z.string()),
  entryStrategy: z.array(japanPhaseSchema).length(5),
});
export type JapanOpportunity = z.infer<typeof japanOpportunitySchema>;

// ---------------------------------------------------------------------------
// 12. Devil's Advocate
// ---------------------------------------------------------------------------

export const devilsAdvocateSchema = z.object({
  reasonsThisCouldFail: z.array(z.string()).length(5),
  assumptionsThatMustBeTrue: z.array(z.string()),
  whatInvestorsMayBeMissing: z.array(z.string()),
  technologyRisk: z.string(),
  marketRisk: z.string(),
  competitionRisk: z.string(),
  executionRisk: z.string(),
  financingRisk: z.string(),
  customerRisk: z.string(),
  regulatoryRisk: z.string(),
  whatWouldMakeTheThesisWrong: z.string(),
});
export type DevilsAdvocate = z.infer<typeof devilsAdvocateSchema>;

// ---------------------------------------------------------------------------
// 13. Five Critical Questions
// ---------------------------------------------------------------------------

export const criticalQuestionsSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string(),
        whyItMatters: z.string(),
      })
    )
    .length(5),
});
export type CriticalQuestions = z.infer<typeof criticalQuestionsSchema>;

// ---------------------------------------------------------------------------
// 14. Founder Questions
// ---------------------------------------------------------------------------

export const founderQuestionsSchema = z.object({
  product: z.array(z.string()),
  market: z.array(z.string()),
  competition: z.array(z.string()),
  economics: z.array(z.string()),
  execution: z.array(z.string()),
});
export type FounderQuestions = z.infer<typeof founderQuestionsSchema>;

// ---------------------------------------------------------------------------
// 15. Next Diligence
// ---------------------------------------------------------------------------

export const diligencePrioritySchema = z.enum(["critical", "important", "useful"]);
export type DiligencePriority = z.infer<typeof diligencePrioritySchema>;

export const diligenceItemSchema = z.object({
  item: z.string(),
  priority: diligencePrioritySchema,
  reasoning: z.string(),
});
export type DiligenceItem = z.infer<typeof diligenceItemSchema>;

export const nextDiligenceSchema = z.object({
  items: z.array(diligenceItemSchema),
});
export type NextDiligence = z.infer<typeof nextDiligenceSchema>;

// ---------------------------------------------------------------------------
// 16. Investment Committee Memo
// ---------------------------------------------------------------------------

export const icMemoSchema = z.object({
  executiveSummary: z.string(),
  missingInformation: z.array(z.string()),
  sources: z.array(sourceSchema),
  generatedAt: z.string(),
});
export type ICMemo = z.infer<typeof icMemoSchema>;

// ---------------------------------------------------------------------------
// The full analysis object — one startup, fully researched
// ---------------------------------------------------------------------------

export const startupInputSchema = z.object({
  companyName: z.string().min(1),
  website: z.string().optional(),
  sector: z.string().optional(),
  country: z.string().optional(),
  fundingStage: z.string().optional(),
  description: z.string().optional(),
  additionalNotes: z.string().optional(),
});
export type StartupInput = z.infer<typeof startupInputSchema>;

// ---------------------------------------------------------------------------
// Ask Aaran First — Aaran's own answers, compared against the AI's findings
// ---------------------------------------------------------------------------

export const aaranAnswersSchema = z.object({
  risks: z.string().min(1),
  moat: z.string().min(1),
  founderQuestion: z.string().min(1),
});
export type AaranAnswers = z.infer<typeof aaranAnswersSchema>;

export const comparisonResultSchema = z.object({
  whereWeAgreed: z.array(z.string()),
  whatAIFoundThatAaranMissed: z.array(z.string()),
  whatAaranFoundThatAIMissed: z.array(z.string()),
});
export type ComparisonResult = z.infer<typeof comparisonResultSchema>;

export const fullAnalysisSchema = z.object({
  id: z.string(),
  input: startupInputSchema,
  isDemoData: z.boolean().default(false),
  createdAt: z.string(),
  snapshot: startupSnapshotSchema,
  market: marketIntelligenceSchema,
  product: productAnalysisSchema,
  businessModel: businessModelSchema,
  traction: tractionSchema,
  competitors: competitorMapSchema,
  moat: competitiveMoatSchema,
  founders: founderAnalysisSchema,
  strategicFit: strategicFitSchema,
  pegasusFit: pegasusFitSchema,
  japan: japanOpportunitySchema,
  devilsAdvocate: devilsAdvocateSchema,
  criticalQuestions: criticalQuestionsSchema,
  founderQuestions: founderQuestionsSchema,
  nextDiligence: nextDiligenceSchema,
  icMemo: icMemoSchema.optional(),
});
export type FullAnalysis = z.infer<typeof fullAnalysisSchema>;
