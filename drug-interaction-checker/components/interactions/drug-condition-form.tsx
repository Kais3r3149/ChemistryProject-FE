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
import { CardSkeleton } from "@/components/ui/skeleton-list";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Strip DrugBank inline references like [L40243], [A12345], [DB001] */
function stripRefs(text: string): string {
  return text.replace(/\[[A-Z]\d{4,6}\]/g, "").replace(/\s{2,}/g, " ").trim();
}

/**
 * Split text by **Section title** patterns, then render each chunk with
 * inline bold markers converted to <strong>.
 */
function FormatConditionText({ text }: { text: string }) {
  const clean = stripRefs(text);

  // Split on **Title** markers → produces alternating [before, title, after, title2, ...]
  const parts = clean.split(/\*\*([^*]+)\*\*/);

  // Build segments: [{heading?, body}]
  type Seg = { heading: string | null; body: string };
  const segments: Seg[] = [];
  let current: Seg = { heading: null, body: "" };

  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      // plain text
      current.body += parts[i];
    } else {
      // bold token — if it looks like a section heading (ends with sentence or is stand-alone)
      const token = parts[i].trim();
      const isHeading = /^[A-Z]/.test(token) && token.length > 3;
      if (isHeading && current.body.trim()) {
        segments.push({ ...current });
        current = { heading: token, body: "" };
      } else {
        // inline bold — wrap in marker
        current.body += `__BOLD__${token}__ENDBOLD__`;
      }
    }
  }
  if (current.body.trim() || current.heading) segments.push(current);

  // Render a body string with __BOLD__ markers into React nodes
  function renderBody(body: string) {
    const tokens = body.split(/(__BOLD__|__ENDBOLD__)/);
    const nodes: React.ReactNode[] = [];
    let bold = false;
    tokens.forEach((t, i) => {
      if (t === "__BOLD__") { bold = true; return; }
      if (t === "__ENDBOLD__") { bold = false; return; }
      if (!t) return;
      nodes.push(bold ? <strong key={i} className="font-semibold text-foreground">{t}</strong> : t);
    });
    return nodes;
  }

  if (segments.length <= 1 && !segments[0]?.heading) {
    // No sections — just render plain paragraphs split by ". "
    const sentences = clean.split(/(?<=\.)\s+/);
    return (
      <div className="space-y-1.5 text-sm text-foreground/90 leading-relaxed">
        {sentences.map((s, i) => s.trim() && <p key={i}>{s.trim()}</p>)}
      </div>
    );
  }

  return (
    <div className="space-y-4 text-sm text-foreground/90">
      {segments.map((seg, i) => (
        <div key={i} className={seg.heading ? "space-y-1" : undefined}>
          {seg.heading && (
            <p className="font-semibold text-foreground/80 text-xs uppercase tracking-wide">
              {seg.heading}
            </p>
          )}
          {seg.body.trim() && (
            <p className="leading-relaxed">{renderBody(seg.body.trim())}</p>
          )}
        </div>
      ))}
    </div>
  );
}

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

      {isLoading && (
        <div className="space-y-3">
          {[4, 3, 4].map((lines, i) => <CardSkeleton key={i} lines={lines} />)}
        </div>
      )}

      {!isLoading && results !== null && (
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
                    <div className="px-4 py-4">
                      <FormatConditionText text={item.text} />
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
