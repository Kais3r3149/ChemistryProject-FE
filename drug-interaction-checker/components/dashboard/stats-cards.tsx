"use client";

import { useEffect, useState } from "react";
import { Pill, Target, Salad, ClipboardList } from "lucide-react";
import { fetchDashboardStats, type DashboardStats } from "@/lib/api";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: number | null;
  sub: string;
  color: string;
  dot: string;
}

function fmt(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toLocaleString();
}

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchDashboardStats()
      .then((s) => { setStats(s); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const items: StatItem[] = [
    {
      label: "Drug-Drug",
      value: stats?.totalDDIs ?? null,
      sub: "interaction pairs",
      color: "text-primary-600 dark:text-primary-400",
      dot: "bg-primary-500",
    },
    {
      label: "Drug-Target",
      value: stats?.totalDTIs ?? null,
      sub: "binding records",
      color: "text-blue-600 dark:text-blue-400",
      dot: "bg-blue-500",
    },
    {
      label: "Drug-Food",
      value: stats?.totalFoodInteractions ?? null,
      sub: "food interactions",
      color: "text-emerald-600 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    {
      label: "Conditions",
      value: stats?.totalConditions ?? null,
      sub: "indications & toxicity",
      color: "text-violet-600 dark:text-violet-400",
      dot: "bg-violet-500",
    },
  ];

  const icons = [Pill, Target, Salad, ClipboardList];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/60 rounded-xl border border-border/60 overflow-hidden bg-card">
      {items.map((item, i) => {
        const Icon = icons[i];
        return (
          <div key={item.label} className="flex flex-col gap-3 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {item.label}
              </span>
              <Icon className={cn("h-3.5 w-3.5", item.color)} />
            </div>
            <div>
              <p className={cn(
                "text-3xl font-bold tabular-nums tracking-tight transition-opacity duration-300",
                !loaded && "opacity-30",
                item.color
              )}>
                {fmt(item.value)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
