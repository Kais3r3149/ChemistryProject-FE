import { Search, Cpu, FileCheck, ArrowRight } from "lucide-react";

const STEPS = [
  {
    step: 1,
    title: "Enter",
    description: "Input drug names, protein targets, or gene identifiers into the search form.",
    icon: Search,
    color: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    step: 2,
    title: "Analyze",
    description: "Our AI models process your query against TDC datasets in seconds with high accuracy.",
    icon: Cpu,
    color: "from-violet-500 to-violet-600",
    bgLight: "bg-violet-50 dark:bg-violet-950/30",
    textColor: "text-violet-600 dark:text-violet-400",
  },
  {
    step: 3,
    title: "Results",
    description: "Get severity-rated interaction results with confidence scores and mechanism details.",
    icon: FileCheck,
    color: "from-amber-500 to-amber-600",
    bgLight: "bg-amber-50 dark:bg-amber-950/30",
    textColor: "text-amber-600 dark:text-amber-400",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative bg-background py-24 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-50/30 to-transparent dark:via-primary-950/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center space-y-4 mb-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50/80 dark:bg-primary-950/30 px-4 py-1.5 text-sm font-medium text-primary-700 dark:text-primary-300 border border-primary-200/50 dark:border-primary-800/30">
            Simple workflow
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get interaction results in three simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="relative text-center group">
                {/* Connector line (desktop only) */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute top-12 left-[55%] w-[90%] items-center">
                    <div className="h-[2px] flex-1 bg-gradient-to-r from-border via-primary-300 to-border" />
                    <ArrowRight className="h-4 w-4 text-primary-400 -ml-1" />
                  </div>
                )}

                <div className="space-y-5">
                  {/* Step icon with number */}
                  <div className="relative inline-flex mx-auto">
                    <div className={`flex items-center justify-center w-24 h-24 rounded-3xl ${item.bgLight} ${item.textColor} transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
                      <Icon className="h-10 w-10" />
                    </div>
                    <span className={`absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-sm font-bold text-white shadow-lg`}>
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
