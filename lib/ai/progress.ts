/**
 * Progress step labels shown while an analysis runs.
 * Split into its own file (rather than living in orchestrator.ts) so the
 * client-side progress UI can import just this small list without pulling
 * in the full agent pipeline code into the browser bundle.
 */
export type ProgressStep =
  | "researching"
  | "product"
  | "market"
  | "business_model"
  | "traction"
  | "competitors"
  | "founders"
  | "moat"
  | "strategic_fit"
  | "pegasus_fit"
  | "japan"
  | "devils_advocate"
  | "fact_check"
  | "diligence"
  | "memo"
  | "done";

export const PROGRESS_STEPS: ProgressStep[] = [
  "researching",
  "product",
  "market",
  "business_model",
  "traction",
  "competitors",
  "founders",
  "moat",
  "strategic_fit",
  "pegasus_fit",
  "japan",
  "devils_advocate",
  "fact_check",
  "diligence",
  "memo",
];

/**
 * Which pipeline round each step belongs to — must stay in sync with the
 * actual round structure in lib/ai/orchestrator.ts. Needed because
 * orchestrator.ts fires onProgress for every step in a round BEFORE
 * awaiting that round's Promise.all (so the whole round's agents can be
 * shown as truly in-flight together, not marked "complete" one at a time
 * the instant the round starts — see AnalysisProgress.tsx).
 */
export const PROGRESS_ROUND: Record<ProgressStep, number> = {
  researching: 1,
  product: 2,
  market: 2,
  business_model: 2,
  traction: 2,
  competitors: 2,
  founders: 2,
  pegasus_fit: 2,
  japan: 2,
  moat: 3,
  strategic_fit: 3,
  devils_advocate: 3,
  fact_check: 3,
  diligence: 4,
  memo: 4,
  done: 5,
};

export const PROGRESS_LABELS: Record<ProgressStep, string> = {
  researching: "Researching company...",
  product: "Understanding product...",
  market: "Analyzing market...",
  business_model: "Evaluating business model...",
  traction: "Investigating traction...",
  competitors: "Mapping competitors...",
  founders: "Researching founders...",
  moat: "Testing competitive moat...",
  strategic_fit: "Finding strategic matches...",
  pegasus_fit: "Applying Pegasus VC-as-a-Service lens...",
  japan: "Analyzing Japan opportunity...",
  devils_advocate: "Running Devil's Advocate...",
  fact_check: "Independently fact-checking key claims...",
  diligence: "Preparing diligence questions...",
  memo: "Building IC memo...",
  done: "Complete",
};
