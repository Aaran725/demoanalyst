/**
 * Public Market Intelligence — traces a line from startup-level innovation
 * to which categories of public companies it could affect.
 *
 * We deliberately describe companies by CATEGORY ("established ERP
 * vendors") rather than naming specific tickers with invented revenue
 * exposure numbers — real financial exposure figures would need to be
 * sourced from actual filings, which this prototype doesn't do. This page
 * is a framework for thinking, not a research report on any specific stock.
 * Never generates buy/sell calls or price predictions — see the
 * disclaimer in the page itself.
 */
export interface PublicCompanyImpact {
  companyCategory: string;
  whyItMatters: string;
  revenueExposure: string;
  competitiveImpact: string;
  timeHorizon: string;
  risks: string[];
  whatToMonitor: string[];
}

export interface MarketTheme {
  id: string;
  name: string;
  startupInnovation: string;
  industriesAffected: string[];
  potentialBeneficiaries: string[];
  potentiallyDisrupted: string[];
  companies: PublicCompanyImpact[];
}

export const MARKET_THEMES: MarketTheme[] = [
  {
    id: "ai-agents",
    name: "AI Agents in the Enterprise",
    startupInnovation: "AI agents that complete multi-step back-office workflows (finance, support, procurement) with human review.",
    industriesAffected: ["Enterprise software", "Business process outsourcing", "Finance operations"],
    potentialBeneficiaries: ["Cloud/AI infrastructure providers whose compute agents run on"],
    potentiallyDisrupted: ["Business process outsourcing firms whose labor-based model could be automated", "Point-solution software vendors an agent could functionally replace"],
    companies: [
      {
        companyCategory: "Major cloud/AI infrastructure providers",
        whyItMatters: "AI agents run on cloud compute and model APIs — usage growth in agents is a demand driver for this category.",
        revenueExposure: "Not independently verified — would require reviewing segment-level cloud/AI revenue disclosures.",
        competitiveImpact: "Positive exposure to overall AI compute demand growth, not specific to any one agent product.",
        timeHorizon: "1-3 years for measurable revenue impact from enterprise AI workload growth.",
        risks: ["Compute demand growth could slow if enterprise AI adoption underdelivers on ROI"],
        whatToMonitor: ["Cloud/AI segment revenue growth disclosures", "Enterprise AI adoption survey data"],
      },
      {
        companyCategory: "Established enterprise software / ERP vendors",
        whyItMatters: "Could either be disrupted by point-solution AI agents or absorb the capability by building/acquiring agent features natively.",
        revenueExposure: "Not independently verified.",
        competitiveImpact: "Mixed — bundling agent features could defend their platform, or slow in-house development could cede ground to startups.",
        timeHorizon: "2-5 years to see which outcome dominates.",
        risks: ["Slow internal AI feature development relative to fast-moving startups"],
        whatToMonitor: ["Product roadmap announcements", "M&A activity acquiring AI agent startups"],
      },
    ],
  },
  {
    id: "warehouse-robotics",
    name: "Warehouse & Logistics Robotics",
    startupInnovation: "Subscription-priced autonomous robots combining transport and picking for mid-size warehouses.",
    industriesAffected: ["Logistics/3PL", "Industrial automation equipment", "Warehouse staffing"],
    potentialBeneficiaries: ["Sensor and component suppliers to robotics manufacturers"],
    potentiallyDisrupted: ["Traditional warehouse staffing agencies", "Single-function automation equipment vendors that don't integrate transport + picking"],
    companies: [
      {
        companyCategory: "Established industrial automation manufacturers",
        whyItMatters: "Could face new competition from venture-backed integrated robotics startups, or acquire them to add capability.",
        revenueExposure: "Not independently verified.",
        competitiveImpact: "Depends on whether incumbents successfully integrate similar combined transport+picking offerings.",
        timeHorizon: "3-5 years for market share shifts to become visible.",
        risks: ["Startups could out-innovate on integrated software+hardware offerings"],
        whatToMonitor: ["New product launches combining AMR + picking", "Startup funding and deployment announcements in the category"],
      },
    ],
  },
  {
    id: "energy-storage",
    name: "Commercial Energy Storage Software",
    startupInnovation: "Hardware-agnostic software that optimizes commercial battery storage dispatch against energy prices.",
    industriesAffected: ["Utilities", "Commercial real estate", "Battery manufacturing"],
    potentialBeneficiaries: ["Battery manufacturers whose hardware becomes more valuable when paired with smarter dispatch software"],
    potentiallyDisrupted: ["Manual/rules-based energy management providers"],
    companies: [
      {
        companyCategory: "Battery manufacturers and utility-scale storage developers",
        whyItMatters: "Software that improves the realized value of stored energy makes the underlying hardware more attractive to buyers.",
        revenueExposure: "Not independently verified.",
        competitiveImpact: "Could benefit from higher hardware attach rates, or face margin pressure if manufacturers build software in-house instead of partnering.",
        timeHorizon: "2-4 years as commercial storage deployment scales.",
        risks: ["Policy/subsidy changes affecting commercial storage economics"],
        whatToMonitor: ["Commercial storage deployment volumes", "Software partnership vs. in-house build announcements"],
      },
    ],
  },
];
