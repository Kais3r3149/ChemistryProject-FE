import type { Metadata } from "next";
import Link from "next/link";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentSearches } from "@/components/dashboard/recent-searches";
import { Pill, Target, Salad, ClipboardList, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

const QUICK_LINKS = [
  { label: "Drug-Drug", href: "/interactions", icon: Pill, color: "text-primary-600 dark:text-primary-400", bg: "bg-primary-50 dark:bg-primary-950/30" },
  { label: "Drug-Target", href: "/interactions/drug-target", icon: Target, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { label: "Drug-Food", href: "/interactions/drug-food", icon: Salad, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  { label: "Conditions", href: "/interactions/drug-condition", icon: ClipboardList, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-950/30" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          DrugBank data overview and recent activity.
        </p>
      </div>

      {/* Stats strip */}
      <StatsCards />

      {/* Quick access */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-3">
          Quick access
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_LINKS.map(({ label, href, icon: Icon, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between rounded-lg border border-border/60 bg-card px-4 py-3 text-sm font-medium text-foreground hover:border-primary-200 dark:hover:border-primary-800 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <span className={`flex h-7 w-7 items-center justify-center rounded-md ${bg} ${color}`}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent searches */}
      <RecentSearches />
    </div>
  );
}
