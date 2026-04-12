import {
  LayoutDashboard,
  Pill,
  Target,
  Dna,
  FlaskConical,
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
    label: "Safe",
    color: "text-emerald-700",
    hexColor: "#047857",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
  },
  warning: {
    label: "Warning",
    color: "text-amber-700",
    hexColor: "#b45309",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
  },
  danger: {
    label: "Danger",
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
        title: "Drug-Target (DTI)",
        href: "/interactions/drug-target",
        icon: Target,
        description: "Drug-target binding prediction",
      },
      {
        title: "Protein-Protein (PPI)",
        href: "/interactions/protein-protein",
        icon: Dna,
        description: "Protein-protein interaction",
      },
    ],
  },
  {
    label: "Analysis",
    items: [
      {
        title: "Gene-Disease",
        href: "/gene-disease",
        icon: Dna,
        description: "Gene-disease association",
      },
      {
        title: "Drug Response",
        href: "/drug-response",
        icon: FlaskConical,
        description: "Drug response prediction",
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
  "AI-powered drug interaction analysis using Therapeutics Data Commons" as const;

export const TDC_FEATURES = [
  {
    title: "Drug Interactions",
    description:
      "Check Drug-Drug (DDI), Drug-Target (DTI), and Protein-Protein (PPI) interactions with AI-powered analysis.",
    icon: "pill" as const,
  },
  {
    title: "Gene-Disease Association",
    description:
      "Explore associations between genes and diseases using curated TDC datasets for research insights.",
    icon: "dna" as const,
  },
  {
    title: "Drug Response Prediction",
    description:
      "Predict drug sensitivity and response for specific drug-cell line combinations.",
    icon: "flask" as const,
  },
] as const;
