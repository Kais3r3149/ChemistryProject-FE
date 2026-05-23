"use client";

import { useState, useCallback } from "react";
import { Search, Loader2, AlertCircle, ShieldAlert, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  suggestDrugs,
  searchDrugConditions,
  recordSearch,
  type DrugSuggestItem,
  type ConditionResult,
} from "@/lib/api";
import { DrugInput } from "./drug-input";

const TYPE_CONFIG = {
  indication: {
    label: "Indication",
    icon: Heart,
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
  },
  toxicity: {
    label: "Toxicity",
    icon: ShieldAlert,
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300",
  },
} as const;

export function DrugConditionForm() {
  const [drugText, setDrugText] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<DrugSuggestItem | null>(null);
  const [activeType, setActiveType] = useState<"all" | "indication" | "toxicity">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ConditionResult[] | null>(null);
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

      const data = await searchDrugConditions(drug.id);
      setResults(data);
      recordSearch("condition", drug.name, data.length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch conditions");
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = drugText.trim().length >= 2 && !isLoading;

  const filtered = results
    ? activeType === "all"
      ? results
      : results.filter((r) => r.type === activeType)
    : null;

  const indicationCount = results?.filter((r) => r.type === "indication").length ?? 0;
  const toxicityCount = results?.filter((r) => r.type === "toxicity").length ?? 0;

  return (
    <div className="space-y-6">
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Drug Conditions</CardTitle>
          <CardDescription className="text-sm">
            View indications and toxicity information for a drug.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DrugInput
              id="drug-condition"
              label="Drug"
              placeholder="e.g., Metformin"
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
                  View Conditions
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results !== null && (
        <div className="space-y-4 animate-fade-in-up">
          {/* Filter tabs */}
          <div className="flex items-center gap-2">
            {(["all", "indication", "toxicity"] as const).map((type) => {
              const count =
                type === "all"
                  ? results.length
                  : type === "indication"
                  ? indicationCount
                  : toxicityCount;
              return (
                <button
                  key={type}
                  onClick={() => setActiveType(type)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                    activeType === type
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {type === "all" ? "All" : TYPE_CONFIG[type].label}
                  <span className={cn(
                    "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                    activeType === type ? "bg-background/20" : "bg-background/60",
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {filtered!.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-8 text-center text-muted-foreground">
                No {activeType === "all" ? "conditions" : activeType} found for this drug.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filtered!.map((item) => {
                const cfg = TYPE_CONFIG[item.type];
                const Icon = cfg.icon;
                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden"
                  >
                    <div className={cn("flex items-center gap-2 px-4 py-2.5", cfg.bg)}>
                      <Icon className={cn("h-3.5 w-3.5", cfg.text)} />
                      <span className={cn("text-xs font-semibold uppercase tracking-wide", cfg.text)}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
