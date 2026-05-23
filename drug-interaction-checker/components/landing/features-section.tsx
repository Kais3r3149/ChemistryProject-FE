import { Pill, Target, Salad, ClipboardList, ArrowRight } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    num: "01",
    icon: Pill,
    title: "Drug-Drug Interactions",
    description: "Check interactions between two drugs with severity ratings — major, moderate, or minor. Over 1.4 million interaction pairs sourced directly from DrugBank.",
    tags: ["Major", "Moderate", "Minor"],
    tagColors: ["text-red-600 bg-red-50 border-red-200", "text-amber-600 bg-amber-50 border-amber-200", "text-emerald-600 bg-emerald-50 border-emerald-200"],
    href: "/interactions",
  },
  {
    num: "02",
    icon: Target,
    title: "Drug-Target Interactions",
    description: "Explore protein and enzyme targets for any drug. Each target links to its UniProt record with action type and organism context.",
    tags: ["UniProt linked", "Action type", "Organism"],
    tagColors: ["text-blue-600 bg-blue-50 border-blue-200", "text-blue-600 bg-blue-50 border-blue-200", "text-blue-600 bg-blue-50 border-blue-200"],
    href: "/interactions/drug-target",
  },
  {
    num: "03",
    icon: Salad,
    title: "Drug-Food Interactions",
    description: "Find food, beverage, and herbal interactions for a drug. Includes interaction descriptions to help patients understand dietary restrictions.",
    tags: ["Food", "Beverages", "Herbs"],
    tagColors: ["text-emerald-600 bg-emerald-50 border-emerald-200", "text-emerald-600 bg-emerald-50 border-emerald-200", "text-emerald-600 bg-emerald-50 border-emerald-200"],
    href: "/interactions/drug-food",
  },
  {
    num: "04",
    icon: ClipboardList,
    title: "Drug Conditions",
    description: "View indications and toxicity conditions associated with a drug. Covers approved therapeutic uses and adverse effect profiles from DrugBank.",
    tags: ["Indications", "Toxicity", "Adverse effects"],
    tagColors: ["text-violet-600 bg-violet-50 border-violet-200", "text-violet-600 bg-violet-50 border-violet-200", "text-violet-600 bg-violet-50 border-violet-200"],
    href: "/interactions/drug-condition",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-card py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">
            Powered by DrugBank
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Four analysis tools,
            <br />
            one unified interface.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Each tool queries DrugBank directly. No AI guesswork — structured, validated pharmaceutical data.
          </p>
        </div>

        {/* Feature list */}
        <div className="divide-y divide-border/60">
          {FEATURES.map(({ num, icon: Icon, title, description, tags, tagColors, href }) => (
            <div key={num} className="group grid grid-cols-1 md:grid-cols-[5rem_1fr_auto] gap-4 md:gap-8 py-8 items-start">
              {/* Number */}
              <span className="text-3xl font-black text-border group-hover:text-primary-200 dark:group-hover:text-primary-900 transition-colors select-none">
                {num}
              </span>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400 shrink-0" />
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-xl">{description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {tags.map((tag, i) => (
                    <span key={tag} className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${tagColors[i]}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Link
                href={href}
                className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors whitespace-nowrap pt-1"
              >
                Try now
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
