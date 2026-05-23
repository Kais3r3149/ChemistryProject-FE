"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, ArrowRightLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InteractionResultCard } from "@/components/dashboard/interaction-result-card";
import {
  suggestDrugs,
  searchDdi,
  recordSearch,
  type DrugSuggestItem,
  type DdiDisplayResult,
} from "@/lib/api";
import { DrugInput } from "./drug-input";

// ── Main Form ──

export function DrugDrugForm() {
  const [drugAText, setDrugAText] = useState("");
  const [drugBText, setDrugBText] = useState("");
  const [selectedDrugA, setSelectedDrugA] = useState<DrugSuggestItem | null>(
    null,
  );
  const [selectedDrugB, setSelectedDrugB] = useState<DrugSuggestItem | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DdiDisplayResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrugAChange = useCallback((value: string) => {
    setDrugAText(value);
    setSelectedDrugA(null);
    setError(null);
  }, []);

  const handleDrugBChange = useCallback((value: string) => {
    setDrugBText(value);
    setSelectedDrugB(null);
    setError(null);
  }, []);

  const resolveDrug = async (
    text: string,
    selected: DrugSuggestItem | null,
  ): Promise<DrugSuggestItem | null> => {
    if (selected) return selected;
    if (!text.trim()) return null;

    const results = await suggestDrugs(text.trim(), 1);
    if (results.length === 0) return null;

    // Auto-select if name matches exactly (case-insensitive)
    const match = results.find(
      (r) => r.name.toLowerCase() === text.trim().toLowerCase(),
    );
    return match ?? results[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setResults(null);

    try {
      // Auto-resolve typed text to drug IDs if not yet selected
      const drugA = await resolveDrug(drugAText, selectedDrugA);
      const drugB = await resolveDrug(drugBText, selectedDrugB);

      if (!drugA || !drugB) {
        setError(
          "Could not find one or both drugs. Please type a valid drug name and select from the dropdown.",
        );
        setIsLoading(false);
        return;
      }

      // Update selections for UI consistency
      if (!selectedDrugA) {
        setSelectedDrugA(drugA);
        setDrugAText(drugA.name);
      }
      if (!selectedDrugB) {
        setSelectedDrugB(drugB);
        setDrugBText(drugB.name);
      }

      if (drugA.id === drugB.id) {
        setError("Please select two different drugs.");
        setIsLoading(false);
        return;
      }

      const data = await searchDdi(drugA.id, drugB.id);
      setResults(data);
      recordSearch("ddi", `${drugA.name} + ${drugB.name}`, data.length);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to search interactions";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = () => {
    setDrugAText(drugBText);
    setDrugBText(drugAText);
    setSelectedDrugA(selectedDrugB);
    setSelectedDrugB(selectedDrugA);
  };

  const canSubmit =
    drugAText.trim().length >= 2 && drugBText.trim().length >= 2 && !isLoading;

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Drug-Drug Interaction</CardTitle>
          <CardDescription className="text-sm">
            Enter two drug names to check for known interactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr,auto,1fr] sm:items-end">
              <DrugInput
                id="drugA"
                label="Drug A"
                placeholder="e.g., Aspirin"
                value={drugAText}
                selectedDrug={selectedDrugA}
                onChange={handleDrugAChange}
                onSelect={setSelectedDrugA}
              />

              {/* Swap button */}
              <div className="flex justify-center sm:pb-0.5">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full h-9 w-9 border-dashed"
                  onClick={handleSwap}
                  aria-label="Swap drugs"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              <DrugInput
                id="drugB"
                label="Drug B"
                placeholder="e.g., Warfarin"
                value={drugBText}
                selectedDrug={selectedDrugB}
                onChange={handleDrugBChange}
                onSelect={setSelectedDrugB}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-700 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full sm:w-auto glow-primary font-semibold"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Check Interaction
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {results !== null && (
        <div className="space-y-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">
              Results
              <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950/30 text-xs font-bold text-primary-700 dark:text-primary-300">
                {results.length}
              </span>
            </h3>
          </div>
          {results.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-8 text-center text-muted-foreground">
                No interactions found between these drugs.
              </CardContent>
            </Card>
          ) : (
            results.map((result, index) => (
              <InteractionResultCard key={index} {...result} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
