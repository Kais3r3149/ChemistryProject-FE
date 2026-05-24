"use client";

import { useState, useCallback, useRef } from "react";
import {
  Search, Loader2, AlertCircle, X, ChevronDown, ChevronUp,
  ShieldAlert, Shield, Info, CheckCircle2, Pill, Utensils, ClipboardList, Target, FileText,
} from "lucide-react";
import { fetchFdaLabel, type FdaLabel } from "@/lib/openfda";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import {
  suggestDrugs,
  searchDdiMulti,
  searchFoodInteractions,
  searchDrugConditions,
  searchDti,
  searchDrugSideEffects,
  recordSearch,
  type DrugSuggestItem,
  type DdiDisplayResult,
  type FoodInteractionResult,
  type ConditionResult,
  type DtiDisplayResult,
  type SideEffectResult,
} from "@/lib/api";

// ── FDA text renderer ────────────────────────────────────────────────────────
function FdaTextBlock({ text }: { text: string }) {
  // Split on double newlines (paragraphs) or single newlines (line breaks)
  const blocks = text.split(/\n\n+/).map(b => b.trim()).filter(Boolean);

  return (
    <div className="space-y-2.5">
      {blocks.map((block, i) => {
        // Numbered sub-section heading: "1.1 Title" or "5.2 Something"
        const isHeading = /^\d+\.\d+\s+[A-Z]/.test(block);
        if (isHeading) {
          return (
            <p key={i} className="text-xs font-bold text-foreground/80 uppercase tracking-wide mt-4 mb-1 border-b border-border/30 pb-1">
              {block}
            </p>
          );
        }

        // Lines within a block (single \n separators)
        const lines = block.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length === 1) {
          const isBullet = /^[\u2022\u2013\-]\s/.test(lines[0]);
          return isBullet
            ? <p key={i} className="text-sm text-foreground/80 leading-relaxed pl-3 relative before:absolute before:left-0 before:content-['•']">{lines[0].replace(/^[\u2022\u2013\-]\s/, "")}</p>
            : <p key={i} className="text-sm text-foreground/80 leading-relaxed">{lines[0]}</p>;
        }

        return (
          <div key={i} className="space-y-1">
            {lines.map((line, j) => {
              const isBullet = /^[\u2022\u2013\-]\s/.test(line);
              return isBullet
                ? <p key={j} className="text-sm text-foreground/80 leading-relaxed pl-3 relative before:absolute before:left-0 before:content-['•']">{line.replace(/^[\u2022\u2013\-]\s/, "")}</p>
                : <p key={j} className="text-sm text-foreground/80 leading-relaxed">{line}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Severity UI config ───────────────────────────────────────────────────────
const SEV_CONFIG = {
  danger: {
    label: "Major",
    icon: ShieldAlert,
    bar: "bg-red-500",
    badge: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400",
    card: "border-red-200/60 dark:border-red-800/40",
  },
  warning: {
    label: "Moderate",
    icon: Shield,
    bar: "bg-amber-500",
    badge: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400",
    card: "border-amber-200/60 dark:border-amber-800/40",
  },
  safe: {
    label: "Minor",
    icon: Info,
    bar: "bg-blue-400",
    badge: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400",
    card: "border-blue-200/60 dark:border-blue-800/40",
  },
} as const;

// ── Per-drug detail panel ────────────────────────────────────────────────────
interface DrugDetail {
  food: FoodInteractionResult[];
  conditions: ConditionResult[];
  targets: DtiDisplayResult[];
  sideEffects: SideEffectResult[];
  loading: boolean;
}

function DrugDetailPanel({ drug, detail }: { drug: DrugSuggestItem; detail: DrugDetail }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"food" | "conditions" | "sideEffects" | "fdaLabel" | "targets">("food");
  const [fdaLabel, setFdaLabel] = useState<FdaLabel | null>(null);
  const [fdaLoading, setFdaLoading] = useState(false);

  const loadFda = async () => {
    if (fdaLabel !== null || fdaLoading) return;
    setFdaLoading(true);
    try {
      const label = await fetchFdaLabel(drug.name);
      setFdaLabel(label);
    } finally {
      setFdaLoading(false);
    }
  };

  const handleTabClick = (key: typeof activeTab) => {
    setActiveTab(key);
    if (key === "sideEffects" || key === "fdaLabel") loadFda();
  };

  const tabs = [
    { key: "food",       label: "Food",        icon: Utensils,     count: detail.food.length },
    { key: "conditions", label: "Conditions",  icon: ClipboardList, count: detail.conditions.length },
    { key: "sideEffects",label: "Side Effects", icon: ShieldAlert,  count: detail.sideEffects.length },
    { key: "fdaLabel",   label: "FDA Label",   icon: FileText,     count: -1 },
    { key: "targets",    label: "Targets",     icon: Target,       count: detail.targets.length },
  ] as const;

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-primary-100 dark:bg-primary-950/40 flex items-center justify-center">
            <Pill className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="font-semibold text-sm text-foreground">{drug.name}</span>
          {drug.drugbankId && (
            <span className="text-xs text-muted-foreground font-mono">{drug.drugbankId}</span>
          )}
        </div>
        {detail.loading
          ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          : open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />
        }
      </button>

      {open && !detail.loading && (
        <div className="border-t border-border/40">
          {/* Tab bar */}
          <div className="flex border-b border-border/40 px-4 gap-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => handleTabClick(t.key as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors",
                    activeTab === t.key
                      ? "border-primary-500 text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                  {t.count >= 0 && (
                    <span className="ml-0.5 text-[10px] font-bold text-muted-foreground/70">
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="px-4 py-3 space-y-2 max-h-64 overflow-y-auto">
            {activeTab === "food" && (
              detail.food.length === 0
                ? <p className="text-sm text-muted-foreground py-4 text-center">No food interactions found.</p>
                : detail.food.map((f) => (
                  <div key={f.id} className="text-sm text-foreground/80 border-l-2 border-amber-400 pl-3 py-0.5">
                    {f.interaction}
                  </div>
                ))
            )}
            {activeTab === "conditions" && (
              detail.conditions.length === 0
                ? <p className="text-sm text-muted-foreground py-4 text-center">No condition data found.</p>
                : detail.conditions.map((c) => (
                  <div key={c.id} className="text-sm">
                    <span className={cn(
                      "inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 rounded mr-2",
                      c.type === "indication"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                        : "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400"
                    )}>
                      {c.type}
                    </span>
                    <span className="text-foreground/80">{c.text.slice(0, 200)}{c.text.length > 200 ? "…" : ""}</span>
                  </div>
                ))
            )}
            {activeTab === "sideEffects" && (
              <div className="space-y-4">
                {/* openFDA adverse reactions */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide">Adverse Reactions</span>
                    <span className="text-[10px] text-muted-foreground">(FDA Label)</span>
                  </div>
                  {fdaLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading from openFDA…
                    </div>
                  )}
                  {!fdaLoading && fdaLabel && (
                    fdaLabel.adverseReactions
                      ? <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">{fdaLabel.adverseReactions}</p>
                      : <p className="text-sm text-muted-foreground">No adverse reactions data in FDA label.</p>
                  )}
                  {!fdaLoading && !fdaLabel && (
                    <p className="text-sm text-muted-foreground">No FDA label data found for this drug.</p>
                  )}
                </div>
                {/* SIDER tags */}
                {detail.sideEffects.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wide">Known Side Effects</span>
                      <span className="text-[10px] text-muted-foreground">(SIDER 4.1 · {detail.sideEffects.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {detail.sideEffects.map((s) => (
                        <span key={s.id} className="inline-block rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 text-xs text-foreground/80">
                          {s.effectName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === "fdaLabel" && (
              <div className="space-y-6">
                {fdaLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading FDA label…
                  </div>
                )}
                {!fdaLoading && !fdaLabel && (
                  <p className="text-sm text-muted-foreground py-4 text-center">No FDA label found for this drug.</p>
                )}
                {!fdaLoading && fdaLabel && (() => {
                  const groups: { groupTitle: string; sections: { title: string; text: string | null; color: string; bg: string }[] }[] = [
                    {
                      groupTitle: "Overview",
                      sections: [
                        { title: "Description",           text: fdaLabel.description,         color: "border-sky-400",    bg: "bg-sky-50/50 dark:bg-sky-950/10" },
                        { title: "Recent Major Changes",  text: fdaLabel.recentMajorChanges,  color: "border-yellow-400", bg: "bg-yellow-50/50 dark:bg-yellow-950/10" },
                      ],
                    },
                    {
                      groupTitle: "Usage",
                      sections: [
                        { title: "Indications & Usage",     text: fdaLabel.indicationsAndUsage,     color: "border-blue-400", bg: "bg-blue-50/50 dark:bg-blue-950/10" },
                        { title: "Dosage & Administration", text: fdaLabel.dosageAndAdministration, color: "border-cyan-400", bg: "bg-cyan-50/50 dark:bg-cyan-950/10" },
                      ],
                    },
                    {
                      groupTitle: "Safety",
                      sections: [
                        { title: "Boxed Warning",     text: fdaLabel.boxedWarning,     color: "border-red-400",    bg: "bg-red-50/50 dark:bg-red-950/10" },
                        { title: "Contraindications", text: fdaLabel.contraindications, color: "border-purple-400", bg: "bg-purple-50/50 dark:bg-purple-950/10" },
                        { title: "Warnings",          text: fdaLabel.warnings,         color: "border-orange-400", bg: "bg-orange-50/50 dark:bg-orange-950/10" },
                        { title: "Adverse Reactions", text: fdaLabel.adverseReactions,  color: "border-rose-400",   bg: "bg-rose-50/50 dark:bg-rose-950/10" },
                        { title: "Overdosage",        text: fdaLabel.overdosage,       color: "border-red-600",    bg: "bg-red-100/50 dark:bg-red-950/20" },
                      ],
                    },
                    {
                      groupTitle: "Pharmacology",
                      sections: [
                        { title: "Mechanism of Action",   text: fdaLabel.mechanismOfAction,    color: "border-indigo-400", bg: "bg-indigo-50/50 dark:bg-indigo-950/10" },
                        { title: "Pharmacokinetics",      text: fdaLabel.pharmacokinetics,     color: "border-violet-400", bg: "bg-violet-50/50 dark:bg-violet-950/10" },
                        { title: "Clinical Pharmacology", text: fdaLabel.clinicalPharmacology, color: "border-slate-400",  bg: "bg-slate-50/50 dark:bg-slate-950/10" },
                      ],
                    },
                    {
                      groupTitle: "Special Populations",
                      sections: [
                        { title: "Pregnancy",       text: fdaLabel.pregnancy,      color: "border-pink-400",  bg: "bg-pink-50/50 dark:bg-pink-950/10" },
                        { title: "Nursing Mothers", text: fdaLabel.nursingMothers, color: "border-pink-300",  bg: "bg-pink-50/30 dark:bg-pink-950/10" },
                        { title: "Pediatric Use",   text: fdaLabel.pediatricUse,   color: "border-green-400", bg: "bg-green-50/50 dark:bg-green-950/10" },
                        { title: "Geriatric Use",   text: fdaLabel.geriatricUse,   color: "border-teal-400",  bg: "bg-teal-50/50 dark:bg-teal-950/10" },
                      ],
                    },
                    {
                      groupTitle: "Interactions",
                      sections: [
                        { title: "Drug Interactions", text: fdaLabel.drugInteractions, color: "border-amber-400", bg: "bg-amber-50/50 dark:bg-amber-950/10" },
                      ],
                    },
                    {
                      groupTitle: "Lab & Monitoring",
                      sections: [
                        { title: "Laboratory Tests",               text: fdaLabel.laboratoryTests,              color: "border-lime-400",   bg: "bg-lime-50/50 dark:bg-lime-950/10" },
                        { title: "Carcinogenesis & Mutagenesis",   text: fdaLabel.carcinogenesisAndMutagenesis, color: "border-orange-300", bg: "bg-orange-50/30 dark:bg-orange-950/10" },
                      ],
                    },
                    {
                      groupTitle: "Patient Information",
                      sections: [
                        { title: "Patient Counseling Information", text: fdaLabel.patientCounselingInformation, color: "border-emerald-400", bg: "bg-emerald-50/50 dark:bg-emerald-950/10" },
                      ],
                    },
                    {
                      groupTitle: "Supply & Storage",
                      sections: [
                        { title: "How Supplied",        text: fdaLabel.howSupplied,       color: "border-zinc-400", bg: "bg-zinc-50/50 dark:bg-zinc-950/10" },
                        { title: "Storage & Handling",  text: fdaLabel.storageAndHandling, color: "border-zinc-300", bg: "bg-zinc-50/30 dark:bg-zinc-950/10" },
                      ],
                    },
                  ];

                  const visibleGroups = groups.map(g => ({
                    ...g,
                    sections: g.sections.filter(s => s.text),
                  })).filter(g => g.sections.length > 0);

                  if (visibleGroups.length === 0) {
                    return <p className="text-sm text-muted-foreground py-4 text-center">No detailed label data available.</p>;
                  }

                  return visibleGroups.map(group => (
                    <div key={group.groupTitle}>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-3 px-1">{group.groupTitle}</p>
                      <div className="space-y-3">
                        {group.sections.map(section => (
                          <div key={section.title} className={cn("rounded-lg border-l-4 p-4", section.color, section.bg)}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-foreground uppercase tracking-wide">{section.title}</span>
                              <span className="text-[10px] text-muted-foreground border border-border/40 rounded px-1.5 py-0.5">FDA</span>
                            </div>
                            <FdaTextBlock text={section.text!} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
            {activeTab === "targets" && (
              detail.targets.length === 0
                ? <p className="text-sm text-muted-foreground py-4 text-center">No target data found.</p>
                : detail.targets.map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-sm py-0.5">
                    <span className="font-medium text-foreground">{t.targetName}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {t.uniprotId && <span className="font-mono">{t.uniprotId}</span>}
                      {t.knownAction && (
                        <span className="border border-border/60 rounded px-1.5 py-0.5">{t.knownAction}</span>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Highlight matching text in suggestions ──
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase().trim());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-sm px-0.5 not-italic font-semibold">
        {text.slice(idx, idx + query.trim().length)}
      </mark>
      {text.slice(idx + query.trim().length)}
    </span>
  );
}

// ── Main Form ──

export function DrugDrugForm() {
  const [inputText, setInputText] = useState("");
  const [suggestions, setSuggestions] = useState<DrugSuggestItem[]>([]);
  const [showSug, setShowSug] = useState(false);
  const [basket, setBasket] = useState<DrugSuggestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [ddiResults, setDdiResults] = useState<DdiDisplayResult[]>([]);
  const [details, setDetails] = useState<Record<number, DrugDetail>>({});
  const [error, setError] = useState<string | null>(null);

  // Autocomplete with debounce to prevent race conditions
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleInput = useCallback((val: string) => {
    setInputText(val);
    if (val.trim().length < 2) { setSuggestions([]); setShowSug(false); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const s = await suggestDrugs(val.trim(), 8);
      setSuggestions(s);
      setShowSug(s.length > 0);
    }, 200);
  }, []);

  const addToBasket = (drug: DrugSuggestItem) => {
    if (basket.find((d) => d.id === drug.id)) return;
    setBasket((prev) => [...prev, drug]);
    setInputText("");
    setSuggestions([]);
    setShowSug(false);
    setChecked(false);
    setError(null);
  };

  const removeFromBasket = (id: number) => {
    setBasket((prev) => prev.filter((d) => d.id !== id));
    setChecked(false);
  };

  const handleCheck = async () => {
    if (basket.length < 2) { setError("Add at least 2 drugs to check."); return; }
    setIsLoading(true);
    setError(null);
    setChecked(false);

    try {
      const ids = basket.map((d) => d.id);
      const ddi = await searchDdiMulti(ids);
      setDdiResults(ddi);

      // Load per-drug details in parallel
      const detailEntries = await Promise.all(
        basket.map(async (drug) => {
          const [food, conditions, targets, sideEffects] = await Promise.all([
            searchFoodInteractions(drug.id),
            searchDrugConditions(drug.id),
            searchDti(drug.id),
            searchDrugSideEffects(drug.id),
          ]);
          return [drug.id, { food, conditions, targets, sideEffects, loading: false }] as [number, DrugDetail];
        }),
      );
      setDetails(Object.fromEntries(detailEntries));
      setChecked(true);
      recordSearch("ddi", basket.map((d) => d.name).join(" + "), ddi.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check interactions");
    } finally {
      setIsLoading(false);
    }
  };

  // Group DDI by severity
  const grouped = {
    danger:  ddiResults.filter((r) => r.severity === "danger"),
    warning: ddiResults.filter((r) => r.severity === "warning"),
    safe:    ddiResults.filter((r) => r.severity === "safe"),
  };

  return (
    <div className="space-y-6">
      {/* ── Drug basket ── */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Add drugs to check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basket chips */}
          {basket.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {basket.map((drug) => (
                <div
                  key={drug.id}
                  className="flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-3 py-1.5 text-sm font-medium"
                >
                  <Pill className="h-3.5 w-3.5 text-primary-500" />
                  {drug.name}
                  <button
                    onClick={() => removeFromBasket(drug.id)}
                    className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search a drug (e.g., Warfarin, Ibuprofen, Metformin…)"
              value={inputText}
              onChange={(e) => handleInput(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSug(true)}
              onBlur={() => setTimeout(() => setShowSug(false), 150)}
              className="pl-9"
            />
            {showSug && suggestions.length > 0 && (
              <div className="absolute z-50 mt-1 w-full rounded-xl border border-border/60 bg-popover shadow-lg overflow-hidden">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onMouseDown={() => addToBasket(s)}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors text-left"
                  >
                    <span className="font-medium">
                      <HighlightMatch text={s.name} query={inputText} />
                    </span>
                    {s.drugbankId && (
                      <span className="text-xs text-muted-foreground font-mono">{s.drugbankId}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            onClick={handleCheck}
            disabled={basket.length < 2 || isLoading}
            className="w-full sm:w-auto font-semibold"
            size="lg"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Checking…</>
            ) : (
              <><Search className="mr-2 h-4 w-4" />Check Interactions</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ── Results ── */}
      {checked && (
        <div className="space-y-6">

          {/* DDI section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-foreground">Drug-Drug Interactions</h2>
              <span className="text-xs text-muted-foreground">
                {ddiResults.length} interaction{ddiResults.length !== 1 ? "s" : ""} found among {basket.length} drugs
              </span>
            </div>

            {ddiResults.length === 0 ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/20 px-4 py-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">No interactions found</p>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                    No known drug-drug interactions were found among the selected drugs.
                  </p>
                </div>
              </div>
            ) : (
              (["danger", "warning", "safe"] as const).map((sev) => {
                const items = grouped[sev];
                if (items.length === 0) return null;
                const cfg = SEV_CONFIG[sev];
                const Icon = cfg.icon;
                return (
                  <div key={sev} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("h-4 w-4", sev === "danger" ? "text-red-500" : sev === "warning" ? "text-amber-500" : "text-blue-400")} />
                      <span className="text-sm font-semibold text-foreground">{cfg.label}</span>
                      <span className="text-xs text-muted-foreground">({items.length})</span>
                    </div>
                    {items.map((item, i) => (
                      <div key={i} className={cn("rounded-xl border bg-card overflow-hidden", cfg.card)}>
                        <div className={cn("h-0.5 w-full", cfg.bar)} />
                        <div className="px-4 py-3 space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-foreground">{item.drugA}</span>
                            <span className="text-muted-foreground text-xs">+</span>
                            <span className="font-semibold text-sm text-foreground">{item.drugB}</span>
                            <span className={cn("ml-auto inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold", cfg.badge)}>
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
          </div>

          {/* Per-drug details */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-foreground">Drug Details</h2>
            <p className="text-xs text-muted-foreground -mt-1">Click a drug to see food interactions, conditions, and targets.</p>
            {basket.map((drug) => (
              <DrugDetailPanel
                key={drug.id}
                drug={drug}
                detail={details[drug.id] ?? { food: [], conditions: [], targets: [], sideEffects: [], loading: true }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
