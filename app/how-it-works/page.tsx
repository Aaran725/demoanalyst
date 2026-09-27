import { ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PIPELINE = [
  { title: "Input", body: "You give AARAN AI a company name, website, or pitch deck." },
  { title: "Research", body: "The ResearchAgent establishes the basic factual record before any analysis starts." },
  { title: "Specialist AI Agents", body: "14 focused agents each analyze one thing — market, product, business model, traction, competitors, moat, founders, and more. See docs/AI_AGENTS.md." },
  { title: "Evidence Check", body: "Every claim is validated against a schema and labeled VERIFIED FACT, AI ANALYSIS, ASSUMPTION, or UNKNOWN." },
  { title: "Strategic Fit", body: "A dedicated engine reasons about who could strategically benefit from this startup — and how confident that reasoning really is." },
  { title: "Devil's Advocate", body: "A separate agent actively tries to disprove the bull case, on purpose, to fight confirmation bias." },
  { title: "Diligence Questions", body: "Everything gets converted into concrete questions and a prioritized next-steps checklist." },
  { title: "IC Memo", body: "A formatted memo pulls it all together for an Investment Committee — with no invest/don't invest recommendation." },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-950">How AARAN AI Works</h1>
        <p className="mt-2 text-ink-500">
          AARAN AI doesn&apos;t make investment decisions. It organizes research, separates facts from
          AI reasoning, and surfaces the questions worth asking next. A human always decides.
        </p>
      </div>

      <div className="space-y-2">
        {PIPELINE.map((step, i) => (
          <div key={step.title}>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-signal-600">
                  Step {i + 1}
                </div>
                <div className="font-medium text-ink-950">{step.title}</div>
                <p className="mt-1 text-sm text-ink-500">{step.body}</p>
              </CardContent>
            </Card>
            {i < PIPELINE.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown size={16} className="text-ink-300" />
              </div>
            )}
          </div>
        ))}
      </div>

      <Card className="border-evidence-assumptionBg bg-evidence-assumptionBg/40">
        <CardContent className="space-y-2 p-5">
          <h2 className="text-sm font-semibold text-ink-900">What this means in practice</h2>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-700">
            <li>AI gathers information — from its own training knowledge, and from live research where configured.</li>
            <li>Different agents analyze different questions, so one prompt isn&apos;t trying to do everything at once.</li>
            <li>Facts are separated from analysis — every claim is tagged with how confident we really are in it.</li>
            <li>Unknown information is labeled UNKNOWN instead of being guessed.</li>
            <li>A Devil&apos;s Advocate agent challenges the thesis on purpose, before you fall in love with it.</li>
            <li>Sources are shown wherever they exist.</li>
            <li>Humans make the investment decision — always.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-red-100 bg-red-50/40">
        <CardContent className="p-5 text-sm font-medium text-ink-800">
          AI can make mistakes. Important information should be independently verified before you act on it.
        </CardContent>
      </Card>
    </div>
  );
}
