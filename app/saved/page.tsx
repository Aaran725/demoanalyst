"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, BookMarked } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSavedAnalyses, deleteAnalysis } from "@/lib/storage";
import type { FullAnalysis } from "@/lib/ai/schemas";

export default function SavedResearchPage() {
  const [saved, setSaved] = useState<FullAnalysis[]>([]);

  useEffect(() => {
    setSaved(getSavedAnalyses());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookMarked className="text-signal-600" size={22} />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">Saved Research</h1>
          <p className="text-sm text-ink-500">
            Saved in this browser only (no account system in this prototype). Save any analysis from
            its IC Memo tab.
          </p>
        </div>
      </div>

      {saved.length === 0 ? (
        <Card>
          <CardContent className="space-y-3 p-8 text-center">
            <p className="text-sm text-ink-500">No saved analyses yet.</p>
            <Button asChild size="sm">
              <Link href="/analyze">Analyze a Startup</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {saved.map((a) => (
            <Card key={a.id}>
              <CardContent className="flex items-center justify-between gap-3 p-5">
                <Link href={`/analyze/${a.id}`} className="min-w-0">
                  <div className="truncate font-medium text-ink-900">{a.snapshot.companyName}</div>
                  <div className="truncate text-sm text-ink-400">{a.snapshot.sector}</div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    deleteAnalysis(a.id);
                    setSaved(getSavedAnalyses());
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
