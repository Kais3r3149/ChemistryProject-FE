import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Data References",
};

const REFERENCES = [
  {
    category: "Drug Interactions & Clinical Data",
    items: [
      {
        name: "DrugBank",
        version: "DrugBank 5.1",
        description:
          "Comprehensive drug database providing Drug-Drug Interactions (DDI), Drug-Target Interactions (DTI), Drug-Food Interactions, and Drug Conditions (indications, toxicity). Primary source for the majority of structured interaction data in this application.",
        stats: "14,000+ drugs · 1.4M+ DDI pairs · 24K DTI records · 2,558 food interactions · 7K+ conditions",
        url: "https://go.drugbank.com/",
        cite: "Wishart DS, et al. DrugBank 5.0: a major update to the DrugBank database for 2018. Nucleic Acids Res. 2018;46(D1):D1074–D1082.",
        license: "CC BY-NC 4.0 (academic use)",
        badge: "Primary",
        badgeColor: "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/30 dark:text-primary-300 dark:border-primary-800",
      },
      {
        name: "openFDA — FDA Drug Label API",
        version: "Current (live API)",
        description:
          "U.S. Food & Drug Administration structured product labeling (SPL) data, accessed via the openFDA REST API. Provides full FDA-approved drug label content including indications & usage, dosage & administration, mechanism of action, pharmacokinetics, clinical pharmacology, boxed warnings, contraindications, warnings, adverse reactions, overdosage, drug interactions, pregnancy/nursing/pediatric/geriatric use, laboratory tests, carcinogenesis & mutagenesis, patient counseling information, how supplied, and storage & handling. Displayed in the FDA Label tab for each drug.",
        stats: "140,000+ drug label documents · 22 label sections fetched",
        url: "https://open.fda.gov/apis/drug/label/",
        cite: "U.S. Food and Drug Administration. openFDA Drug Label API. https://open.fda.gov/apis/drug/label/. Accessed 2026.",
        license: "Public Domain (U.S. Government Work)",
        badge: "FDA",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
      },
    ],
  },
  {
    category: "Side Effects",
    items: [
      {
        name: "SIDER — Side Effect Resource",
        version: "SIDER 4.1",
        description:
          "Database of marketed drugs and their recorded adverse drug reactions, extracted from public drug label documents using natural language processing. Side effect terms are mapped to MedDRA terminology. Used for the Side Effects tab in the drug detail panel.",
        stats: "1,430 drugs · 5,868 side effect terms · 140,064 drug–side effect pairs",
        url: "http://sideeffects.embl.de/",
        cite: "Kuhn M, et al. The SIDER database of drugs and side effects. Nucleic Acids Res. 2016;44(D1):D1075–D1079.",
        license: "CC BY-NC-SA 4.0",
        badge: "SIDER 4.1",
        badgeColor: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800",
      },
    ],
  },
  {
    category: "Drug Sensitivity",
    items: [
      {
        name: "GDSC2 — Genomics of Drug Sensitivity in Cancer",
        version: "GDSC2 (October 2023)",
        description:
          "IC50 and AUC sensitivity values for anticancer drugs tested across hundreds of cancer cell lines. Provides drug sensitivity data for the Drug Response module, enabling queries by drug name and cancer cell line.",
        stats: "99K+ response records · 286 drugs · 2,266 cell lines",
        url: "https://www.cancerrxgene.org/",
        cite: "Yang W, et al. Genomics of Drug Sensitivity in Cancer (GDSC): a resource for therapeutic biomarker discovery in cancer cells. Nucleic Acids Res. 2013;41(D1):D955–D961.",
        license: "CC BY 4.0",
        badge: "GDSC2",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800",
      },
      {
        name: "Cell Model Passports",
        version: "April 2026",
        description:
          "Cell line annotation database providing tissue type, cancer type, and model metadata. Used to annotate cell lines in the Drug Response module.",
        stats: "2,266 cell line models",
        url: "https://cellmodelpassports.sanger.ac.uk/",
        cite: "van der Meer D, et al. Cell Model Passports — a hub for clinical, genetic and functional datasets of preclinical cancer models. Nucleic Acids Res. 2019;47(D1):D923–D929.",
        license: "CC BY 4.0",
        badge: "Sanger",
        badgeColor: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-800",
      },
    ],
  },
  {
    category: "Planned / Future",
    items: [
      {
        name: "DisGeNET",
        version: "Pending integration",
        description:
          "Platform containing gene-disease associations (GDA) compiled from expert-curated repositories and GWAS catalog. Planned for the Gene-Disease Association module.",
        stats: "~1.1M curated associations (planned)",
        url: "https://www.disgenet.org/",
        cite: "Piñero J, et al. DisGeNET: a comprehensive platform integrating information on human disease-associated genes and variants. Nucleic Acids Res. 2017;45(D1):D833–D839.",
        license: "CC BY-NC-SA 4.0",
        badge: "Coming soon",
        badgeColor: "bg-muted text-muted-foreground border-border",
      },
    ],
  },
];

export default function ReferencesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Data References
        </h1>
        <p className="text-muted-foreground mt-1">
          All datasets and databases used in this application, with citations and licensing information.
        </p>
      </div>

      {REFERENCES.map((section) => (
        <div key={section.category}>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">
            {section.category}
          </p>
          <div className="space-y-4">
            {section.items.map((ref) => (
              <div
                key={ref.name}
                className="rounded-xl border border-border/60 bg-card p-6 space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-base font-bold text-foreground">{ref.name}</h2>
                      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${ref.badgeColor}`}>
                        {ref.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/70">{ref.version}</p>
                  </div>
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    Visit
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {ref.description}
                </p>

                {/* Stats */}
                <p className="text-xs font-medium text-foreground/70 bg-muted/40 rounded-md px-3 py-2 border border-border/40">
                  {ref.stats}
                </p>

                {/* Citation + License */}
                <div className="space-y-2 pt-1 border-t border-border/40">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground/70">Cite: </span>
                    {ref.cite}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/70">License: </span>
                    {ref.license}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
