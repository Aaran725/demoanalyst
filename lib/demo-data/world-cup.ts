/**
 * SAMPLE DATA for the Startup World Cup AI Scout.
 *
 * This is intentionally a lighter-weight record than a full Analyze Startup
 * result (FullAnalysis) — it's a scouting index meant to be filtered and
 * compared across many companies at once, not a full 14-agent research
 * report. Clicking into deep research on any one of these would run the
 * same pipeline as Analyze Startup. All companies and figures below are
 * fictional, for demonstration only.
 */
export type RevenueRange = "Pre-revenue" | "$0–1M" | "$1–10M" | "$10M+";
export type GrowthBand = "Early / unproven" | "Moderate" | "High";
export type CorporateFit = "High" | "Medium" | "Low";
export type JapanOpportunity = "High" | "Medium" | "Low";

export interface ScoutStartup {
  id: string;
  name: string;
  sector: string;
  country: string;
  region: string;
  stage: string;
  technology: string;
  businessModel: string;
  revenueRange: RevenueRange;
  growth: GrowthBand;
  corporateFit: CorporateFit;
  japanOpportunity: JapanOpportunity;
  snapshot: string;
  market: string;
  traction: string;
  differentiation: string;
  strategicFit: string;
  risks: string[];
  criticalQuestions: string[];
  researchBrief: string;
}

export const SCOUT_STARTUPS: ScoutStartup[] = [
  {
    id: "scout-cargofox",
    name: "Cargofox Robotics",
    sector: "Warehouse Robotics",
    country: "United States",
    region: "North America",
    stage: "Series B",
    technology: "Computer vision + AMR fleet",
    businessModel: "Hardware-as-a-service subscription",
    revenueRange: "$1–10M",
    growth: "Moderate",
    corporateFit: "High",
    japanOpportunity: "Medium",
    snapshot: "Combined mobile transport + robotic picking for mid-size 3PL warehouses.",
    market: "Warehouse automation, driven by labor shortages and e-commerce order volume.",
    traction: "14 deployments across 6 named customers as of Series B.",
    differentiation: "No racking changes needed; one vendor for transport and picking.",
    strategicFit: "Large 3PLs and warehouse equipment manufacturers.",
    risks: ["Hardware fleet is capital-intensive", "Small customer base concentration risk"],
    criticalQuestions: ["What % of revenue comes from the top 2 customers?", "What is gross margin per robot at scale?"],
    researchBrief: "See the full Analyze Startup report for the complete 16-section research brief on this company.",
  },
  {
    id: "scout-aveline",
    name: "Aveline Health",
    sector: "Healthcare AI",
    country: "United States",
    region: "North America",
    stage: "Series A",
    technology: "Ambient speech-to-text + clinical LLM",
    businessModel: "Per-provider subscription",
    revenueRange: "$0–1M",
    growth: "High",
    corporateFit: "Medium",
    japanOpportunity: "Low",
    snapshot: "AI ambient scribe drafting clinical notes for outpatient physician groups.",
    market: "Clinical documentation burden and physician burnout.",
    traction: "3 physician groups, ~120 providers live.",
    differentiation: "Outpatient focus and direct EHR chart integration.",
    strategicFit: "Physician group networks and malpractice insurers.",
    risks: ["EHR vendors could bundle a free equivalent", "Small customer sample"],
    criticalQuestions: ["What is 90-day provider retention?", "What is inference cost per note?"],
    researchBrief: "See the full Analyze Startup report for the complete 16-section research brief on this company.",
  },
  {
    id: "scout-ledgerline",
    name: "Ledgerline AI",
    sector: "Enterprise AI Agents",
    country: "United States",
    region: "North America",
    stage: "Series A",
    technology: "Document understanding + agent workflow",
    businessModel: "Per-seat + usage-based pricing",
    revenueRange: "$1–10M",
    growth: "High",
    corporateFit: "High",
    japanOpportunity: "Medium",
    snapshot: "AI agent automating invoice-to-PO matching for mid-market finance teams.",
    market: "Finance back-office automation, driven by LLM document understanding.",
    traction: "22 mid-market customers.",
    differentiation: "No ERP data migration required; human-in-the-loop exceptions.",
    strategicFit: "ERP vendors and BPO finance-operations firms.",
    risks: ["ERP vendors could bundle equivalent matching", "Undisclosed customer concentration"],
    criticalQuestions: ["What % of revenue comes from top 3 customers?", "What is document-processing cost per invoice?"],
    researchBrief: "See the full Analyze Startup report for the complete 16-section research brief on this company.",
  },
  {
    id: "scout-solara",
    name: "Solara Grid",
    sector: "Energy Storage",
    country: "Germany",
    region: "Europe",
    stage: "Series B",
    technology: "Software-defined battery management for commercial solar+storage",
    businessModel: "SaaS + hardware integration fee",
    revenueRange: "$10M+",
    growth: "Moderate",
    corporateFit: "High",
    japanOpportunity: "High",
    snapshot: "Software layer that optimizes commercial battery storage dispatch against energy prices.",
    market: "Commercial energy storage adoption driven by grid price volatility and renewables mandates.",
    traction: "Deployed across 40+ commercial sites in the EU, per company materials.",
    differentiation: "Hardware-agnostic — works across multiple battery vendors' equipment.",
    strategicFit: "Utilities, commercial real estate operators, and battery manufacturers.",
    risks: ["Battery manufacturers could build equivalent software in-house", "Regulatory/tariff dependency"],
    criticalQuestions: ["What % of savings does the software actually capture vs. hardware alone?", "How sticky is the software once installed?"],
    researchBrief: "Sample scouting record — full research brief not yet generated for this company.",
  },
  {
    id: "scout-kaikan",
    name: "Kaikan Robotics",
    sector: "Humanoid Robots",
    country: "Japan",
    region: "Asia",
    stage: "Seed",
    technology: "Bipedal locomotion + manipulation for light industrial tasks",
    businessModel: "Hardware sale + service contract",
    revenueRange: "Pre-revenue",
    growth: "Early / unproven",
    corporateFit: "Medium",
    japanOpportunity: "High",
    snapshot: "Early-stage humanoid robot for light industrial assembly tasks.",
    market: "Humanoid robotics for manufacturing labor shortages.",
    traction: "Pilot in progress with one manufacturing partner, per company materials.",
    differentiation: "Focused on light-assembly tasks rather than general-purpose humanoid claims.",
    strategicFit: "Japanese manufacturers facing labor shortages.",
    risks: ["Very early stage, unproven at scale", "Well-funded global humanoid robotics competitors"],
    criticalQuestions: ["What specific tasks can the robot reliably complete today, unsupervised?", "What is the realistic manufacturing cost per unit?"],
    researchBrief: "Sample scouting record — full research brief not yet generated for this company.",
  },
  {
    id: "scout-vantage",
    name: "Vantage Quantum",
    sector: "Quantum Computing",
    country: "United Kingdom",
    region: "Europe",
    stage: "Series A",
    technology: "Error-mitigation software for near-term quantum hardware",
    businessModel: "Enterprise software licensing",
    revenueRange: "Pre-revenue",
    growth: "Early / unproven",
    corporateFit: "Medium",
    japanOpportunity: "Low",
    snapshot: "Software that reduces error rates on existing quantum hardware without waiting for better qubits.",
    market: "Quantum computing commercialization is early; timeline to broad enterprise value is uncertain.",
    traction: "Early pilot programs with research labs, per company materials.",
    differentiation: "Hardware-agnostic error mitigation rather than building proprietary qubits.",
    strategicFit: "Cloud computing providers and quantum hardware manufacturers.",
    risks: ["Quantum computing commercial timeline remains highly uncertain", "Hardware vendors could build this in-house"],
    criticalQuestions: ["What is the realistic timeline to enterprise-relevant use cases?", "Why would a hardware vendor not build this internally?"],
    researchBrief: "Sample scouting record — full research brief not yet generated for this company.",
  },
];
