"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, AlertCircle, Utensils } from "lucide-react";
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
  searchFoodInteractions,
  recordSearch,
  type DrugSuggestItem,
  type FoodInteractionResult,
} from "@/lib/api";
import { DrugInput } from "./drug-input";
import { ResultSkeleton } from "@/components/ui/skeleton-list";

export function DrugFoodForm() {
  const [drugText, setDrugText] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<DrugSuggestItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<FoodInteractionResult[] | null>(null);
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

      const data = await searchFoodInteractions(drug.id);
      setResults(data);
      recordSearch("food", drug.name, data.length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to search interactions");
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = drugText.trim().length >= 2 && !isLoading;

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Drug-Food Interactions</CardTitle>
          <CardDescription className="text-sm">
            Find known food, beverage, and herb interactions for a drug.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DrugInput
              id="drug-food"
              label="Drug"
              placeholder="e.g., Warfarin"
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
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Find Food Interactions
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && <ResultSkeleton rows={5} />}

      {!isLoading && results !== null && (
        <div className="space-y-3 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">
              Results
              <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/30 text-xs font-bold text-green-700 dark:text-green-300">
                {results.length}
              </span>
            </h3>
          </div>

          {results.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-8 text-center text-muted-foreground">
                No food interactions found for this drug.
              </CardContent>
            </Card>
          ) : (
            <div className="divide-y divide-border rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
              {results.map((item) => (
                <div key={item.id} className="flex items-start gap-3 px-4 py-3.5">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">
                    <Utensils className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{item.interaction}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
