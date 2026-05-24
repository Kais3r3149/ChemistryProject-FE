"use client";

import { useState } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { searchDrugResponse, recordSearch, type DrugResponseResult } from "@/lib/api";
import { TableSkeleton } from "@/components/ui/skeleton-list";

const PAGE_SIZE = 20;

export function DrugResponseForm() {
  const [drug, setDrug] = useState("");
  const [cellLine, setCellLine] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DrugResponseResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [submittedDrug, setSubmittedDrug] = useState("");

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const doSearch = async (d: string, cl: string, p: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await searchDrugResponse(d, cl || undefined, p, PAGE_SIZE);
      setResults(res.items);
      setTotal(res.total);
      if (p === 1) {
        await recordSearch("drug-response", d, res.total);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drug.trim()) return;
    setPage(1);
    setSubmittedDrug(drug.trim());
    await doSearch(drug.trim(), cellLine.trim(), 1);
  };

  const handlePage = async (newPage: number) => {
    setPage(newPage);
    await doSearch(submittedDrug, cellLine.trim(), newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Search drug sensitivity (IC50 / AUC)</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="drug">Drug name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="drug"
                    placeholder="e.g., Erlotinib, Gefitinib"
                    value={drug}
                    onChange={(e) => setDrug(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cellLine">Cell line <span className="text-muted-foreground/60 font-normal">(optional)</span></Label>
                <Input
                  id="cellLine"
                  placeholder="e.g., MCF7, A549"
                  value={cellLine}
                  onChange={(e) => setCellLine(e.target.value)}
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading || !drug.trim()}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Searching...</>
              ) : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && <TableSkeleton rows={6} cols={5} />}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 px-1">{error}</p>
      )}

      {!isLoading && submittedDrug && total === 0 && !error && (
        <div className="rounded-xl border border-border/60 bg-card py-14 text-center">
          <p className="text-sm font-medium text-foreground">No results found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try a different drug name or remove the cell line filter.
          </p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Results for <span className="text-primary-600 dark:text-primary-400">{submittedDrug}</span>
                {cellLine && <span className="text-muted-foreground font-normal"> · {cellLine}</span>}
              </CardTitle>
              <span className="text-xs text-muted-foreground tabular-nums">
                {total.toLocaleString()} records
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Drug</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Cell Line</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Tissue</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Cancer Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Metric</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {results.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{item.drug.name}</td>
                      <td className="px-4 py-3 text-foreground">{item.cellLine.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.cellLine.tissueName ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.cellLine.cancerType ?? "—"}</td>
                      <td className="px-4 py-3 tabular-nums font-mono text-foreground">
                        {item.value.toFixed(4)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium
                          ${item.metric === "IC50"
                            ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400"
                            : "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950/30 dark:text-violet-400"
                          }`}>
                          {item.metric}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
                <span className="text-xs text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={page <= 1 || isLoading} onClick={() => handlePage(page - 1)}>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={page >= totalPages || isLoading} onClick={() => handlePage(page + 1)}>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
