/** Progress steps for the public-equity Investment Committee pipeline — mirrors lib/ai/progress.ts. */
export type CompanyProgressStep =
  | "fetching_filings"
  | "fundamental"
  | "forensic_accountant"
  | "valuation"
  | "moat"
  | "management"
  | "institutional"
  | "bull"
  | "bear"
  | "fact_checker"
  | "ic_chairman"
  | "done";

export const COMPANY_PROGRESS_STEPS: CompanyProgressStep[] = [
  "fetching_filings",
  "fundamental",
  "forensic_accountant",
  "valuation",
  "moat",
  "management",
  "institutional",
  "bull",
  "bear",
  "fact_checker",
  "ic_chairman",
];

export const COMPANY_PROGRESS_LABELS: Record<CompanyProgressStep, string> = {
  fetching_filings: "Pulling SEC filings & market data...",
  fundamental: "Fundamental Analyst reviewing the business...",
  forensic_accountant: "Forensic Accountant checking earnings quality...",
  valuation: "Valuation Analyst running reverse DCF...",
  moat: "Innovation & Moat Analyst assessing competitive position...",
  management: "Management Analyst tracking CEO promises...",
  institutional: "Institutional Intelligence Analyst checking smart money...",
  bull: "Bull Analyst building the strongest case...",
  bear: "Bear Analyst attacking the thesis...",
  fact_checker: "Fact Checker classifying every claim...",
  ic_chairman: "IC Chairman synthesizing the Investment Committee Memo...",
  done: "Complete",
};

/** Display labels for the 10-agent "deployed" visual, shown before the real pipeline starts streaming completions. */
export const AGENT_DISPLAY_NAMES = [
  "Fundamental Analyst",
  "Forensic Accountant",
  "Valuation Analyst",
  "Industry Analyst",
  "Management Analyst",
  "Institutional Intelligence Analyst",
  "Innovation & Moat Analyst",
  "Bull Analyst",
  "Bear Analyst",
  "Fact Checker",
] as const;
