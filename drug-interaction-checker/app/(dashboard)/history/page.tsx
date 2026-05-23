"use client";

import { useEffect, useState } from "react";
import { Clock, Pill, Salad, Target, ClipboardList, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSearchHistory, type SearchHistoryItem } from "@/lib/api";
import { cn } from "@/lib/utils";

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  ddi: { label: "Drug-Drug", icon: Pill, color: "text-primary-600 dark:text-primary-400", bg: "bg-primary-50 dark:bg-primary-950/30" },
  dti: { label: "Drug-Target", icon: Target, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
  food: { label: "Drug-Food", icon: Salad, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30" },
  condition: { label: "Drug-Condition", icon: ClipboardList, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30" },
};

const FILTER_TYPES = ["all", "ddi", "dti", "food", "condition"] as const;
type FilterType = typeof FILTER_TYPES[number];

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" });
}

export default function HistoryPage() {
  const [items, setItems] = useState<SearchHistoryItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSearchHistory(1, 100)
      .then(({ items }) => setItems(items))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = filter === "all" ? items : items.filter((i) => i.searchType === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Search History
        </h1>
        <p className="text-muted-foreground mt-1">
          Your past searches across all interaction types.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TYPES.map((type) => {
          const count = type === "all" ? items.length : items.filter((i) => i.searchType === type).length;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                filter === type
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {type === "all" ? "All" : TYPE_CONFIG[type]?.label ?? type}
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-background/20 px-1 text-[10px] font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {filter === "all" ? "All Searches" : (TYPE_CONFIG[filter]?.label ?? filter)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground">No searches yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your searches will appear here after you use the interaction tools.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((item) => {
                const cfg = TYPE_CONFIG[item.searchType] ?? {
                  label: item.searchType,
                  icon: Search,
                  color: "text-muted-foreground",
                  bg: "bg-muted",
                };
                const Icon = cfg.icon;
                return (
                  <div key={item.id} className="flex items-center gap-3 py-3">
                    <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", cfg.bg, cfg.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.query}</p>
                      <p className="text-xs text-muted-foreground">
                        {cfg.label} · {item.resultCount} result{item.resultCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{formatDate(item.createdAt)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
