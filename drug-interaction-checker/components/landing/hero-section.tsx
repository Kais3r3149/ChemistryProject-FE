import Link from "next/link";
import { ArrowRight, Shield, Sparkles, Zap, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-mesh min-h-[90vh] flex items-center">
      {/* Animated background orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-200/30 blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-primary-300/20 blur-3xl animate-float stagger-2" />
        <div className="absolute -bottom-20 right-1/4 h-64 w-64 rounded-full bg-primary-100/40 blur-3xl animate-pulse-soft" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Text content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200/60 bg-primary-50/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary-700 shadow-sm">
              <Sparkles className="h-4 w-4 animate-pulse-soft" />
              Powered by TDC & AI
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-foreground">Analyze Drug</span>
              <br />
              <span className="text-gradient">Interactions Safely</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              AI-powered analysis for drug-drug, drug-target, and
              protein-protein interactions. Explore gene-disease associations and
              predict drug responses with data from{" "}
              <span className="font-medium text-foreground">Therapeutics Data Commons</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="glow-primary group" asChild>
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="group" asChild>
                <Link href="#features">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Shield className="h-4 w-4" />
                </div>
                Medical-grade data
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Database className="h-4 w-4" />
                </div>
                Research-validated
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <Zap className="h-4 w-4" />
                </div>
                Instant results
              </div>
            </div>
          </div>

          {/* Hero illustration */}
          <div className="hidden lg:flex items-center justify-center animate-fade-in stagger-3">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-400/20 to-primary-600/20 blur-xl scale-105" />

              {/* Main card */}
              <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-white/80 to-primary-50/80 dark:from-slate-800/80 dark:to-primary-950/50 backdrop-blur-xl border border-primary-200/30 shadow-2xl shadow-primary-500/10 flex items-center justify-center overflow-hidden">
                {/* Grid dots overlay */}
                <div className="absolute inset-0 bg-dots opacity-30" />

                {/* Decorative floating elements */}
                <div className="absolute -top-4 -right-4 w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-200/40 to-primary-300/20 rotate-12 animate-float" />
                <div className="absolute -bottom-6 -left-6 w-36 h-36 rounded-2xl bg-gradient-to-br from-primary-200/30 to-primary-100/20 -rotate-6 animate-float stagger-2" />
                <div className="absolute top-1/4 -right-3 w-16 h-16 rounded-xl bg-primary-300/20 rotate-45 animate-bounce-subtle" />

                <div className="relative text-center space-y-6 p-8 z-10">
                  <div className="text-7xl animate-float">🧬</div>
                  <p className="text-base font-semibold text-primary-700 dark:text-primary-300">
                    Drug Interaction Analysis
                  </p>
                  <div className="flex justify-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-200/50 dark:border-emerald-800/30">
                      🔬 DDI
                    </span>
                    <span className="inline-flex items-center rounded-full bg-amber-100/80 dark:bg-amber-900/30 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 shadow-sm border border-amber-200/50 dark:border-amber-800/30">
                      🎯 DTI
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-100/80 dark:bg-blue-900/30 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-800/30">
                      🧪 PPI
                    </span>
                  </div>

                  {/* Fake mini stat bar */}
                  <div className="flex justify-center gap-6 pt-2 text-xs text-muted-foreground">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">22K+</p>
                      <p>Drug Pairs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">99.2%</p>
                      <p>Accuracy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">&lt;1s</p>
                      <p>Response</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
