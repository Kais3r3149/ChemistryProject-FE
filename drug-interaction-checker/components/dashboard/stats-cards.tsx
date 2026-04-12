import { Card, CardContent } from "@/components/ui/card";
import { Pill, AlertTriangle, ShieldCheck, Search, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: string;
}

function StatCard({ title, value, description, icon: Icon, iconColor, iconBg, trend }: StatCardProps) {
  return (
    <Card className="card-hover border-border/50 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
            {description && (
              <div className="flex items-center gap-1.5">
                {trend && (
                  <TrendingUp className="h-3 w-3 text-primary-500" />
                )}
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            )}
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} ${iconColor} transition-transform duration-200`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  // Mock data — will be replaced with real API data
  const stats: StatCardProps[] = [
    {
      title: "Total Searches",
      value: 0,
      description: "All-time queries",
      icon: Search,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      title: "Interactions Found",
      value: 0,
      description: "Across all types",
      icon: Pill,
      iconColor: "text-primary-600 dark:text-primary-400",
      iconBg: "bg-primary-50 dark:bg-primary-950/30",
    },
    {
      title: "Dangerous",
      value: 0,
      description: "High severity alerts",
      icon: AlertTriangle,
      iconColor: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-50 dark:bg-red-950/30",
    },
    {
      title: "Safe Results",
      value: 0,
      description: "No interaction detected",
      icon: ShieldCheck,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
