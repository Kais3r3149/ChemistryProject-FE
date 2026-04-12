"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, Loader2, Sparkles, ArrowRightLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  type DrugSuggestItem,
  type DdiDisplayResult,
} from "@/lib/api";

// ── Debounce hook ──

function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ── Drug Autocomplete Input ──

interface DrugInputProps {
  readonly id: string;
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly selectedDrug: DrugSuggestItem | null;
  readonly onChange: (value: string) => void;
  readonly onSelect: (drug: DrugSuggestItem) => void;
}

function DrugInput({
  id,
  label,
  placeholder,
  value,
  selectedDrug,
  onChange,
  onSelect,
}: DrugInputProps) {
  const [suggestions, setSuggestions] = useState<DrugSuggestItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(value, 300);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2 || selectedDrug !== null) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    setIsLoadingSuggestions(true);

    suggestDrugs(debouncedQuery, 8)
      .then((results) => {
        if (!cancelled) {
          setSuggestions(results);
          setIsOpen(results.length > 0);
        }
      })
      .catch(() => {
        if (!cancelled) setSuggestions([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingSuggestions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, selectedDrug]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const handleSelect = useCallback(
    (drug: DrugSuggestItem) => {
      onSelect(drug);
      onChange(drug.name);
      setIsOpen(false);
      setSuggestions([]);
    },
    [onSelect, onChange],
  );

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label htmlFor={id} className="font-medium">
        {label}
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {isLoadingSuggestions && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
        )}
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          className="pl-9 h-11"
          autoComplete="off"
        />
        {/* Dropdown suggestions */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((drug) => (
              <button
                key={drug.id}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                onClick={() => handleSelect(drug)}
              >
                <span className="font-medium">{drug.name}</span>
                {drug.drugbankId && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    {drug.drugbankId}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">
                Check Drug-Drug Interaction
              </CardTitle>
              <CardDescription>
                Enter two drug names to check for potential interactions.
              </CardDescription>
            </div>
          </div>
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
