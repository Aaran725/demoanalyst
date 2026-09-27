"use client";

import { Printer, Save, Check, FileOutput } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FullAnalysis } from "@/lib/ai/schemas";
import { saveAnalysis } from "@/lib/storage";
import { computeEvidenceBreakdown } from "@/lib/analysis-stats";

/**
 * The Investment Committee Memo. This is a formatted READ of the analysis
 * already produced by every other agent — it doesn't call the AI again
 * (except MemoAgent's executive summary + missing info, generated once
 * during the pipeline). Print / Export PDF both use the browser's native
 * print dialog ("Save as PDF" is a print destination in every browser),
 * which keeps this dependency-free.
 */
export function ICMemoView({ analysis }: { analysis: FullAnalysis }) {
  const [saved, setSaved] = useState(false);
  const memo = analysis.icMemo;
  const evidence = computeEvidenceBreakdown(analysis);

  return (
    <div className="space-y-6">
      <div className="no-print flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink-950">Investment Committee Memo</h2>
          <p className="text-sm text-ink-400">
            Never includes an invest / don&apos;t invest recommendation — that call is always the human&apos;s.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              saveAnalysis(analysis);
              setSaved(true);
            }}
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            {saved ? "Saved" : "Save"}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Printer size={14} /> Print
          </Button>
          <Button size="sm" onClick={() => window.print()}>
            <FileOutput size={14} /> Export PDF
          </Button>
        </div>
      </div>

      <article className="mx-auto max-w-3xl rounded-xl border border-ink-100 bg-white p-10 shadow-panel print:border-none print:p-0 print:shadow-none">
        <header className="mb-6 border-b border-ink-100 pb-4">
          <div className="font-mono text-xs font-semibold uppercase tracking-widest text-ink-400">
            Investment Committee Memo
          </div>
          <div className="mt-1 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-950">{analysis.snapshot.companyName}</h1>
            {analysis.isDemoData && <Badge variant="outline">DEMO DATA</Badge>}
          </div>
          <p className="mt-2 font-mono text-xs text-ink-400">
            Date: {memo ? new Date(memo.generatedAt).toLocaleDateString() : "—"} &nbsp;·&nbsp; Analyst: AARAN AI (AI-generated)
          </p>
        </header>

        <MemoSection title="Executive Summary">
          <p>{memo?.executiveSummary ?? "Not yet generated."}</p>
        </MemoSection>

        <MemoSection title="Company">
          <p>
            {analysis.snapshot.companyName} — {analysis.snapshot.sector}, {analysis.snapshot.stage}.
            HQ: {analysis.snapshot.headquarters.text}. Founded: {analysis.snapshot.founded.text}.
          </p>
        </MemoSection>

        <MemoSection title="Problem">
          <p>{analysis.snapshot.problem.text}</p>
        </MemoSection>

        <MemoSection title="Solution">
          <p>{analysis.snapshot.solution.text}</p>
        </MemoSection>

        <MemoSection title="Why Now">
          <p>{analysis.market.whyNow}</p>
        </MemoSection>

        <MemoSection title="Market">
          <p>
            Category: {analysis.market.category}. TAM: {analysis.market.tam.text}. SAM: {analysis.market.sam.text}. SOM:{" "}
            {analysis.market.som.text}.
          </p>
        </MemoSection>

        <MemoSection title="Business Model">
          <p>{analysis.snapshot.businessModelSummary.text}</p>
          <List items={analysis.businessModel.strengths.map((s) => `Strength: ${s}`)} />
          <List items={analysis.businessModel.risks.map((r) => `Risk: ${r}`)} />
        </MemoSection>

        <MemoSection title="Traction">
          <p>{analysis.snapshot.tractionSummary.text}</p>
          <List items={analysis.traction.signals} />
        </MemoSection>

        <MemoSection title="Competition">
          <List items={analysis.competitors.whatMakesThisStartupDifferent} />
        </MemoSection>

        <MemoSection title="Moat">
          <List
            items={analysis.moat.factors
              .filter((f) => f.strength === "strong_evidence" || f.strength === "some_evidence")
              .map((f) => `${f.factor.replace(/_/g, " ")}: ${f.reasoning}`)}
          />
        </MemoSection>

        <MemoSection title="Team">
          <List items={analysis.founders.relevantTeamExperience} />
        </MemoSection>

        <MemoSection title="Strategic Fit">
          <List items={analysis.strategicFit.matches.map((m) => `${m.companyOrIndustry}: ${m.rationale}`)} />
        </MemoSection>

        <MemoSection title="Pegasus Fit">
          <p>{analysis.pegasusFit.vcAsAServiceRationale}</p>
        </MemoSection>

        <MemoSection title="Japan Opportunity">
          <p>{analysis.japan.couldEnterJapan}</p>
        </MemoSection>

        <MemoSection title="Key Risks">
          <List
            items={[
              analysis.devilsAdvocate.technologyRisk,
              analysis.devilsAdvocate.marketRisk,
              analysis.devilsAdvocate.competitionRisk,
              analysis.devilsAdvocate.executionRisk,
              analysis.devilsAdvocate.financingRisk,
              analysis.devilsAdvocate.customerRisk,
              analysis.devilsAdvocate.regulatoryRisk,
            ]}
          />
        </MemoSection>

        <MemoSection title="Devil's Advocate">
          <List items={analysis.devilsAdvocate.reasonsThisCouldFail} />
          <p className="mt-2 font-medium">What would make the thesis wrong: {analysis.devilsAdvocate.whatWouldMakeTheThesisWrong}</p>
        </MemoSection>

        <MemoSection title="5 Critical Questions">
          <List items={analysis.criticalQuestions.questions.map((q) => q.question)} />
        </MemoSection>

        <MemoSection title="Questions for Management">
          <List
            items={[
              ...analysis.founderQuestions.product,
              ...analysis.founderQuestions.market,
              ...analysis.founderQuestions.competition,
              ...analysis.founderQuestions.economics,
              ...analysis.founderQuestions.execution,
            ]}
          />
        </MemoSection>

        <MemoSection title="Missing Information">
          <List items={memo?.missingInformation ?? []} />
        </MemoSection>

        <MemoSection title="Recommended Next Diligence">
          <List items={analysis.nextDiligence.items.map((i) => `[${i.priority.toUpperCase()}] ${i.item}`)} />
        </MemoSection>

        <MemoSection title="Sources" last>
          <List
            items={(memo?.sources ?? []).map((s) => `${s.label}${s.date ? ` (${s.date})` : ""} — ${s.claimSupported}`)}
          />
        </MemoSection>

        <p className="mt-8 border-t border-ink-100 pt-4 font-mono text-[11px] text-ink-400">
          Generated by AARAN AI — Evidence Engine: {evidence.total > 0 ? (
            <>
              {Math.round((evidence.counts.verified_fact / evidence.total) * 100)}% Verified Fact ·{" "}
              {Math.round((evidence.counts.ai_analysis / evidence.total) * 100)}% AI Analysis ·{" "}
              {Math.round((evidence.counts.assumption / evidence.total) * 100)}% Assumption ·{" "}
              {Math.round((evidence.counts.unknown / evidence.total) * 100)}% Unknown
            </>
          ) : "no claims recorded"}
        </p>
        <p className="mt-2 text-xs text-ink-400">
          This memo was generated by AI to organize research and questions. It does not contain an investment
          recommendation. AI can make mistakes — verify important information independently before acting on it.
        </p>
      </article>
    </div>
  );
}

function MemoSection({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <section className={last ? "" : "mb-6"}>
      <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">{title}</h2>
      <div className="space-y-1 text-sm leading-relaxed text-ink-800">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
