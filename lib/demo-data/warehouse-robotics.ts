import type { FullAnalysis } from "../ai/schemas";
import { fact, analysis, assumption, unknown } from "./helpers";

/**
 * DEMO DATA — Cargofox Robotics
 * A fictional AI warehouse robotics company, written to look and read like
 * a real analysis. Used when DEMO_MODE=true or when live AI is unavailable.
 * None of the facts, figures, or people below are real.
 */
export const CARGOFOX_ANALYSIS: FullAnalysis = {
  id: "demo-cargofox",
  isDemoData: true,
  createdAt: "2026-01-15T09:00:00.000Z",
  input: {
    companyName: "Cargofox Robotics",
    website: "https://cargofox-demo.example",
    sector: "Warehouse & Logistics Robotics",
    country: "United States",
    fundingStage: "Series B",
    description:
      "Autonomous mobile robots and robotic picking arms for third-party logistics (3PL) warehouses.",
  },
  snapshot: {
    companyName: "Cargofox Robotics",
    website: "https://cargofox-demo.example",
    headquarters: fact("Austin, Texas, USA", [
      { label: "Company website (demo)", claimSupported: "HQ address listed on About page" },
    ]),
    founded: fact("Founded 2019", [
      { label: "Company website (demo)", claimSupported: "Founding year stated on About page" },
    ]),
    founders: ["Elena Marsh", "Dev Patel"],
    sector: "Warehouse & Logistics Robotics",
    stage: "Series B",
    fundingRaised: fact("$64M raised across Seed, Series A, and Series B", [
      { label: "Press release (demo)", claimSupported: "Series B announcement, $42M round" },
    ]),
    employees: fact("~180 employees", [
      { label: "LinkedIn company page (demo)", claimSupported: "Employee count range" },
    ]),
    problem: fact(
      "3PL warehouses face chronic labor shortages and rising wage costs for repetitive picking and transport tasks.",
      [{ label: "Company website (demo)", claimSupported: "Problem statement on homepage" }]
    ),
    solution: fact(
      "A fleet of autonomous mobile robots (AMRs) paired with a robotic picking arm that moves inventory and picks individual SKUs without new warehouse infrastructure.",
      [{ label: "Company website (demo)", claimSupported: "Product description" }]
    ),
    product: fact(
      "Hardware-as-a-service: robots, computer-vision picking arm, and a fleet orchestration software platform, sold as a monthly subscription per robot.",
      [{ label: "Company website (demo)", claimSupported: "Pricing page describes subscription model" }]
    ),
    customer: fact("Mid-size 3PL and e-commerce fulfillment operators (50,000–500,000 sq ft warehouses)", [
      { label: "Case studies page (demo)", claimSupported: "Customer profile described in case studies" },
    ]),
    businessModelSummary: fact("Per-robot monthly subscription plus a one-time integration fee", [
      { label: "Company website (demo)", claimSupported: "Pricing page" },
    ]),
    whyNow: analysis(
      "Warehouse labor costs have risen and computer-vision picking accuracy has crossed a threshold (per third-party robotics benchmarks) where robotic picking is now cost-competitive with human pickers for standard SKUs."
    ),
    tractionSummary: fact("Deployed in 14 warehouses across 6 customers as of the Series B announcement", [
      { label: "Press release (demo)", claimSupported: "Deployment count at Series B" },
    ]),
    technology: fact(
      "Computer vision + reinforcement-learning grasping model for picking; SLAM-based navigation for the mobile robot fleet.",
      [{ label: "Company website (demo)", claimSupported: "Technology page" }]
    ),
  },
  market: {
    category: "Warehouse automation / robotic process automation for logistics",
    tam: unknown("Reliable market-size data not verified."),
    sam: unknown("Reliable market-size data not verified."),
    som: unknown("Reliable market-size data not verified."),
    growthRate: analysis(
      "Warehouse automation spend has grown as e-commerce order volumes have grown and warehouse labor has become harder to hire; the direction is well supported, though a precise growth rate is not verified here."
    ),
    marketDrivers: [
      analysis("Persistent warehouse labor shortages in the U.S. logistics sector"),
      analysis("E-commerce order volumes requiring faster, more accurate fulfillment"),
      analysis("Falling cost of the sensors and compute needed for robotic picking"),
    ],
    customerDemandSignals: [
      fact("6 named customers by Series B, including at least 2 repeat expansions", [
        { label: "Press release (demo)", claimSupported: "Repeat customer expansion mentioned" },
      ]),
    ],
    technologyTrends: [
      analysis("Improvements in vision-based grasping models have made picking irregular SKUs more reliable"),
    ],
    regulatoryEnvironment: analysis(
      "Warehouse robotics is not heavily regulated directly, but workplace safety standards (e.g., OSHA in the U.S.) govern human-robot co-working spaces."
    ),
    geographicOpportunity: analysis(
      "Currently U.S.-only; e-commerce logistics markets in Europe and parts of Asia face similar labor dynamics."
    ),
    whyNow:
      "Robotic picking accuracy for standard SKUs has reportedly become cost-competitive with human labor in high-wage regions, which is the condition that turns warehouse robotics from a novelty into a line-item ROI decision for 3PL operators.",
    whatCouldChangeThisMarket: [
      "A drop in available warehouse labor supply (tightens the case further) or a wage decline (weakens it)",
      "A large logistics player building or acquiring similar robotics in-house",
      "A breakthrough in general-purpose robot arms that outperforms specialized picking systems",
    ],
  },
  product: {
    uniqueAspects: [
      analysis("Combines mobile transport and robotic picking in one integrated system rather than two separate vendors"),
    ],
    technologyDifferentiation: analysis(
      "Vision-based grasping claims to handle irregular, non-boxed SKUs better than fixed-grid picking systems, though this is not independently verified."
    ),
    workflowDifferentiation: fact("No warehouse racking changes required for installation, per case studies", [
      { label: "Case studies page (demo)", claimSupported: "Installation described as retrofit, no racking changes" },
    ]),
    costAdvantage: unknown("No independently verified unit-cost comparison against competitors."),
    dataAdvantage: assumption(
      "The company likely benefits from picking data across deployed sites improving its grasping model over time, though this data-flywheel effect is not confirmed as material yet."
    ),
    distributionAdvantage: unknown(),
    customerExperience: fact("Subscription includes on-site technician support during onboarding", [
      { label: "Company website (demo)", claimSupported: "Onboarding/support terms on pricing page" },
    ]),
    switchingCosts: analysis(
      "Once integrated into a warehouse's workflow and staffing plan, switching to a competitor requires re-training staff and re-validating pick accuracy — a real but moderate switching cost."
    ),
    integrationAdvantage: unknown("Integration depth with customers' existing WMS software is not verified."),
    whyCustomersMayChoose: [
      "No racking or infrastructure changes needed to deploy",
      "Subscription pricing avoids large upfront capital expenditure",
      "Combined transport + picking reduces the number of vendors to manage",
    ],
    whyCustomersMayNotChoose: [
      "Picking accuracy for highly irregular or fragile SKUs may still lag human pickers",
      "3PLs with existing automation vendor relationships face switching friction",
      "Smaller warehouses may not have enough volume to justify a subscription",
    ],
  },
  businessModel: {
    revenueModel: fact("Per-robot monthly subscription (hardware-as-a-service)", [
      { label: "Pricing page (demo)", claimSupported: "Subscription pricing model" },
    ]),
    pricingModel: fact("Tiered by robot count, plus a one-time integration fee", [
      { label: "Pricing page (demo)", claimSupported: "Tiering structure" },
    ]),
    recurringRevenue: analysis("Subscription model implies recurring revenue, though public retention data is not available."),
    grossMarginPotential: unknown("Hardware-as-a-service margins depend on robot manufacturing cost, which is not public."),
    customerAcquisition: unknown("Sales cycle length and CAC are not publicly disclosed."),
    salesCycle: assumption("Likely a long, high-touch enterprise sales cycle given the capital nature of a robotics deployment."),
    capitalIntensity: analysis(
      "Hardware-as-a-service is capital-intensive for the company itself (it owns the robot fleet), which is a real structural risk distinct from the customer's economics."
    ),
    scalability: assumption("Scaling requires both software improvements and physical robot manufacturing/fleet capacity — less purely scalable than a software-only model."),
    customerConcentration: unknown("Revenue concentration across the 6 named customers is not disclosed."),
    expansionRevenue: fact("At least 2 customers expanded robot count after initial deployment, per press release", [
      { label: "Press release (demo)", claimSupported: "Repeat expansion mentioned" },
    ]),
    distribution: assumption("Appears to sell direct to 3PL operators rather than through a channel partner."),
    strengths: [
      "Recurring subscription revenue rather than one-time hardware sale",
      "Demonstrated repeat expansion within existing customers",
    ],
    risks: [
      "Owning and maintaining the robot fleet ties up capital that a pure-software company would not need",
      "Gross margin depends heavily on hardware cost curves, which are outside the company's full control",
    ],
    openQuestions: [
      "What is gross margin per robot today, and how does it change at 10x fleet scale?",
      "What percentage of revenue comes from the largest customer?",
    ],
  },
  traction: {
    revenue: unknown("Not publicly verified."),
    arr: unknown("Not publicly verified."),
    growth: unknown("Not publicly verified."),
    customers: fact("6 named customers as of Series B", [
      { label: "Press release (demo)", claimSupported: "Customer count at Series B" },
    ]),
    users: unknown("Not applicable / not disclosed."),
    retention: unknown("Not publicly verified."),
    partnerships: unknown("No confirmed strategic partnerships found."),
    funding: fact("$64M total raised (Seed, Series A, Series B)", [
      { label: "Press release (demo)", claimSupported: "Cumulative funding figure" },
    ]),
    productAdoption: fact("14 warehouse deployments across 6 customers", [
      { label: "Press release (demo)", claimSupported: "Deployment count" },
    ]),
    internationalExpansion: unknown("No evidence of operations outside the United States."),
    signals: [
      "Repeat expansion within at least 2 existing customers",
      "Series B led by a logistics-focused investor, per press release",
    ],
    openQuestions: [
      "What is same-customer robot-count growth rate year over year?",
      "What is the churn or non-renewal rate, if any customer has reached contract renewal?",
    ],
  },
  competitors: {
    competitors: [
      {
        name: "Fetch-style AMR incumbents (category)",
        category: "incumbent",
        product: "Autonomous mobile robots for warehouse transport only (no picking arm)",
        targetCustomer: "Large enterprise warehouses",
        businessModel: "Hardware sale or lease",
        differentiation: "Established install base and enterprise sales relationships",
        fundingOrScale: "Category includes well-funded, established players",
      },
      {
        name: "Fixed robotic-picking-cell vendors (category)",
        category: "direct",
        product: "Stationary robotic arms for picking at fixed workstations",
        targetCustomer: "High-volume single-SKU fulfillment centers",
        businessModel: "Hardware sale plus service contract",
        differentiation: "Optimized for very high-volume, low-SKU-variety operations",
      },
      {
        name: "Manual staffing agencies",
        category: "indirect",
        product: "Temporary warehouse labor",
        targetCustomer: "Any warehouse operator",
        businessModel: "Hourly staffing fees",
        differentiation: "No capital investment required, but subject to labor availability and cost",
      },
    ],
    whatMakesThisStartupDifferent: [
      "Combines mobile transport and picking in a single integrated offering, versus buying two separate systems",
      "No warehouse infrastructure changes required for installation",
    ],
    whatCompetitorsCanCopy: [
      "Subscription pricing model is not proprietary and could be adopted by incumbents",
      "Vision-based picking approaches are an active research area competitors can also pursue",
    ],
    whyCustomersMightSwitch: [
      "Avoiding large upfront capital expenditure via subscription pricing",
      "Wanting one vendor for both transport and picking instead of two",
    ],
    whyCustomersMightStayWithIncumbent: [
      "Existing integration and staff training already sunk into an incumbent's system",
      "Incumbent's larger install base may offer more proven reliability data",
    ],
  },
  moat: {
    factors: [
      { factor: "technology", strength: "some_evidence", reasoning: "Vision-based picking model shows real capability in case studies, but is not independently benchmarked against competitors." },
      { factor: "proprietary_data", strength: "some_evidence", reasoning: "Picking data across 14 deployments could improve the grasping model over time, but the size of this data advantage versus larger competitors is unverified." },
      { factor: "network_effects", strength: "weak_evidence", reasoning: "Warehouse robotics is not inherently a network-effects business — one customer's use does not directly make the product better for another." },
      { factor: "distribution", strength: "weak_evidence", reasoning: "No evidence of a distribution advantage such as channel partnerships; appears to sell direct." },
      { factor: "brand", strength: "weak_evidence", reasoning: "Company is early-stage with a small customer base; brand recognition in logistics is likely limited so far." },
      { factor: "intellectual_property", strength: "unknown", reasoning: "No patent filings were reviewed as part of this analysis." },
      { factor: "switching_costs", strength: "some_evidence", reasoning: "Once staff are trained and workflows adapted, switching robotics vendors involves real retraining and revalidation cost." },
      { factor: "economies_of_scale", strength: "weak_evidence", reasoning: "Owning and maintaining a robot fleet has real marginal cost per unit; scale advantages are not yet demonstrated." },
      { factor: "regulatory_advantage", strength: "unknown", reasoning: "No regulatory approval or certification advantage was identified." },
      { factor: "customer_relationships", strength: "some_evidence", reasoning: "Repeat expansion within existing customers suggests real relationship strength, though the sample is small (6 customers)." },
    ],
  },
  founders: {
    founders: [
      {
        name: "Elena Marsh",
        role: "CEO & Co-founder",
        background: [
          fact("Previously led a robotics engineering team at a large automotive manufacturer (per company bio, demo)", [
            { label: "Company About page (demo)", claimSupported: "Prior role described in founder bio" },
          ]),
        ],
      },
      {
        name: "Dev Patel",
        role: "CTO & Co-founder",
        background: [
          fact("PhD in robotics/computer vision (per company bio, demo)", [
            { label: "Company About page (demo)", claimSupported: "Education described in founder bio" },
          ]),
        ],
      },
    ],
    relevantTeamExperience: [
      "Prior large-scale robotics engineering experience relevant to fleet reliability",
      "Technical co-founder with a research background directly in the core technology (computer vision for grasping)",
    ],
    teamQuestions: [
      "Has either founder previously built and scaled a hardware-as-a-service business model specifically (versus pure robotics engineering)?",
      "What is the depth of the engineering team below the founders — how many of the original technical hires remain?",
    ],
    informationToVerify: [
      "Confirm founder education and prior employment claims directly (e.g., via LinkedIn cross-check)",
      "Confirm whether either founder has prior startup exits",
    ],
  },
  strategicFit: {
    matches: [
      {
        companyOrIndustry: "Large 3PL / freight logistics operators",
        rationale: "Direct customer fit — this is the core buyer segment already targeted",
        possibleCollaboration: "Multi-site rollout agreement across a logistics operator's warehouse network",
        possiblePilotProject: "Single-site pilot with a defined ROI benchmark (pick rate, error rate) before multi-site commitment",
        distributionOpportunity: "A large 3PL could become a reference customer that opens doors to its competitors",
        technologyIntegration: "Integration with the 3PL's existing warehouse management system (WMS)",
        geographicOpportunity: "Access to the 3PL's warehouse footprint across multiple states or regions",
        confidence: "medium",
        confidenceReasoning: "Strong logical fit with the company's stated customer profile, but no confirmed relationship exists with any specific large 3PL today.",
      },
      {
        companyOrIndustry: "Warehouse racking / material handling equipment manufacturers",
        rationale: "Adjacent hardware vendors who sell into the same warehouses could bundle or co-sell",
        possibleCollaboration: "Co-marketing or bundled offering with a racking/shelving manufacturer",
        possiblePilotProject: "Joint installation package for new warehouse build-outs",
        distributionOpportunity: "Access to the manufacturer's existing warehouse customer base",
        technologyIntegration: "Designing racking configurations optimized for the robot fleet's navigation",
        geographicOpportunity: "Whichever regions the manufacturer already has distribution in",
        confidence: "low",
        confidenceReasoning: "Plausible business logic, but this is speculative — no evidence this type of partnership has been discussed.",
      },
    ],
  },
  pegasusFit: {
    vcAsAServiceRationale:
      "A robotics hardware-as-a-service company like this could benefit from a strategic investor with reach into large logistics and manufacturing corporates that might become both customers and channel partners.",
    enterprisePartnershipIdeas: [
      "Introductions to large 3PL and e-commerce fulfillment corporates as pilot customers",
    ],
    technologyPartnershipIdeas: [
      "Connections to sensor or compute hardware suppliers to help de-risk the hardware supply chain",
    ],
    businessDevelopmentIdeas: [
      "Support structuring the hardware-as-a-service financing model with corporate partners",
    ],
    internationalExpansionIdeas: [
      "Introductions to logistics operators in markets with similar labor cost dynamics (e.g., parts of Asia)",
    ],
    corporatePilotIdeas: [
      "A structured single-site pilot program with a named enterprise logistics partner",
    ],
    distributionIdeas: [
      "Co-selling through a corporate partner's existing warehouse equipment sales channel",
    ],
    strategicInvestmentAngle:
      "A strategic investment could combine capital with warehouse-network access, which is the scarce resource for a company selling physical hardware deployments.",
    disclaimer: "Potential fit based on industry characteristics — not a confirmed Pegasus relationship.",
  },
  japan: {
    couldEnterJapan:
      "Plausible in principle — Japan has an aging workforce and well-documented warehouse labor shortages, which is the same driver behind Cargofox's U.S. thesis — but no Japan-specific validation exists yet.",
    beneficiaryIndustries: ["E-commerce fulfillment", "Third-party logistics (3PL)", "Retail distribution"],
    potentialEnterpriseCustomers: ["Large Japanese logistics and delivery operators"],
    potentialStrategicPartners: ["Japanese warehouse equipment and material handling manufacturers"],
    localizationRequirements: [
      "Software localization to Japanese language for warehouse staff interfaces",
      "Adapting robot navigation and safety systems to Japanese workplace safety standards",
    ],
    regulatoryRequirements: [
      "Compliance with Japanese workplace safety regulations for human-robot co-working environments",
    ],
    distributionConsiderations: "Likely requires a local partner or distributor given the high-touch, on-site nature of hardware deployment.",
    pricingConsiderations: "Subscription pricing would need to be benchmarked against local warehouse labor costs, which differ from the U.S.",
    enterpriseSalesConsiderations: "Enterprise sales in Japan often involve longer relationship-building and consensus-based decision processes than in the U.S.",
    languageConsiderations: "All software interfaces and on-site support documentation would need Japanese localization.",
    technologyIntegrationConsiderations: "Would need integration with Japanese warehouse management systems, which may differ from U.S.-standard WMS platforms.",
    localCompetition: ["Established Japanese industrial robotics manufacturers with existing warehouse automation products"],
    entryStrategy: [
      { phase: 1, title: "Market Validation", description: "Research Japanese 3PL labor cost trends and existing automation vendor landscape before committing resources." },
      { phase: 2, title: "Pilot", description: "Run a single-site pilot with a local logistics operator, likely via a local partner to navigate regulatory and language requirements." },
      { phase: 3, title: "Strategic Partner", description: "Formalize a relationship with a Japanese distributor or warehouse equipment manufacturer for local sales and support." },
      { phase: 4, title: "Enterprise Deployment", description: "Expand to multi-site deployment with the anchor enterprise customer from the pilot." },
      { phase: 5, title: "Scale", description: "Broaden to additional Japanese 3PL and e-commerce operators using the proven local partner relationship." },
    ],
  },
  devilsAdvocate: {
    reasonsThisCouldFail: [
      "A large incumbent robotics or logistics equipment company could bundle similar capability into an existing customer relationship at lower marginal cost",
      "Gross margins on the hardware-as-a-service model may not improve enough at scale if robot manufacturing costs stay high",
      "Picking accuracy on irregular or fragile SKUs may plateau below what's needed for broader warehouse categories beyond standard boxed goods",
      "A downturn in e-commerce order volumes would directly reduce the ROI case customers use to justify the subscription",
      "With only 6 named customers, losing even one or two could materially change the growth narrative investors are underwriting",
    ],
    assumptionsThatMustBeTrue: [
      "Robotic picking accuracy continues to improve fast enough to expand beyond standard SKUs",
      "Warehouse labor costs remain high enough that the subscription ROI case holds",
      "The company can maintain fleet reliability and support quality as customer count grows",
    ],
    whatInvestorsMayBeMissing: [
      "Whether the current customer base is concentrated in one or two large accounts, which would make revenue fragile",
      "Whether gross margin on the hardware improves meaningfully at 5x or 10x fleet scale, versus staying thin",
    ],
    technologyRisk: "Vision-based grasping performance on the long tail of irregular SKUs is unverified beyond current case studies.",
    marketRisk: "Warehouse automation demand is cyclical and tied to e-commerce order volume growth, which could slow.",
    competitionRisk: "Well-funded incumbents in adjacent categories (pure AMR or pure picking-arm vendors) could add the missing half of the offering.",
    executionRisk: "Hardware-as-a-service requires the company to manufacture, deploy, and service physical robots reliably at scale — a very different operational challenge than software.",
    financingRisk: "Owning the robot fleet is capital-intensive; future fundraising or debt financing needs could be larger than a software company at the same revenue level.",
    customerRisk: "A small (6-customer) base means any single customer's non-renewal is a material event.",
    regulatoryRisk: "Workplace safety rules for human-robot co-working spaces could tighten, requiring costly redesigns.",
    whatWouldMakeTheThesisWrong:
      "If gross margin per robot does not improve meaningfully as the fleet scales — because manufacturing and maintenance costs stay high — this looks more like a capital-intensive equipment-leasing business than a scalable software-margin company, which would justify a very different valuation.",
  },
  criticalQuestions: {
    questions: [
      { question: "What percentage of current revenue comes from the top 2 customers?", whyItMatters: "With only 6 named customers, concentration risk could be severe and isn't disclosed." },
      { question: "What is gross margin per robot today, and how is it expected to change at 10x fleet scale?", whyItMatters: "This determines whether the business is closer to software margins or equipment-leasing margins." },
      { question: "What is the picking accuracy rate on irregular, non-boxed SKUs specifically, independently measured?", whyItMatters: "Case studies describe capability, but the addressable SKU range for the technology is unverified." },
      { question: "Has any customer failed to renew or reduced robot count after initial deployment?", whyItMatters: "Public information shows expansion in some customers but says nothing about churn." },
      { question: "What prevents an existing AMR or picking-arm incumbent from bundling both capabilities and undercutting on price?", whyItMatters: "The core differentiation (transport + picking combined) may not be defensible if incumbents can add the missing piece." },
    ],
  },
  founderQuestions: {
    product: ["What SKU types or shapes cause the picking arm to fail or require human intervention today?"],
    market: ["How sensitive is customer ROI to changes in local warehouse wage rates?"],
    competition: ["What would you do if a major AMR incumbent launched a competing integrated picking arm next year?"],
    economics: ["What is the payback period for the company on manufacturing and deploying one robot, at current subscription pricing?"],
    execution: ["What is your current robot fleet uptime / mean time between failures across deployed sites?"],
  },
  nextDiligence: {
    items: [
      { item: "Customer reference calls with at least 3 of the 6 named customers", priority: "critical", reasoning: "Directly tests concentration risk, renewal likelihood, and real-world ROI." },
      { item: "Independent technical review of picking accuracy across SKU types", priority: "critical", reasoning: "Core technical claim underlying the whole business case." },
      { item: "Financial review of gross margin per robot and fleet capital expenditure", priority: "critical", reasoning: "Determines whether the model scales like software or like equipment leasing." },
      { item: "Competitor interviews or teardown of at least one incumbent AMR + picking-arm bundle", priority: "important", reasoning: "Tests durability of the core differentiation claim." },
      { item: "Founder reference checks on prior robotics engineering leadership roles", priority: "important", reasoning: "Validates background claims in founder bios." },
      { item: "IP / patent search on grasping and navigation technology", priority: "useful", reasoning: "Clarifies whether any technical moat is legally protected." },
    ],
  },
  icMemo: {
    executiveSummary:
      "Cargofox Robotics sells a subscription-based combination of mobile transport robots and a vision-guided picking arm to mid-size 3PL and e-commerce warehouses. The company has reached 14 deployments across 6 named customers and raised $64M through Series B. The core open question is economic, not technical: whether gross margin per robot improves enough at scale to behave like a software business, or whether the capital intensity of owning a robot fleet caps its eventual margins. Customer concentration across a 6-account base is also unverified and material.",
    missingInformation: [
      "Gross margin per robot and its trend with scale",
      "Revenue concentration across the customer base",
      "Independently verified picking accuracy across SKU types",
      "Customer renewal / churn history",
    ],
    sources: [
      { label: "Company website (demo)", claimSupported: "Product, pricing, and team background", url: undefined },
      { label: "Press release (demo)", claimSupported: "Funding and customer/deployment counts" },
      { label: "Case studies page (demo)", claimSupported: "Installation process and customer profile" },
    ],
    generatedAt: "2026-01-15T09:05:00.000Z",
  },
};
