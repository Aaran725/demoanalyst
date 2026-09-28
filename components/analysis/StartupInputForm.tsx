"use client";

import { useState } from "react";
import { Upload, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StartupInput } from "@/lib/ai/schemas";

const inputClass =
  "w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-signal-600 focus:outline-none focus:ring-1 focus:ring-signal-600";
const labelClass = "text-xs font-semibold uppercase tracking-wide text-ink-500";

export function StartupInputForm({
  onSubmit,
  submitLabel = "Analyze Startup",
  initialCompanyName = "",
}: {
  onSubmit: (input: StartupInput) => void;
  submitLabel?: string;
  initialCompanyName?: string;
}) {
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [website, setWebsite] = useState("");
  const [sector, setSector] = useState("");
  const [country, setCountry] = useState("");
  const [fundingStage, setFundingStage] = useState("");
  const [description, setDescription] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [pitchDeckName, setPitchDeckName] = useState<string | null>(null);

  const canSubmit = companyName.trim().length > 0 || website.trim().length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    let notes = additionalNotes.trim();
    if (pitchDeckName) {
      notes = `${notes}${notes ? "\n\n" : ""}A pitch deck file ("${pitchDeckName}") was provided. Note: this prototype does not parse pitch deck contents yet — analysis is based on the text fields above only.`.trim();
    }

    onSubmit({
      companyName: companyName.trim() || website.trim(),
      website: website.trim() || undefined,
      sector: sector.trim() || undefined,
      country: country.trim() || undefined,
      fundingStage: fundingStage.trim() || undefined,
      description: description.trim() || undefined,
      additionalNotes: notes || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass}>Company Name</label>
          <input
            className={inputClass}
            placeholder="e.g. Cargofox Robotics"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Website URL</label>
          <input
            className={inputClass}
            placeholder="https://..."
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Sector</label>
          <input
            className={inputClass}
            placeholder="e.g. Fintech, Robotics, Healthcare AI"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Country</label>
          <input
            className={inputClass}
            placeholder="e.g. United States"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className={labelClass}>Funding Stage</label>
          <input
            className={inputClass}
            placeholder="e.g. Seed, Series A, Series B"
            value={fundingStage}
            onChange={(e) => setFundingStage(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Description</label>
        <textarea
          className={inputClass}
          rows={3}
          placeholder="What does the company do? (optional — AI will research if left blank)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Additional Notes</label>
        <textarea
          className={inputClass}
          rows={2}
          placeholder="Anything else worth knowing (optional)"
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Upload Pitch Deck (PDF, optional)</label>
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-ink-200 px-3 py-2.5 text-sm text-ink-500 hover:border-ink-400">
          <Upload size={14} />
          {pitchDeckName ?? "Choose a PDF file"}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => setPitchDeckName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        <p className="flex items-start gap-1.5 text-xs text-ink-400">
          <ShieldAlert size={13} className="mt-0.5 shrink-0" />
          Prototype: pitch deck contents are not parsed or uploaded anywhere in this version. Do not
          upload confidential information without appropriate enterprise security controls.
        </p>
      </div>

      <Button type="submit" size="lg" disabled={!canSubmit} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
      {!canSubmit && (
        <p className="text-xs text-ink-400">Enter at least a company name or a website URL.</p>
      )}
    </form>
  );
}
