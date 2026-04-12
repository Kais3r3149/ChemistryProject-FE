import type { Metadata } from "next";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentSearches } from "@/components/dashboard/recent-searches";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your drug interaction analysis activity.
          </p>
        </div>
        <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentSearches />
      </div>
    </div>
  );
}
