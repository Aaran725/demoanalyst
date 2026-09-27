import type { FullAnalysis } from "../ai/schemas";
import { fact, analysis, assumption, unknown } from "./helpers";

/**
 * DEMO DATA — Ledgerline AI
 * A fictional enterprise AI-agent startup for finance/procurement back-office
 * workflows. None of the facts, figures, or people below are real.
 */
export const LEDGERLINE_ANALYSIS: FullAnalysis = {
  id: "demo-ledgerline",
  isDemoData: true,
  createdAt: "2026-01-15T09:00:00.000Z",
  input: {
    companyName: "Ledgerline AI",
    website: "https://ledgerline-demo.example",
    sector: "Enterprise AI Agents / Finance Automation",
    country: "United States",
    fundingStage: "Series A",
    description: "AI agents that handle invoice processing, three-way matching, and procurement approvals for mid-market finance teams.",
  },
  snapshot: {
    companyName: "Ledgerline AI",
    website: "https://ledgerline-demo.example",
    headquarters: fact("New York, New York, USA", [
      { label: "Company website (demo)", claimSupported: "HQ listed on About page" },
    ]),
    founded: fact("Founded 2022", [{ label: "Company website (demo)", claimSupported: "Founding year" }]),
    founders: ["Sofia Reyes", "Tom Yamada"],
    sector: "Enterprise AI Agents / Finance Automation",
    stage: "Series A",
    fundingRaised: fact("$22M raised (Seed + Series A)", [
      { label: "Press release (demo)", claimSupported: "Series A round of $17M" },
    ]),
    employees: fact("~38 employees", [{ label: "LinkedIn company page (demo)", claimSupported: "Employee range" }]),
    problem: fact(
      "Mid-market finance teams manually process invoices and reconcile purchase orders, a slow and error-prone workflow that scales poorly with transaction volume.",
      [{ label: "Company website (demo)", claimSupported: "Problem statement" }]
    ),
    solution: fact(
      "An AI agent that reads incoming invoices, matches them against purchase orders and receipts (three-way match), flags discrepancies, and routes approvals — with a human review step for exceptions.",
      [{ label: "Company website (demo)", claimSupported: "Product description" }]
    ),
    product: fact("A software platform that plugs into existing ERP/accounting systems and runs the matching/approval workflow", [
      { label: "Company website (demo)", claimSupported: "Product page" },
    ]),
    customer: fact("Mid-market companies ($50M–$1B revenue) with finance/procurement teams of 5–50 people", [
      { label: "Case studies page (demo)", claimSupported: "Customer profile in case studies" },
    ]),
    businessModelSummary: fact("Per-seat plus usage-based pricing (priced per invoice processed above a base tier)", [
      { label: "Pricing page (demo)", claimSupported: "Pricing structure" },
    ]),
    whyNow: analysis(
      "Large language models have recently become reliable enough to read unstructured invoice documents and make matching judgment calls that previously required rules-based systems or manual review, lowering the cost of automating this workflow."
    ),
    tractionSummary: fact("Deployed at 22 mid-market customers, per company materials at Series A", [
      { label: "Press release (demo)", claimSupported: "Customer count at Series A" },
    ]),
    technology: fact("Document understanding (OCR + LLM extraction) plus an agent framework for multi-step approval workflows", [
      { label: "Company website (demo)", claimSupported: "Technology page" },
    ]),
  },
  market: {
    category: "Finance process automation / AI agents for back-office workflows",
    tam: unknown("Reliable market-size data not verified."),
    sam: unknown("Reliable market-size data not verified."),
    som: unknown("Reliable market-size data not verified."),
    growthRate: analysis("Enterprise interest in AI agents for back-office automation has grown quickly, though a specific growth rate is not verified here."),
    marketDrivers: [
      analysis("Finance teams are under pressure to do more with the same or smaller headcount"),
      analysis("LLM-based document understanding has recently become accurate enough for financial documents specifically"),
    ],
    customerDemandSignals: [
      fact("22 customers at Series A, per company materials", [{ label: "Press release (demo)", claimSupported: "Customer count" }]),
    ],
    technologyTrends: [analysis("Growing enterprise adoption of 'AI agent' products that take multi-step actions rather than just answering questions")],
    regulatoryEnvironment: analysis("Financial controls and audit requirements (e.g., SOX for public companies) mean any automation must preserve auditability."),
    geographicOpportunity: analysis("Currently U.S.-only; ERP and accounting standards vary meaningfully by country."),
    whyNow:
      "Invoice and purchase-order matching involves reading messy, unstructured documents and making judgment calls on discrepancies — a task that only recently became reliable enough for LLM-based agents to handle with a human-in-the-loop exception process.",
    whatCouldChangeThisMarket: [
      "A major ERP vendor (e.g., a large accounting platform) building equivalent AI matching natively",
      "A well-publicized AI approval error causing enterprises to pull back from agentic finance automation",
      "Consolidation among finance automation point-solutions into broader platforms",
    ],
  },
  product: {
    uniqueAspects: [analysis("Focuses specifically on the three-way match and approval workflow rather than broader 'AI agent platform' claims")],
    technologyDifferentiation: unknown("No independently verified accuracy benchmark versus competing invoice-automation tools."),
    workflowDifferentiation: fact("Plugs into existing ERP systems rather than requiring a data migration, per case studies", [
      { label: "Case studies page (demo)", claimSupported: "Integration approach described" },
    ]),
    costAdvantage: unknown(),
    dataAdvantage: assumption("More processed invoices over time could improve matching/exception-detection accuracy, though this is not confirmed as material yet."),
    distributionAdvantage: unknown(),
    customerExperience: fact("Exceptions are routed to a human reviewer rather than auto-approved, per product design", [
      { label: "Company website (demo)", claimSupported: "Human-in-the-loop exception handling described" },
    ]),
    switchingCosts: analysis("Once integrated with a company's ERP and approval chain, switching requires re-configuring matching rules and retraining finance staff."),
    integrationAdvantage: unknown("Breadth of ERP integrations across different vendors is not verified."),
    whyCustomersMayChoose: [
      "No data migration required — integrates with existing ERP/accounting systems",
      "Human-in-the-loop exception handling may reduce risk concern versus a fully automated black box",
    ],
    whyCustomersMayNotChoose: [
      "Their existing ERP vendor could add similar matching functionality at no extra cost",
      "Finance teams may be cautious about giving an AI agent approval-adjacent authority at all",
    ],
  },
  businessModel: {
    revenueModel: fact("Per-seat plus usage-based pricing (per invoice above a base tier)", [{ label: "Pricing page (demo)", claimSupported: "Pricing model" }]),
    pricingModel: fact("Tiered base fee plus per-invoice overage pricing", [{ label: "Pricing page (demo)", claimSupported: "Tiering structure" }]),
    recurringRevenue: analysis("Subscription-plus-usage model implies recurring revenue with some volume-linked upside; renewal data is not public."),
    grossMarginPotential: assumption("Likely high gross margin as a software product, though document-processing/inference cost per invoice is a real cost input not disclosed."),
    customerAcquisition: unknown("CAC and sales cycle length not publicly disclosed."),
    salesCycle: assumption("Likely a multi-month sales cycle given finance-system integration and approval-chain changes involved."),
    capitalIntensity: analysis("Software-based model is not capital-intensive in the way hardware businesses are; inference cost scales with invoice volume."),
    scalability: analysis("Usage-based pricing means revenue scales with customer transaction volume, which is a helpful expansion dynamic if retained."),
    customerConcentration: unknown("Revenue concentration across the 22 named customers is not disclosed."),
    expansionRevenue: assumption("Usage-based pricing suggests natural expansion revenue as customers process more invoices, though this isn't confirmed with real data."),
    distribution: assumption("Appears to sell direct to mid-market finance teams rather than through an ERP marketplace or channel partner."),
    strengths: ["Usage-based pricing creates a natural expansion-revenue mechanism as customer invoice volume grows", "Software gross margins likely higher than hardware-dependent competitors"],
    risks: ["Document-processing/inference cost per invoice could compress margins if not managed carefully", "Finance/procurement buyers are typically risk-averse about automation touching approvals"],
    openQuestions: ["What is net revenue retention (expansion minus churn) across the existing 22 customers?", "What is gross margin per invoice processed after inference costs?"],
  },
  traction: {
    revenue: unknown("Not publicly verified."),
    arr: unknown("Not publicly verified."),
    growth: unknown("Not publicly verified."),
    customers: fact("22 mid-market customers", [{ label: "Press release (demo)", claimSupported: "Customer count" }]),
    users: unknown("Not publicly disclosed."),
    retention: unknown("Not publicly verified."),
    partnerships: unknown("No confirmed ERP vendor partnerships found."),
    funding: fact("$22M total raised", [{ label: "Press release (demo)", claimSupported: "Cumulative funding" }]),
    productAdoption: fact("Deployed at 22 mid-market customers, per company materials", [
      { label: "Press release (demo)", claimSupported: "Deployment count" },
    ]),
    internationalExpansion: unknown("No evidence of operations outside the United States."),
    signals: ["22 customers in production (not just pilots) at Series A stage, per company materials"],
    openQuestions: ["What is the invoice-volume growth rate within existing customers?", "Has any customer churned or reduced usage since onboarding?"],
  },
  competitors: {
    competitors: [
      {
        name: "Established AP (accounts payable) automation incumbents (category)",
        category: "incumbent",
        product: "Rules-based invoice processing and approval workflow software",
        targetCustomer: "Mid-market to enterprise finance teams",
        businessModel: "Per-seat or per-invoice enterprise licensing",
        differentiation: "Established install base and long track record, though often less flexible with unstructured documents",
        fundingOrScale: "Category includes large, established public and private companies",
      },
      {
        name: "General-purpose AI agent platforms",
        category: "indirect",
        product: "Configurable AI agent tooling that could be built into a custom invoice-matching workflow",
        targetCustomer: "Companies with in-house engineering resources to build custom workflows",
        businessModel: "Platform/API usage fees",
        differentiation: "More flexible but requires significant in-house engineering investment to replicate a finished product",
      },
      {
        name: "Emerging finance-agent startups",
        category: "emerging",
        product: "Similar AI-agent invoice/procurement automation targeting mid-market finance teams",
        targetCustomer: "Mid-market finance/procurement teams",
        businessModel: "Per-seat plus usage-based pricing",
        differentiation: "Direct competitors in the same emerging category",
      },
    ],
    whatMakesThisStartupDifferent: [
      "Focused specifically on the three-way match and approval workflow rather than a broad, generic agent platform",
      "No ERP data migration required to deploy, per case studies",
    ],
    whatCompetitorsCanCopy: [
      "The core LLM-based document understanding approach is not proprietary to any one company",
      "Usage-based pricing can be matched by competitors",
    ],
    whyCustomersMightSwitch: [
      "Handles unstructured/messy invoices more flexibly than older rules-based incumbents, per case studies",
      "Faster deployment without a data migration",
    ],
    whyCustomersMightStayWithIncumbent: [
      "An incumbent AP system already integrated into the company's finance controls and audit process carries real switching cost",
      "Finance teams may be cautious about replacing a system with a long compliance track record",
    ],
  },
  moat: {
    factors: [
      { factor: "technology", strength: "weak_evidence", reasoning: "Document understanding relies on general-purpose LLM and OCR capabilities available to many competitors; no unique model advantage is confirmed." },
      { factor: "proprietary_data", strength: "some_evidence", reasoning: "Processed invoices across 22 customers could improve exception-detection accuracy over time, though the scale is still moderate." },
      { factor: "network_effects", strength: "weak_evidence", reasoning: "One customer's usage does not directly improve the product for another customer in a network-effect sense." },
      { factor: "distribution", strength: "weak_evidence", reasoning: "No confirmed distribution channel advantage; appears to sell direct." },
      { factor: "brand", strength: "weak_evidence", reasoning: "Early-stage company with limited public brand recognition in finance software so far." },
      { factor: "intellectual_property", strength: "unknown", reasoning: "No patent filings were reviewed as part of this analysis." },
      { factor: "switching_costs", strength: "some_evidence", reasoning: "Once integrated with ERP and approval chains, switching requires reconfiguring matching rules and retraining finance staff." },
      { factor: "economies_of_scale", strength: "some_evidence", reasoning: "Software gross margins should improve with scale, though document-processing cost per invoice is a real variable cost." },
      { factor: "regulatory_advantage", strength: "unknown", reasoning: "No specific regulatory approval or certification advantage identified; audit-trail compliance is table stakes, not a differentiator." },
      { factor: "customer_relationships", strength: "some_evidence", reasoning: "22 customers in production suggests real trust, though retention/expansion data is not public." },
    ],
  },
  founders: {
    founders: [
      {
        name: "Sofia Reyes",
        role: "CEO & Co-founder",
        background: [
          fact("Previously led finance operations at a mid-market software company (per company bio, demo)", [
            { label: "Company About page (demo)", claimSupported: "Prior finance operations role described in founder bio" },
          ]),
        ],
      },
      {
        name: "Tom Yamada",
        role: "CTO & Co-founder",
        background: [
          fact("Previously an engineer on a document-AI team at a large tech company (per company bio, demo)", [
            { label: "Company About page (demo)", claimSupported: "Prior technical role described in founder bio" },
          ]),
        ],
      },
    ],
    relevantTeamExperience: [
      "A founder with direct finance-operations experience brings real domain credibility with buyers",
      "Technical co-founder with document-AI background directly relevant to the core technology",
    ],
    teamQuestions: [
      "Does either founder have experience selling enterprise software into finance/procurement departments specifically?",
      "How large is the team responsible for validating matching accuracy and handling model errors?",
    ],
    informationToVerify: [
      "Confirm Sofia Reyes's prior finance operations role and scope independently",
      "Confirm Tom Yamada's prior employment and specific technical contributions",
    ],
  },
  strategicFit: {
    matches: [
      {
        companyOrIndustry: "Mid-market ERP and accounting software vendors",
        rationale: "An ERP vendor could offer this as an add-on to its existing customer base rather than building it natively",
        possibleCollaboration: "Marketplace listing or embedded integration within the ERP vendor's app ecosystem",
        possiblePilotProject: "Joint pilot with a shared customer to validate the integration and matching accuracy",
        distributionOpportunity: "Access to the ERP vendor's existing mid-market customer base",
        technologyIntegration: "Deeper native integration with the ERP's data model and approval workflows",
        geographicOpportunity: "Whichever markets the ERP vendor already serves",
        confidence: "medium",
        confidenceReasoning: "Strong logical fit as a complement rather than competitor to ERP vendors, but no confirmed partnership exists today.",
      },
      {
        companyOrIndustry: "Business process outsourcing (BPO) firms handling finance/accounting operations",
        rationale: "BPOs performing manual invoice processing for clients could use this to increase their own margins",
        possibleCollaboration: "White-label or co-branded offering for the BPO's finance-operations clients",
        possiblePilotProject: "Pilot automating a subset of one BPO client's invoice volume",
        distributionOpportunity: "Access to the BPO's existing client base across many mid-market companies",
        technologyIntegration: "Integration with whatever systems the BPO already uses to manage client finance operations",
        geographicOpportunity: "Wherever the BPO operates",
        confidence: "low",
        confidenceReasoning: "Plausible but speculative — no evidence this type of partnership has been discussed or piloted.",
      },
    ],
  },
  pegasusFit: {
    vcAsAServiceRationale:
      "An enterprise AI-agent company for finance workflows could benefit from a strategic investor with relationships across mid-market companies and ERP ecosystems that could become customers or distribution partners.",
    enterprisePartnershipIdeas: ["Introductions to mid-market companies with finance teams matching the target customer profile"],
    technologyPartnershipIdeas: ["Connections to document-AI or OCR technology providers to strengthen the extraction pipeline"],
    businessDevelopmentIdeas: ["Support structuring ERP marketplace or embedded-integration partnerships"],
    internationalExpansionIdeas: ["Introductions to mid-market companies in other regions with similar finance-automation needs"],
    corporatePilotIdeas: ["A structured pilot with a named mid-market company measuring invoice-processing time saved"],
    distributionIdeas: ["Co-selling through an ERP vendor's partner/marketplace channel"],
    strategicInvestmentAngle:
      "A strategic investment paired with ERP ecosystem access could accelerate distribution in a market where integration depth matters a great deal to buyers.",
    disclaimer: "Potential fit based on industry characteristics — not a confirmed Pegasus relationship.",
  },
  japan: {
    couldEnterJapan:
      "Uncertain — Japan's accounting and ERP conventions, invoicing standards (including its qualified invoice system), and language requirements differ substantially from the U.S., so this would require significant localization before entry.",
    beneficiaryIndustries: ["Mid-market manufacturing and trading companies", "Finance/accounting shared-service centers"],
    potentialEnterpriseCustomers: ["Japanese mid-market companies with finance/procurement teams of comparable size to the U.S. target profile"],
    potentialStrategicPartners: ["Japanese ERP and accounting software vendors"],
    localizationRequirements: [
      "Support for Japanese invoice formats and the national qualified invoice system",
      "Japanese-language document extraction and user interface",
    ],
    regulatoryRequirements: ["Compliance with Japanese tax and invoicing regulations specific to the qualified invoice system"],
    distributionConsiderations: "Would likely require a local ERP or systems-integrator partner given the specialized, integration-heavy nature of finance software sales in Japan.",
    pricingConsiderations: "Usage-based pricing would need to reflect local invoice volume and processing norms, which may differ from U.S. patterns.",
    enterpriseSalesConsiderations: "Japanese enterprise procurement often involves longer, consensus-driven decision-making than U.S. mid-market sales.",
    languageConsiderations: "Document extraction would need to be retrained for Japanese-language invoices and business documents, not just UI translation.",
    technologyIntegrationConsiderations: "Would need integration with Japanese ERP systems, which differ from U.S.-standard platforms.",
    localCompetition: ["Japanese finance-automation vendors already serving the qualified invoice system requirements"],
    entryStrategy: [
      { phase: 1, title: "Market Validation", description: "Research Japanese mid-market finance-automation needs and the qualified invoice system's implications before committing engineering resources." },
      { phase: 2, title: "Pilot", description: "Partner with a local systems integrator to pilot a Japanese-language version with one mid-market company." },
      { phase: 3, title: "Strategic Partner", description: "Formalize a relationship with a Japanese ERP vendor or systems integrator for local sales and support." },
      { phase: 4, title: "Enterprise Deployment", description: "Expand within the partner's customer network to additional mid-market finance teams." },
      { phase: 5, title: "Scale", description: "Broaden across Japan using the local partner's distribution and support infrastructure." },
    ],
  },
  devilsAdvocate: {
    reasonsThisCouldFail: [
      "A major ERP vendor could bundle equivalent AI matching into its existing platform at no extra cost, removing the reason to buy a standalone product",
      "Finance teams may be more risk-averse about AI touching approval workflows than the company's current 22-customer base suggests",
      "Document-processing/inference cost per invoice could compress margins more than expected as usage scales",
      "With 22 customers but no disclosed concentration data, revenue could be dependent on a small number of large accounts",
      "A high-profile AI-driven approval error at any company in this category could trigger broad enterprise caution across the whole space",
    ],
    assumptionsThatMustBeTrue: [
      "Finance teams continue to trust AI agents with approval-adjacent workflows as usage scales beyond early adopters",
      "ERP vendors do not successfully bundle equivalent matching functionality for free",
      "Matching accuracy remains high enough across diverse invoice formats and vendors to avoid costly manual correction",
    ],
    whatInvestorsMayBeMissing: [
      "Whether the 22 current customers are unusually favorable/early-adopter accounts rather than representative of the broader mid-market",
      "The real inference/document-processing cost per invoice and how it scales, which determines true gross margin",
    ],
    technologyRisk: "Matching accuracy across highly varied invoice formats and vendor documents is not independently benchmarked here.",
    marketRisk: "Large ERP incumbents entering with a bundled free alternative would remove much of the reason to buy a standalone tool.",
    competitionRisk: "Multiple categories of competitors — established incumbents, general AI agent platforms, and emerging direct competitors — all target overlapping ground.",
    executionRisk: "Integrating reliably across many different ERP systems used by mid-market companies is operationally complex.",
    financingRisk: "Enterprise finance sales cycles are long; the company needs enough runway to reach scale before the next fundraise.",
    customerRisk: "Revenue concentration across the 22-customer base is undisclosed and could be material.",
    regulatoryRisk: "Financial controls and audit requirements could tighten around AI-assisted approval workflows, raising compliance costs.",
    whatWouldMakeTheThesisWrong:
      "If a major ERP platform ships 'good enough' AI-based invoice matching built into its existing product at no extra charge, the standalone value proposition for mid-market finance teams largely disappears, regardless of Ledgerline's current accuracy edge.",
  },
  criticalQuestions: {
    questions: [
      { question: "What percentage of current revenue comes from the largest 3 customers?", whyItMatters: "Undisclosed concentration risk could be severe with a 22-customer base." },
      { question: "What is the actual document-processing/inference cost per invoice, and how does that affect gross margin at scale?", whyItMatters: "Determines whether this behaves like a high-margin software business or something thinner." },
      { question: "What is the matching accuracy rate across different invoice formats and vendors, independently measured?", whyItMatters: "Case studies describe capability, but the addressable format range is unverified." },
      { question: "Has any customer paused, reduced usage, or failed to renew since onboarding?", whyItMatters: "Public information shows deployment count but says nothing about churn." },
      { question: "What specific integration or workflow depth prevents a major ERP vendor from shipping similar matching functionality natively?", whyItMatters: "This is the single biggest threat to the standalone product's reason to exist." },
    ],
  },
  founderQuestions: {
    product: ["What invoice formats or vendor document types cause the matching agent to fail or require human intervention today?"],
    market: ["Why would a finance team choose you over a feature bundled into their existing ERP?"],
    competition: ["How do you plan to compete if a well-funded general AI agent platform builds a similar finance-specific workflow?"],
    economics: ["What is your fully-loaded cost to process one invoice, including model inference and human review time?"],
    execution: ["What is your current sales cycle length, and how many mid-market companies are in active evaluation right now?"],
  },
  nextDiligence: {
    items: [
      { item: "Customer reference calls with a representative sample of the 22 customers, including any with reduced usage", priority: "critical", reasoning: "Tests concentration risk, renewal likelihood, and real-world accuracy." },
      { item: "Independent review of matching accuracy across invoice formats and vendors", priority: "critical", reasoning: "Core technical claim underlying the whole business case." },
      { item: "Financial review of gross margin per invoice and revenue concentration", priority: "critical", reasoning: "Determines whether the model scales like high-margin software." },
      { item: "Competitive teardown of at least one ERP-native invoice-matching feature", priority: "important", reasoning: "Tests durability of the core differentiation claim." },
      { item: "Founder reference checks on prior finance-operations and technical leadership roles", priority: "important", reasoning: "Validates background claims in founder bios." },
      { item: "Security/compliance review of how the agent handles approval authority and audit trails", priority: "useful", reasoning: "Relevant given the sensitivity of finance approval workflows." },
    ],
  },
  icMemo: {
    executiveSummary:
      "Ledgerline AI sells an AI agent that automates invoice-to-purchase-order matching and approval routing for mid-market finance teams, deployed at 22 customers after raising $22M through Series A. The company's stated edge is deep ERP integration without data migration and a human-in-the-loop exception process. The most material open risks are competitive (an ERP vendor bundling similar functionality for free) and undisclosed customer concentration across the 22-account base.",
    missingInformation: [
      "Revenue concentration across the customer base",
      "Document-processing cost per invoice and resulting gross margin",
      "Customer renewal / churn history",
      "Independently verified matching accuracy across invoice formats",
    ],
    sources: [
      { label: "Company website (demo)", claimSupported: "Product, pricing, and team background" },
      { label: "Press release (demo)", claimSupported: "Funding and customer/deployment counts" },
      { label: "Case studies page (demo)", claimSupported: "Integration approach and customer profile" },
    ],
    generatedAt: "2026-01-15T09:05:00.000Z",
  },
};
