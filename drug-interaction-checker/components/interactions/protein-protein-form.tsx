"use client";

import { useState } from "react";
import { Search, Loader2, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { searchPpi, recordSearch, type PpiResult } from "@/lib/api";

const PAGE_SIZE = 20;

export function ProteinProteinForm() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<PpiResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [submittedQuery, setSubmittedQuery] = useState("");

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const doSearch = async (q: string, p: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await searchPpi(q, p, PAGE_SIZE);
      setResults(res.items);
      setTotal(res.total);
      if (p === 1) {
        await recordSearch("ppi", q, res.total);
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
    if (!query.trim()) return;
    setPage(1);
    setSubmittedQuery(query.trim());
    await doSearch(query.trim(), 1);
  };

  const handlePage = async (newPage: number) => {
    setPage(newPage);
    await doSearch(submittedQuery, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Search by protein name or Ensembl ID</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="e.g., ENSG00000000005, TP53"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" disabled={isLoading || !query.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 px-1">{error}</p>
      )}

      {!isLoading && submittedQuery && total === 0 && !error && (
        <div className="rounded-xl border border-border/60 bg-card py-14 text-center">
          <p className="text-sm font-medium text-foreground">No interactions found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Try a different Ensembl ID or protein name.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Results for <span className="text-primary-600 dark:text-primary-400">{submittedQuery}</span>
              </CardTitle>
              <span className="text-xs text-muted-foreground tabular-nums">
                {total.toLocaleString()} interactions
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Protein A</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Protein B</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {results.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {item.proteinA.name ?? item.proteinA.uniprotId}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">
                          <a
                            href={`https://www.ensembl.org/id/${item.proteinA.uniprotId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            {item.proteinA.uniprotId}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {item.proteinB.name ?? item.proteinB.uniprotId}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">
                          <a
                            href={`https://www.ensembl.org/id/${item.proteinB.uniprotId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            {item.proteinB.uniprotId}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {item.score != null ? item.score.toFixed(3) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md border border-border/60 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {item.source}
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
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1 || isLoading}
                    onClick={() => handlePage(page - 1)}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages || isLoading}
                    onClick={() => handlePage(page + 1)}
                  >
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
