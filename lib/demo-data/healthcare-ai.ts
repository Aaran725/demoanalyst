import type { FullAnalysis } from "../ai/schemas";
import { fact, analysis, assumption, unknown } from "./helpers";

/**
 * DEMO DATA — Aveline Health
 * A fictional AI clinical-documentation startup. None of the facts,
 * figures, or people below are real.
 */
export const AVELINE_ANALYSIS: FullAnalysis = {
  id: "demo-aveline",
  isDemoData: true,
  createdAt: "2026-01-15T09:00:00.000Z",
  input: {
    companyName: "Aveline Health",
    website: "https://aveline-demo.example",
    sector: "Healthcare AI / Clinical Documentation",
    country: "United States",
    fundingStage: "Series A",
    description: "AI ambient scribe that listens to doctor-patient visits and drafts clinical notes automatically.",
  },
  snapshot: {
    companyName: "Aveline Health",
    website: "https://aveline-demo.example",
    headquarters: fact("Boston, Massachusetts, USA", [
      { label: "Company website (demo)", claimSupported: "HQ listed on About page" },
    ]),
    founded: fact("Founded 2021", [{ label: "Company website (demo)", claimSupported: "Founding year" }]),
    founders: ["Dr. Priya Nair", "Marcus Webb"],
    sector: "Healthcare AI / Clinical Documentation",
    stage: "Series A",
    fundingRaised: fact("$18M raised (Seed + Series A)", [
      { label: "Press release (demo)", claimSupported: "Series A round of $14M" },
    ]),
    employees: fact("~45 employees", [{ label: "LinkedIn company page (demo)", claimSupported: "Employee range" }]),
    problem: fact(
      "Physicians spend a large share of each visit typing notes instead of talking with patients, and take on additional documentation time after hours.",
      [{ label: "Company website (demo)", claimSupported: "Problem statement" }]
    ),
    solution: fact(
      "An ambient AI scribe that listens (with consent) to the visit and drafts a structured clinical note for physician review and sign-off.",
      [{ label: "Company website (demo)", claimSupported: "Product description" }]
    ),
    product: fact("A mobile/desktop app plus EHR integration that inserts the drafted note into the patient chart", [
      { label: "Company website (demo)", claimSupported: "Product page" },
    ]),
    customer: fact("Outpatient clinics and physician groups (10–200 providers)", [
      { label: "Case studies page (demo)", claimSupported: "Customer profile in case studies" },
    ]),
    businessModelSummary: fact("Per-provider monthly subscription", [
      { label: "Pricing page (demo)", claimSupported: "Subscription pricing" },
    ]),
    whyNow: analysis(
      "Speech recognition and large language model quality have recently crossed a threshold where drafting clinically usable notes with a human-in-the-loop review step is viable, which wasn't true a few years ago."
    ),
    tractionSummary: fact("Live in 3 physician groups covering ~120 providers, per company materials", [
      { label: "Press release (demo)", claimSupported: "Provider count at Series A" },
    ]),
    technology: fact("Speech-to-text plus a fine-tuned large language model for clinical note structuring", [
      { label: "Company website (demo)", claimSupported: "Technology page" },
    ]),
  },
  market: {
    category: "Clinical documentation / ambient AI scribes",
    tam: unknown("Reliable market-size data not verified."),
    sam: unknown("Reliable market-size data not verified."),
    som: unknown("Reliable market-size data not verified."),
    growthRate: analysis("Ambient scribe adoption has grown quickly across health systems, though a specific growth rate is not verified here."),
    marketDrivers: [
      analysis("Physician burnout tied to documentation burden is a well-documented industry concern"),
      analysis("Large language models have recently become good enough to draft usable clinical notes with review"),
    ],
    customerDemandSignals: [
      fact("3 physician group deployments covering ~120 providers", [
        { label: "Press release (demo)", claimSupported: "Provider count" },
      ]),
    ],
    technologyTrends: [analysis("Rapid improvement in medical-domain language model accuracy and hallucination reduction")],
    regulatoryEnvironment: analysis(
      "Subject to HIPAA (patient privacy) in the U.S.; clinical note AI is not currently FDA-regulated as a medical device in most current use cases, but this could change."
    ),
    geographicOpportunity: analysis("Currently U.S.-only; other countries have different EHR standards and privacy regimes."),
    whyNow:
      "Ambient scribe products only became clinically credible once language models could draft structured notes accurate enough for a physician to review quickly rather than rewrite — that bar has plausibly only recently been cleared.",
    whatCouldChangeThisMarket: [
      "EHR vendors (e.g., large incumbent platforms) building ambient scribing natively into their own products",
      "A high-profile documentation error incident causing regulatory scrutiny of AI-drafted clinical notes",
      "Reimbursement or liability rules shifting around AI-assisted documentation",
    ],
  },
  product: {
    uniqueAspects: [analysis("Focuses specifically on outpatient physician groups rather than hospital systems, a less-served segment")],
    technologyDifferentiation: unknown("No independently verified benchmark of note accuracy versus competing ambient scribes."),
    workflowDifferentiation: fact("Integrates directly into the EHR chart rather than requiring copy-paste, per case studies", [
      { label: "Case studies page (demo)", claimSupported: "EHR integration described" },
    ]),
    costAdvantage: unknown(),
    dataAdvantage: assumption("More visit transcripts over time could improve note-drafting accuracy, though this is not confirmed as a realized advantage yet."),
    distributionAdvantage: unknown(),
    customerExperience: fact("Physician review/edit step required before note is finalized, per product design", [
      { label: "Company website (demo)", claimSupported: "Review/sign-off step described" },
    ]),
    switchingCosts: analysis("Physicians who adapt their visit style to the tool face some retraining cost if switching to a competitor."),
    integrationAdvantage: unknown("Depth and breadth of EHR integrations across different EHR vendors is not verified."),
    whyCustomersMayChoose: [
      "Directly targets outpatient physician groups, a segment sometimes underserved by hospital-focused competitors",
      "Human review/sign-off step may reduce liability concern versus fully automated documentation",
    ],
    whyCustomersMayNotChoose: [
      "Large EHR vendors could bundle similar functionality at no extra cost",
      "Physicians skeptical of AI-drafted notes may resist adoption regardless of quality",
    ],
  },
  businessModel: {
    revenueModel: fact("Per-provider monthly subscription", [{ label: "Pricing page (demo)", claimSupported: "Subscription model" }]),
    pricingModel: fact("Flat per-provider fee across group sizes, per pricing page", [
      { label: "Pricing page (demo)", claimSupported: "Pricing structure" },
    ]),
    recurringRevenue: analysis("Subscription model implies recurring revenue; renewal data is not public."),
    grossMarginPotential: assumption("Likely high gross margin as a software product, though model-inference cost per note is a real cost input not disclosed."),
    customerAcquisition: unknown("CAC and sales cycle length not publicly disclosed."),
    salesCycle: assumption("Likely a multi-month sales cycle given healthcare procurement and compliance review requirements."),
    capitalIntensity: analysis("Software-based model is less capital-intensive than a hardware business, though inference costs at scale are non-trivial."),
    scalability: analysis("Software distribution scales well once EHR integrations are built, though each new EHR vendor may require new integration work."),
    customerConcentration: unknown("Revenue concentration across the 3 named physician groups is not disclosed."),
    expansionRevenue: unknown("No public data on within-account provider-count growth over time."),
    distribution: assumption("Appears to sell direct to physician groups rather than through an EHR marketplace or channel partner."),
    strengths: ["Recurring per-provider subscription revenue", "Software gross margins likely higher than hardware-dependent competitors"],
    risks: ["Inference cost per note could compress margins if not managed carefully", "Healthcare sales cycles are typically long and compliance-heavy"],
    openQuestions: ["What is the actual sales cycle length from first contact to signed contract?", "What is gross margin per provider after inference costs?"],
  },
  traction: {
    revenue: unknown("Not publicly verified."),
    arr: unknown("Not publicly verified."),
    growth: unknown("Not publicly verified."),
    customers: fact("3 physician groups", [{ label: "Press release (demo)", claimSupported: "Customer count" }]),
    users: fact("~120 providers using the product, per company materials", [
      { label: "Press release (demo)", claimSupported: "Provider count" },
    ]),
    retention: unknown("Not publicly verified."),
    partnerships: unknown("No confirmed EHR vendor partnerships found."),
    funding: fact("$18M total raised", [{ label: "Press release (demo)", claimSupported: "Cumulative funding" }]),
    productAdoption: fact("Live across 3 physician groups covering ~120 providers", [
      { label: "Press release (demo)", claimSupported: "Adoption figures" },
    ]),
    internationalExpansion: unknown("No evidence of operations outside the United States."),
    signals: ["Multiple physician groups live in production, not just pilots, per company materials"],
    openQuestions: ["What percentage of providers who try the tool continue using it after 90 days?", "Has any physician group churned or paused usage?"],
  },
  competitors: {
    competitors: [
      {
        name: "Hospital-focused ambient scribe incumbents (category)",
        category: "incumbent",
        product: "Ambient AI scribes sold primarily into large hospital systems",
        targetCustomer: "Large hospital systems and enterprise health networks",
        businessModel: "Enterprise contracts, often bundled with EHR vendor relationships",
        differentiation: "Established enterprise sales relationships and larger scale",
        fundingOrScale: "Category includes very well-funded, later-stage companies",
      },
      {
        name: "EHR-native dictation/documentation tools",
        category: "indirect",
        product: "Basic dictation and templated note tools built into major EHR platforms",
        targetCustomer: "Any provider using that EHR",
        businessModel: "Bundled into existing EHR license, little to no extra cost",
        differentiation: "Zero additional cost and no new vendor relationship, but generally less sophisticated drafting quality",
      },
      {
        name: "Emerging outpatient-focused scribe startups",
        category: "emerging",
        product: "Similar ambient scribe products targeting smaller physician groups",
        targetCustomer: "Small-to-mid outpatient practices",
        businessModel: "Per-provider subscription",
        differentiation: "Direct competitors in the same underserved segment",
      },
    ],
    whatMakesThisStartupDifferent: [
      "Explicit focus on outpatient physician groups rather than hospital enterprise deals",
      "Direct EHR chart integration rather than a copy-paste workflow, per case studies",
    ],
    whatCompetitorsCanCopy: [
      "The core ambient-scribe workflow is not proprietary to any one company",
      "Per-provider subscription pricing can be matched by competitors",
    ],
    whyCustomersMightSwitch: [
      "Better fit for smaller outpatient groups than hospital-focused incumbents",
      "Potentially faster onboarding for smaller practices",
    ],
    whyCustomersMightStayWithIncumbent: [
      "An EHR vendor's built-in dictation tool requires no new vendor relationship or procurement process",
      "A hospital system already invested in an enterprise incumbent's integration faces high switching cost",
    ],
  },
  moat: {
    factors: [
      { factor: "technology", strength: "weak_evidence", reasoning: "Ambient scribing relies on general-purpose speech and language models available to many competitors; no unique model advantage is confirmed." },
      { factor: "proprietary_data", strength: "some_evidence", reasoning: "Visit transcripts from live deployments could improve the note-drafting model over time, though the scale (3 customers) is still small." },
      { factor: "network_effects", strength: "weak_evidence", reasoning: "One physician group's usage does not directly improve the product for another group in a network-effect sense." },
      { factor: "distribution", strength: "weak_evidence", reasoning: "No confirmed distribution channel advantage; appears to sell direct." },
      { factor: "brand", strength: "weak_evidence", reasoning: "Early-stage company with limited public brand recognition in healthcare so far." },
      { factor: "intellectual_property", strength: "unknown", reasoning: "No patent filings were reviewed as part of this analysis." },
      { factor: "switching_costs", strength: "some_evidence", reasoning: "Physicians who adapt dictation style and EHR integration face moderate switching friction, though the underlying workflow could be replicated." },
      { factor: "economies_of_scale", strength: "some_evidence", reasoning: "Software gross margins should improve with scale, though inference cost per note is a real variable cost." },
      { factor: "regulatory_advantage", strength: "unknown", reasoning: "No specific regulatory approval or certification advantage identified; HIPAA compliance is table stakes, not a differentiator." },
      { factor: "customer_relationships", strength: "some_evidence", reasoning: "Deployments appear to be in full production (not pilots) across physician groups, suggesting real trust, though the sample is only 3 accounts." },
    ],
  },
  founders: {
    founders: [
      {
        name: "Dr. Priya Nair",
        role: "CEO & Co-founder",
        background: [
          fact("Practicing internal medicine physician prior to founding the company (per company bio, demo)", [
            { label: "Company About page (demo)", claimSupported: "Clinical background described in founder bio" },
          ]),
        ],
      },
      {
        name: "Marcus Webb",
        role: "CTO & Co-founder",
        background: [
          fact("Previously an engineer on a speech-recognition team at a large tech company (per company bio, demo)", [
            { label: "Company About page (demo)", claimSupported: "Prior technical role described in founder bio" },
          ]),
        ],
      },
    ],
    relevantTeamExperience: [
      "A practicing physician co-founder brings direct domain credibility with clinical customers",
      "Technical co-founder with speech-recognition background directly relevant to the core technology",
    ],
    teamQuestions: [
      "Does either founder have experience selling into healthcare enterprise procurement specifically, not just building the technology?",
      "How large is the clinical/medical advisory team supporting note-quality validation?",
    ],
    informationToVerify: [
      "Confirm Dr. Nair's clinical licensure and practice history independently",
      "Confirm Marcus Webb's prior employment and specific technical contributions",
    ],
  },
  strategicFit: {
    matches: [
      {
        companyOrIndustry: "Regional physician group networks / independent practice associations",
        rationale: "Directly matches the company's stated target customer profile",
        possibleCollaboration: "Network-wide rollout agreement across member practices",
        possiblePilotProject: "Pilot with a subset of member practices with a defined documentation-time-saved benchmark",
        distributionOpportunity: "Access to many independent practices through one network relationship",
        technologyIntegration: "Integration with the network's shared EHR platform, if standardized",
        geographicOpportunity: "Whichever region the network operates in",
        confidence: "medium",
        confidenceReasoning: "Strong logical fit with target customer, but no confirmed relationship with any specific network exists today.",
      },
      {
        companyOrIndustry: "Medical malpractice insurers",
        rationale: "Better documentation could plausibly reduce malpractice exposure, which insurers have a financial interest in",
        possibleCollaboration: "Insurer-subsidized adoption program for policyholder practices",
        possiblePilotProject: "Pilot measuring documentation completeness/quality before and after adoption",
        distributionOpportunity: "Access to the insurer's policyholder base of physician practices",
        technologyIntegration: "Minimal — this would be a distribution/incentive partnership, not a technical integration",
        geographicOpportunity: "Wherever the insurer has policyholders",
        confidence: "low",
        confidenceReasoning: "Plausible but speculative; no evidence any malpractice insurer has evaluated this specific link.",
      },
    ],
  },
  pegasusFit: {
    vcAsAServiceRationale:
      "A clinical documentation AI company could benefit from a strategic investor with relationships across health systems and physician networks that could become reference customers.",
    enterprisePartnershipIdeas: ["Introductions to physician group networks or independent practice associations as pilot customers"],
    technologyPartnershipIdeas: ["Connections to speech-recognition or medical language model research groups"],
    businessDevelopmentIdeas: ["Support structuring pilot programs with measurable ROI benchmarks for healthcare buyers"],
    internationalExpansionIdeas: ["Introductions to healthcare systems in markets with similar physician documentation burden concerns"],
    corporatePilotIdeas: ["A structured pilot with a named physician network measuring documentation time saved"],
    distributionIdeas: ["Co-marketing with an EHR vendor or healthcare IT distributor"],
    strategicInvestmentAngle:
      "A strategic investment paired with healthcare network access could accelerate the multi-month sales cycles that are typical in this space.",
    disclaimer: "Potential fit based on industry characteristics — not a confirmed Pegasus relationship.",
  },
  japan: {
    couldEnterJapan:
      "Uncertain — Japan's EHR landscape, physician documentation norms, and language requirements differ substantially from the U.S., so this would require significant localization before any entry.",
    beneficiaryIndustries: ["Outpatient clinics", "Physician group practices"],
    potentialEnterpriseCustomers: ["Japanese physician group networks or hospital-affiliated outpatient clinics"],
    potentialStrategicPartners: ["Japanese EHR/health-IT vendors"],
    localizationRequirements: [
      "Full Japanese-language speech recognition and clinical note generation, not just UI translation",
      "Adaptation to Japanese clinical documentation conventions and formats",
    ],
    regulatoryRequirements: ["Compliance with Japanese patient privacy law (APPI) and any healthcare-data-specific rules"],
    distributionConsiderations: "Would likely require a local health-IT partner given the specialized, compliance-heavy nature of healthcare sales in Japan.",
    pricingConsiderations: "Per-provider subscription pricing would need to reflect local healthcare reimbursement and practice economics.",
    enterpriseSalesConsiderations: "Japanese healthcare procurement often involves longer, consensus-driven decision-making than U.S. practices.",
    languageConsiderations: "The core AI model would need to be retrained or adapted for Japanese medical speech and terminology — a substantial technical undertaking, not just translation.",
    technologyIntegrationConsiderations: "Would need integration with Japanese EHR systems, which differ from U.S. EHR standards.",
    localCompetition: ["Japanese health-IT vendors and any existing local ambient-documentation products"],
    entryStrategy: [
      { phase: 1, title: "Market Validation", description: "Assess Japanese physician documentation burden and existing health-IT vendor landscape before committing engineering resources to localization." },
      { phase: 2, title: "Pilot", description: "Partner with a local health-IT firm to pilot a Japanese-language version with a small physician group." },
      { phase: 3, title: "Strategic Partner", description: "Formalize a relationship with a Japanese EHR vendor or health-IT distributor." },
      { phase: 4, title: "Enterprise Deployment", description: "Expand within the partner's network to additional physician groups or a hospital-affiliated clinic network." },
      { phase: 5, title: "Scale", description: "Broaden across Japan using the local partner's distribution and support infrastructure." },
    ],
  },
  devilsAdvocate: {
    reasonsThisCouldFail: [
      "A major EHR vendor could bundle equivalent ambient scribing into its platform at no extra cost, removing the reason to buy a standalone product",
      "Physician trust in AI-drafted notes could be slower to build than assumed, especially after any high-profile documentation error in the industry",
      "Model inference costs per note could compress gross margins more than expected as usage scales",
      "With only 3 customers, the company's traction narrative rests on a very small, potentially non-representative sample",
      "Healthcare enterprise sales cycles could be longer than the company's current funding runway assumes",
    ],
    assumptionsThatMustBeTrue: [
      "Physicians will trust and adopt AI-drafted notes at scale, not just in early pilot settings",
      "EHR vendors do not successfully bundle equivalent functionality for free",
      "Model accuracy remains high enough across diverse specialties and accents/dialects to avoid costly correction time",
    ],
    whatInvestorsMayBeMissing: [
      "Whether the 3 current customers are unusually favorable/early-adopter accounts rather than representative of the broader market",
      "The real inference cost per note and how it scales, which determines true gross margin",
    ],
    technologyRisk: "Clinical note accuracy across diverse medical specialties, accents, and visit types is not independently benchmarked here.",
    marketRisk: "Large EHR incumbents entering with a bundled free alternative would remove much of the reason to buy a standalone tool.",
    competitionRisk: "Multiple well-funded competitors already target the hospital segment and could move downmarket into outpatient groups.",
    executionRisk: "Scaling EHR integrations across many different EHR vendors used by outpatient practices is operationally complex.",
    financingRisk: "Healthcare enterprise sales cycles are long; the company needs enough runway to reach scale before the next fundraise.",
    customerRisk: "A 3-customer base means losing even one materially changes the traction story.",
    regulatoryRisk: "If AI-drafted clinical notes come under stricter regulatory scrutiny (e.g., treated more like a medical device), compliance costs could rise sharply.",
    whatWouldMakeTheThesisWrong:
      "If a major EHR platform ships a 'good enough' ambient scribing feature built into its existing product at no extra charge, the standalone value proposition for physician groups largely disappears, regardless of Aveline's note-quality edge.",
  },
  criticalQuestions: {
    questions: [
      { question: "What percentage of providers who start a free trial convert to paid, and what percentage remain active after 90 days?", whyItMatters: "Tests whether early enthusiasm translates into durable usage." },
      { question: "What is the actual model inference cost per note, and how does that affect gross margin at scale?", whyItMatters: "Determines whether this behaves like a high-margin software business or something thinner." },
      { question: "Has any of the 3 current physician groups signaled they might not renew?", whyItMatters: "With such a small customer base, any single loss is material." },
      { question: "What specific technical or workflow barrier prevents a major EHR vendor from shipping a similar feature natively?", whyItMatters: "This is the single biggest threat to the standalone product's reason to exist." },
      { question: "What is the average sales-cycle length from first contact to signed contract with a new physician group?", whyItMatters: "Determines how fast the company can realistically grow given its funding runway." },
    ],
  },
  founderQuestions: {
    product: ["What specific clinical specialties or visit types does the model currently struggle with?"],
    market: ["Why would a physician group choose you over a free feature bundled into their existing EHR?"],
    competition: ["How do you plan to compete with better-funded hospital-focused ambient scribe companies moving downmarket?"],
    economics: ["What is your fully-loaded cost (including model inference) to serve one provider per month?"],
    execution: ["What is your current sales cycle length, and how many physician groups are in active evaluation right now?"],
  },
  nextDiligence: {
    items: [
      { item: "Customer reference calls with all 3 physician groups, including any that reduced usage", priority: "critical", reasoning: "Small sample size makes each account's experience highly material." },
      { item: "Independent review of note accuracy across multiple medical specialties", priority: "critical", reasoning: "Core product claim underlying the whole business." },
      { item: "Financial review of inference cost per note and resulting gross margin", priority: "critical", reasoning: "Determines whether unit economics scale favorably." },
      { item: "Competitive teardown of at least one EHR-native documentation feature", priority: "important", reasoning: "Tests the single biggest risk to the standalone product's value proposition." },
      { item: "Regulatory review of current and potential future classification of AI-drafted clinical notes", priority: "important", reasoning: "A regulatory shift could materially change compliance costs." },
      { item: "Founder reference checks on clinical and technical backgrounds", priority: "useful", reasoning: "Validates credentials described in company materials." },
    ],
  },
  icMemo: {
    executiveSummary:
      "Aveline Health sells an ambient AI scribe to outpatient physician groups, live across 3 customers covering roughly 120 providers, having raised $18M through Series A. The company's stated edge is a focus on the outpatient segment and direct EHR chart integration. The most material open risk is competitive: large EHR vendors bundling similar functionality for free could remove the reason to buy a standalone product, and the current customer base is too small to assess durability of retention.",
    missingInformation: [
      "Provider-level retention/usage after 90 days",
      "Inference cost per note and resulting gross margin",
      "Sales cycle length and pipeline of physician groups in evaluation",
      "Independent accuracy benchmark across specialties",
    ],
    sources: [
      { label: "Company website (demo)", claimSupported: "Product, pricing, and team background" },
      { label: "Press release (demo)", claimSupported: "Funding and provider/customer counts" },
      { label: "Case studies page (demo)", claimSupported: "EHR integration and customer profile" },
    ],
    generatedAt: "2026-01-15T09:05:00.000Z",
  },
};
