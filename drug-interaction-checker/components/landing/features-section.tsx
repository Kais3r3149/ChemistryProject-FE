import { Pill, Dna, FlaskConical, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TDC_FEATURES } from "@/lib/constants";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, LucideIcon> = {
  pill: Pill,
  dna: Dna,
  flask: FlaskConical,
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  pill: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "group-hover:border-emerald-300 dark:group-hover:border-emerald-700",
    glow: "group-hover:shadow-emerald-100 dark:group-hover:shadow-emerald-900/20",
  },
  dna: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    text: "text-violet-600 dark:text-violet-400",
    border: "group-hover:border-violet-300 dark:group-hover:border-violet-700",
    glow: "group-hover:shadow-violet-100 dark:group-hover:shadow-violet-900/20",
  },
  flask: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-600 dark:text-amber-400",
    border: "group-hover:border-amber-300 dark:group-hover:border-amber-700",
    glow: "group-hover:shadow-amber-100 dark:group-hover:shadow-amber-900/20",
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="relative bg-card py-24 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-dots opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center space-y-4 mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50/80 dark:bg-primary-950/30 px-4 py-1.5 text-sm font-medium text-primary-700 dark:text-primary-300 border border-primary-200/50 dark:border-primary-800/30">
            Powered by TDC
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Comprehensive Drug{" "}
            <span className="text-gradient">Analysis</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Three powerful analysis tools backed by Therapeutics Data Commons
            for accurate, research-grade results.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {TDC_FEATURES.map((feature, index) => {
            const Icon = ICON_MAP[feature.icon];
            const colors = COLOR_MAP[feature.icon];
            return (
              <Card
                key={feature.title}
                className={`group relative overflow-hidden border-border/60 hover:shadow-xl transition-all duration-500 card-hover ${colors.border} ${colors.glow}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Top gradient bar */}
                <div className={`h-1 w-full ${colors.bg}`} />

                <CardContent className="p-8 space-y-5">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${colors.bg} ${colors.text} transition-all duration-300 group-hover:scale-110`}>
                    {Icon && <Icon className="h-7 w-7" />}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group/link"
                  >
                    Try now
                    <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
