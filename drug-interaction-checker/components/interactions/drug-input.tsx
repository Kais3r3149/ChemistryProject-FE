"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { suggestDrugs, type DrugSuggestItem } from "@/lib/api";

function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
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
  const [suggestions, setSuggestions] = useState<DrugSuggestItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(value, 300);

  useEffect(() => {
    let cancelled = false;
    if (debouncedQuery.length < 2 || selectedDrug !== null) {
      Promise.resolve().then(() => { if (!cancelled) setSuggestions([]); });
      return () => { cancelled = true; };
    }
    setIsLoadingSuggestions(true);
    suggestDrugs(debouncedQuery, 8)
      .then((results) => {
        if (!cancelled) {
          setSuggestions(results);
          setIsOpen(results.length > 0);
        }
      })
      .catch(() => { if (!cancelled) setSuggestions([]); })
      .finally(() => { if (!cancelled) setIsLoadingSuggestions(false); });
    return () => { cancelled = true; };
  }, [debouncedQuery, selectedDrug]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
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
      setIsOpen(false);
      setSuggestions([]);
    },
    [onSelect, onChange],
  );

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label htmlFor={id} className="font-medium">{label}</Label>
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
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          className="pl-9 h-11"
          autoComplete="off"
        />
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
