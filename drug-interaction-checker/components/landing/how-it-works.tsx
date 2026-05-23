import { Search, Cpu, FileCheck } from "lucide-react";

const STEPS = [
  {
    step: 1,
    title: "Enter a drug name",
    description: "Type any drug name and select from the autocomplete. For DDI, enter two drugs.",
    icon: Search,
  },
  {
    step: 2,
    title: "Query DrugBank",
    description: "The system queries DrugBank in real-time and returns structured interaction data in under a second.",
    icon: Cpu,
  },
  {
    step: 3,
    title: "Read the results",
    description: "Results show severity ratings, source descriptions, target details, and food or condition notes.",
    icon: FileCheck,
  },
] as const;

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">
            Simple workflow
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three steps to an answer.
          </h2>
        </div>

        {/* Steps — horizontal on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:divide-x divide-border/60">
          {STEPS.map(({ step, title, description, icon: Icon }) => (
            <div key={step} className="relative flex flex-col gap-4 px-0 md:px-8 py-6 md:py-0 first:pl-0 last:pr-0 border-b md:border-b-0 border-border/60 last:border-0">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary-200 dark:border-primary-800 text-sm font-bold text-primary-600 dark:text-primary-400">
                  {step}
                </span>
                <Icon className="h-4 w-4 text-muted-foreground/60" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
