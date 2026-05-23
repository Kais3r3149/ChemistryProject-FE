import {
  LayoutDashboard,
  Pill,
  Target,
  Salad,
  ClipboardList,
  History,
  Settings,
  type LucideIcon,
} from "lucide-react";

// ── Severity Configuration ──

export type SeverityLevel = "safe" | "warning" | "danger";

interface SeverityConfig {
  readonly label: string;
  readonly color: string;
  readonly hexColor: string;
  readonly bgColor: string;
  readonly borderColor: string;
  readonly textColor: string;
}

export const SEVERITY_CONFIG: Record<SeverityLevel, SeverityConfig> = {
  safe: {
    label: "Minor",
    color: "text-emerald-700",
    hexColor: "#047857",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
  },
  warning: {
    label: "Moderate",
    color: "text-amber-700",
    hexColor: "#b45309",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
  },
  danger: {
    label: "Major",
    color: "text-red-700",
    hexColor: "#b91c1c",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
  },
} as const;

// ── Navigation ──

export interface NavItem {
  readonly title: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly description?: string;
}

export interface NavGroup {
  readonly label: string;
  readonly items: readonly NavItem[];
}

export const DASHBOARD_NAV: readonly NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview & statistics",
      },
    ],
  },
  {
    label: "Interactions",
    items: [
      {
        title: "Drug-Drug (DDI)",
        href: "/interactions",
        icon: Pill,
        description: "Check drug-drug interactions",
      },
      {
        title: "Drug-Food",
        href: "/interactions/drug-food",
        icon: Salad,
        description: "Drug and food/herb interactions",
      },
      {
        title: "Drug-Target (DTI)",
        href: "/interactions/drug-target",
        icon: Target,
        description: "Drug-target binding interactions",
      },
      {
        title: "Drug-Condition",
        href: "/interactions/drug-condition",
        icon: ClipboardList,
        description: "Indications and toxicity",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "History",
        href: "/history",
        icon: History,
        description: "Search history",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Account settings",
      },
    ],
  },
] as const;

// ── Public Navigation ──

export interface PublicNavItem {
  readonly title: string;
  readonly href: string;
}

export const PUBLIC_NAV: readonly PublicNavItem[] = [
  { title: "Features", href: "#features" },
  { title: "How It Works", href: "#how-it-works" },
  { title: "About", href: "#about" },
] as const;

// ── App Constants ──

export const APP_NAME = "Drug Interaction Checker" as const;
export const APP_DESCRIPTION =
  "Drug interaction analysis powered by DrugBank" as const;

export const TDC_FEATURES = [
  {
    title: "Drug-Drug Interactions",
    description:
      "Check interactions between two drugs with severity ratings (major, moderate, minor) sourced from DrugBank — over 1.4 million interaction pairs.",
    icon: "pill" as const,
  },
  {
    title: "Drug-Target & Drug-Food",
    description:
      "Explore protein targets and food interactions for any drug. Data includes UniProt-linked targets and food/herb interaction descriptions.",
    icon: "dna" as const,
  },
  {
    title: "Drug Conditions",
    description:
      "View indications and toxicity conditions associated with a drug, covering approved uses and known adverse effects from DrugBank.",
    icon: "flask" as const,
  },
] as const;
