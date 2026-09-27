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
  "diligence",
  "memo",
];

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
  diligence: "Preparing diligence questions...",
  memo: "Building IC memo...",
  done: "Complete",
};
