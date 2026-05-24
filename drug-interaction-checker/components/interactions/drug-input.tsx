"use client";

import { useReducer, useCallback, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { suggestDrugs, type DrugSuggestItem } from "@/lib/api";

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

type SuggestState = {
  suggestions: DrugSuggestItem[];
  isOpen: boolean;
  isLoading: boolean;
};
type SuggestAction =
  | { type: "loading" }
  | { type: "done"; results: DrugSuggestItem[] }
  | { type: "clear" };

function suggestReducer(state: SuggestState, action: SuggestAction): SuggestState {
  switch (action.type) {
    case "loading": return { ...state, isLoading: true };
    case "done": return { suggestions: action.results, isOpen: action.results.length > 0, isLoading: false };
    case "clear": return { suggestions: [], isOpen: false, isLoading: false };
    default: return state;
  }
}

interface DrugInputProps {
  readonly id: string;
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly selectedDrug: DrugSuggestItem | null;
  readonly onChange: (value: string) => void;
  readonly onSelect: (drug: DrugSuggestItem) => void;
}

export function DrugInput({
  id,
  label,
  placeholder,
  value,
  selectedDrug,
  onChange,
  onSelect,
}: DrugInputProps) {
  const [{ suggestions, isOpen, isLoading }, dispatch] = useReducer(suggestReducer, { suggestions: [], isOpen: false, isLoading: false });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [debouncedQuery, setDebouncedQuery] = useReducer((_: string, next: string) => next, value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(value), 300);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    let cancelled = false;
    if (debouncedQuery.length < 2 || selectedDrug !== null) {
      dispatch({ type: "clear" });
      return () => { cancelled = true; };
    }
    const loadingTimer = setTimeout(() => {
      if (!cancelled) dispatch({ type: "loading" });
    }, 150);
    suggestDrugs(debouncedQuery, 8)
      .then((results) => {
        if (!cancelled) dispatch({ type: "done", results });
      })
      .catch(() => { if (!cancelled) dispatch({ type: "clear" }); })
      .finally(() => { clearTimeout(loadingTimer); });
    return () => { cancelled = true; clearTimeout(loadingTimer); };
  }, [debouncedQuery, selectedDrug]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        dispatch({ type: "clear" });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => { onChange(e.target.value); },
    [onChange],
  );

  const handleSelect = useCallback(
    (drug: DrugSuggestItem) => {
      onSelect(drug);
      onChange(drug.name);
      dispatch({ type: "clear" });
    },
    [onSelect, onChange],
  );

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label htmlFor={id} className="font-medium">{label}</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
        )}
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={() => { if (suggestions.length > 0) dispatch({ type: "done", results: suggestions }); }}
          className="pl-9 h-11"
          autoComplete="off"
        />
        {isOpen && suggestions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-card shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((drug: DrugSuggestItem) => (
              <button
                key={drug.id}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                onMouseDown={() => handleSelect(drug)}
              >
                <span className="font-medium">
                  <HighlightMatch text={drug.name} query={value} />
                </span>
                {drug.drugbankId && (
                  <span className="ml-2 text-xs text-muted-foreground">{drug.drugbankId}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
