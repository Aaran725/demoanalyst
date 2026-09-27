"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CompanyEvidenceTag } from "./CompanyEvidenceTag";
import type { CompanyClaim } from "@/lib/ai/company-schemas";
import { cn } from "@/lib/utils";

/** Renders one CompanyClaim with its confidence badge; clicking expands the evidence drawer (source/date/URL/what it supports). */
export function CompanyClaimBlock({ label, claim, className }: { label?: string; claim: CompanyClaim; className?: string }) {
  const [open, setOpen] = useState(false);
  const hasSources = !!claim.sources && claim.sources.length > 0;

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-start justify-between gap-2">
        {label && <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</span>}
        <button
          type="button"
          onClick={() => hasSources && setOpen((o) => !o)}
          className={cn("inline-flex items-center gap-0.5", hasSources && "cursor-pointer")}
          disabled={!hasSources}
        >
          <CompanyEvidenceTag tier={claim.confidence} />
          {hasSources && (open ? <ChevronDown size={12} className="text-ink-300" /> : <ChevronRight size={12} className="text-ink-300" />)}
        </button>
      </div>
      <p className="text-sm leading-relaxed text-ink-800">{claim.text}</p>
      {open && hasSources && (
        <ul className="space-y-1.5 border-l-2 border-ink-100 pl-3">
          {claim.sources!.map((s, i) => (
            <li key={i} className="text-xs text-ink-400">
              <span className="font-medium text-ink-500">{s.label}</span>
              {s.date && <span> · {s.date}</span>}
              {s.url && (
                <>
                  {" · "}
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-signal-600 hover:underline">
                    source
                  </a>
                </>
              )}
              <div className="text-ink-400">{s.claimSupported}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Renders a single verified/estimated numeric metric (from FinancialSnapshot.metrics) with its tag and click-to-reveal source. */
export function MetricStat({
  label,
  formatted,
  confidence,
  source,
  note,
}: {
  label: string;
  formatted: string;
  confidence: CompanyClaim["confidence"];
  source?: string;
  note?: string;
}) {
  const [open, setOpen] = useState(false);
  const hasDetail = !!source || !!note;
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</div>
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-lg font-semibold text-ink-950">{formatted}</span>
        <button type="button" onClick={() => hasDetail && setOpen((o) => !o)} disabled={!hasDetail}>
          <CompanyEvidenceTag tier={confidence} />
        </button>
      </div>
      {open && hasDetail && (
        <div className="text-xs text-ink-400">
          {source && <div>{source}</div>}
          {note && <div className="mt-0.5">{note}</div>}
        </div>
      )}
    </div>
  );
}
