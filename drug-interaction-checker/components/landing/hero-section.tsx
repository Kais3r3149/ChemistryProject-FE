import Link from "next/link";
import { ArrowRight, Pill, Search, Shield, Database, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_RESULTS = [
  { drug: "Aspirin", severity: "moderate", label: "Moderate", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800/40" },
  { drug: "Warfarin", severity: "major", label: "Major", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800/40" },
  { drug: "Ibuprofen", severity: "minor", label: "Minor", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800/40" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-mesh min-h-[88vh] flex items-center">
      <div className="absolute inset-0 -z-10 bg-mesh" />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 w-full">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-20 items-center">

          {/* Left: text */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400">
                Powered by DrugBank
              </p>
              <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl leading-[1.05]">
                Drug Interaction
                <br />
                <span className="text-primary-600 dark:text-primary-400">Analysis Tool</span>
              </h1>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              Check drug-drug, drug-target, food, and condition interactions sourced from{" "}
              <span className="font-semibold text-foreground">DrugBank</span>{" "}
              — over 1.4 million interaction pairs.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="glow-primary font-semibold group" asChild>
                <Link href="/register">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            </div>

            {/* Stat row */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2 border-t border-border/50">
              {[
                { icon: Database, val: "1.4M+", sub: "interaction pairs" },
                { icon: Shield, val: "DrugBank", sub: "validated source" },
                { icon: Pill, val: "4 tools", sub: "DDI, DTI, Food, Condition" },
              ].map(({ icon: Icon, val, sub }) => (
                <div key={val} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary-500 shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-foreground">{val}</span>
                    <span className="text-sm text-muted-foreground ml-1.5">{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: UI mockup */}
          <div className="hidden lg:block animate-fade-in stagger-2">
            <div className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/8 overflow-hidden">
              {/* Mockup topbar */}
              <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/60" />
                  <div className="h-3 w-3 rounded-full bg-amber-400/60" />
                  <div className="h-3 w-3 rounded-full bg-emerald-400/60" />
                </div>
                <div className="flex-1 mx-3 flex items-center gap-2 rounded-md bg-background/80 border border-border/50 px-3 py-1.5 text-xs text-muted-foreground">
                  <Search className="h-3 w-3" />
                  Drug-Drug Interaction
                </div>
              </div>

              {/* Mockup body */}
              <div className="p-5 space-y-4">
                {/* Search bar mock */}
                <div className="flex gap-3">
                  <div className="flex-1 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground font-medium">
                    Metformin
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-border/60 text-muted-foreground/40">
                    +
                  </div>
                  <div className="flex-1 rounded-lg border border-border bg-background/60 px-3 py-2.5 text-sm text-foreground font-medium">
                    Lisinopril
                  </div>
                  <div className="flex items-center justify-center rounded-lg bg-primary-600 px-4 text-xs font-semibold text-white whitespace-nowrap">
                    Check
                  </div>
                </div>

                {/* Result label */}
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Results</p>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40 text-[10px] font-bold text-primary-700 dark:text-primary-300">
                    {MOCK_RESULTS.length}
                  </span>
                </div>

                {/* Result rows */}
                <div className="space-y-2">
                  {MOCK_RESULTS.map((r) => (
                    <div key={r.drug} className={`flex items-center justify-between rounded-lg border px-3 py-2.5 ${r.border} ${r.bg}`}>
                      <div className="flex items-center gap-2.5">
                        <Pill className={`h-3.5 w-3.5 ${r.color}`} />
                        <span className="text-sm font-medium text-foreground">
                          Metformin + {r.drug}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold ${r.color}`}>{r.label}</span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-center text-xs text-muted-foreground/50 pt-1">
                  Source: DrugBank Open Data
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
