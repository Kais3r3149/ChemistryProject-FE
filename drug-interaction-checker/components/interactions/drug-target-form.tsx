"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, Target, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  suggestDrugs,
  searchDti,
  recordSearch,
  type DrugSuggestItem,
  type DtiDisplayResult,
} from "@/lib/api";
import { DrugInput } from "./drug-input";

export function DrugTargetForm() {
  const [drugText, setDrugText] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<DrugSuggestItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DtiDisplayResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrugChange = useCallback((value: string) => {
    setDrugText(value);
    setSelectedDrug(null);
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setResults(null);

    try {
      let drug = selectedDrug;
      if (!drug && drugText.trim().length >= 2) {
        const suggestions = await suggestDrugs(drugText.trim(), 1);
        drug = suggestions[0] ?? null;
      }

      if (!drug) {
        setError("Could not find the drug. Please type a valid name and select from the dropdown.");
        return;
      }

      setSelectedDrug(drug);
      setDrugText(drug.name);

      const data = await searchDti(drug.id);
      setResults(data);
      recordSearch("dti", drug.name, data.length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch targets");
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = drugText.trim().length >= 2 && !isLoading;

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Drug-Target Interactions</CardTitle>
          <CardDescription className="text-sm">
            View protein targets for a drug from DrugBank.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DrugInput
              id="dti-drug"
              label="Drug"
              placeholder="e.g., Aspirin"
              value={drugText}
              selectedDrug={selectedDrug}
              onChange={handleDrugChange}
              onSelect={setSelectedDrug}
            />

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full sm:w-auto font-semibold"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Targets
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results !== null && (
        <div className="space-y-3 animate-fade-in-up">
          <h3 className="text-lg font-bold text-foreground">
            Targets
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/30 text-xs font-bold text-blue-700 dark:text-blue-300">
              {results.length}
            </span>
          </h3>

          {results.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-8 text-center text-muted-foreground">
                No targets found for this drug.
              </CardContent>
            </Card>
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
              {results.map((item) => (
                <div key={item.id} className="flex items-start gap-3 px-4 py-3.5">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                    <Target className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{item.targetName}</span>
                      {item.uniprotId && (
                        <a
                          href={`https://www.uniprot.org/uniprot/${item.uniprotId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {item.uniprotId}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                    {item.knownAction && (
                      <p className="text-xs text-muted-foreground">
                        Action: <span className="font-medium text-foreground">{item.knownAction}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
