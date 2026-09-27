import { Card, CardContent } from "@/components/ui/card";
import { SectionShell, SubHeading, BulletList } from "@/components/analysis/SectionShell";
import { CompanyEvidenceTag } from "../CompanyEvidenceTag";
import type { CompanyIcMemo } from "@/lib/ai/company-schemas";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 border-b border-ink-100 pb-4 last:border-0 last:pb-0">
      <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">{title}</div>
      {children}
    </div>
  );
}

export function CompanyIcMemoSection({ memo }: { memo: CompanyIcMemo }) {
  return (
    <SectionShell title="Investment Committee Memo" description="The IC Chairman's final synthesis of all ten specialists' independent research.">
      <Card>
        <CardContent className="space-y-4 p-6">
          <Section title="Executive Summary">
            <p className="text-sm leading-relaxed text-ink-800">{memo.executiveSummary}</p>
          </Section>
          <Section title="Investment Thesis">
            <p className="text-sm leading-relaxed text-ink-800">{memo.investmentThesis}</p>
          </Section>
          <div className="grid gap-4 sm:grid-cols-2">
            <Section title="Business Quality">
              <p className="text-sm text-ink-700">{memo.businessQualitySummary}</p>
            </Section>
            <Section title="Financial Quality">
              <p className="text-sm text-ink-700">{memo.financialQualitySummary}</p>
            </Section>
            <Section title="Valuation">
              <p className="text-sm text-ink-700">{memo.valuationSummary}</p>
            </Section>
            <Section title="Management">
              <p className="text-sm text-ink-700">{memo.managementSummary}</p>
            </Section>
            <Section title="Moat">
              <p className="text-sm text-ink-700">{memo.moatSummary}</p>
            </Section>
            <Section title="Institutional Activity">
              <p className="text-sm text-ink-700">{memo.institutionalActivitySummary}</p>
            </Section>
          </div>

          <Section title="Catalysts">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-medium text-tier-verified">Positive</div>
                <div className="space-y-1.5">
                  {memo.positiveCatalysts.map((c, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 text-sm">
                      <span className="text-ink-700">
                        {c.description} <span className="text-ink-400">({c.timing})</span>
                      </span>
                      <CompanyEvidenceTag tier={c.confidence} className="shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-tier-unverified">Negative</div>
                <div className="space-y-1.5">
                  {memo.negativeCatalysts.map((c, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 text-sm">
                      <span className="text-ink-700">
                        {c.description} <span className="text-ink-400">({c.timing})</span>
                      </span>
                      <CompanyEvidenceTag tier={c.confidence} className="shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          <Section title="Risks">
            <BulletList items={memo.risks} />
          </Section>

          <div className="grid gap-3 sm:grid-cols-3">
            <Section title="Bull Case">
              <p className="text-sm text-ink-700">{memo.bullCaseSummary}</p>
            </Section>
            <Section title="Base Case">
              <p className="text-sm text-ink-700">{memo.baseCaseSummary}</p>
            </Section>
            <Section title="Bear Case">
              <p className="text-sm text-ink-700">{memo.bearCaseSummary}</p>
            </Section>
          </div>

          <Section title="Market Expectations">
            <p className="text-sm text-ink-700">{memo.marketExpectationsSummary}</p>
          </Section>

          <Section title="What Would Change the Thesis">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs font-medium text-tier-verified">Upgrade Conditions</div>
                <BulletList items={memo.upgradeConditions} />
              </div>
              <div>
                <div className="mb-1 text-xs font-medium text-tier-unverified">Downgrade Conditions</div>
                <BulletList items={memo.downgradeConditions} />
              </div>
            </div>
          </Section>

          <Section title="Critical Unknowns">
            <BulletList items={memo.criticalUnknowns} />
          </Section>

          <Section title="Sources">
            <ul className="space-y-1.5">
              {memo.sources.map((s, i) => (
                <li key={i} className="text-xs text-ink-500">
                  <span className="font-medium text-ink-700">{s.label}</span>
                  {s.date && <span> · {s.date}</span>}
                  {s.url && (
                    <>
                      {" · "}
                      <a href={s.url} target="_blank" rel="noreferrer" className="text-signal-600 hover:underline">
                        source
                      </a>
                    </>
                  )}
                  <div>{s.claimSupported}</div>
                </li>
              ))}
            </ul>
          </Section>

          <p className="pt-2 text-xs text-ink-400">Generated {new Date(memo.generatedAt).toLocaleString()}</p>
        </CardContent>
      </Card>
    </SectionShell>
  );
}
