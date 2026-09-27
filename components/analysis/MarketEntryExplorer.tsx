"use client";

import { useState } from "react";
import { Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMarketEntry } from "@/lib/useMarketEntry";
import { MarketOpportunityBody } from "./sections/MarketOpportunityBody";
import type { StartupInput, StartupSnapshot } from "@/lib/ai/schemas";

/**
 * On-demand "explore another market" tool beneath the pinned Japan
 * Opportunity tab. Runs one MarketEntryAgent call per submission — not part
 * of the main analysis pipeline, so it costs nothing unless someone
 * actually uses it (see lib/useMarketEntry.ts).
 */
export function MarketEntryExplorer({ input, snapshot }: { input: StartupInput; snapshot: StartupSnapshot }) {
  const [market, setMarket] = useState("");
  const { state, run } = useMarketEntry();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = market.trim();
    if (!trimmed) return;
    run(input, snapshot, trimmed);
  }

  return (
    <div className="space-y-5 border-t border-ink-100 pt-8">
      <div>
        <h3 className="flex items-center gap-2 text-base font-bold text-ink-950">
          <Globe2 size={16} className="text-signal-600" />
          Explore Another Market
        </h3>
        <p className="mt-1 text-sm text-ink-400">
          Japan is analyzed by default. Ask about any other country or region and get the same
          entry-strategy breakdown, generated live.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-signal-600 focus:outline-none focus:ring-1 focus:ring-signal-600"
          placeholder="e.g. South Korea, Germany, Brazil"
          value={market}
          onChange={(e) => setMarket(e.target.value)}
        />
        <Button type="submit" size="md" disabled={!market.trim() || state.status === "loading"}>
          Explore This Market
        </Button>
      </form>

      {state.status === "loading" && (
        <p className="text-sm text-ink-400">Analyzing {state.market}...</p>
      )}

      {state.status === "unavailable" && (
        <Card className="border-evidence-assumptionBg bg-evidence-assumptionBg/40">
          <CardContent className="p-4 text-sm text-ink-700">{state.notice}</CardContent>
        </Card>
      )}

      {state.status === "error" && (
        <Card className="border-red-100 bg-red-50/40">
          <CardContent className="p-4 text-sm text-ink-700">{state.error}</CardContent>
        </Card>
      )}

      {state.status === "success" && (
        <MarketOpportunityBody
          couldEnterLabel={`Could This Startup Enter ${state.result.market}?`}
          couldEnterText={state.result.couldEnterMarket}
          entryStrategyLabel={`Possible ${state.result.market} Entry Strategy`}
          beneficiaryIndustries={state.result.beneficiaryIndustries}
          potentialEnterpriseCustomers={state.result.potentialEnterpriseCustomers}
          potentialStrategicPartners={state.result.potentialStrategicPartners}
          localCompetition={state.result.localCompetition}
          localizationRequirements={state.result.localizationRequirements}
          regulatoryRequirements={state.result.regulatoryRequirements}
          distributionConsiderations={state.result.distributionConsiderations}
          pricingConsiderations={state.result.pricingConsiderations}
          enterpriseSalesConsiderations={state.result.enterpriseSalesConsiderations}
          languageConsiderations={state.result.languageConsiderations}
          technologyIntegrationConsiderations={state.result.technologyIntegrationConsiderations}
          entryStrategy={state.result.entryStrategy}
        />
      )}
    </div>
  );
}
