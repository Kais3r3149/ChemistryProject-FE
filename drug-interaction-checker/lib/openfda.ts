"use client";

const FDA_BASE = "https://api.fda.gov/drug/label.json";

export interface FdaLabel {
  // Overview
  description: string | null;
  recentMajorChanges: string | null;
  // Usage
  indicationsAndUsage: string | null;
  dosageAndAdministration: string | null;
  // Safety
  boxedWarning: string | null;
  contraindications: string | null;
  warnings: string | null;
  adverseReactions: string | null;
  overdosage: string | null;
  // Pharmacology
  mechanismOfAction: string | null;
  pharmacokinetics: string | null;
  clinicalPharmacology: string | null;
  // Special populations
  pregnancy: string | null;
  nursingMothers: string | null;
  pediatricUse: string | null;
  geriatricUse: string | null;
  // Interactions
  drugInteractions: string | null;
  // Lab & monitoring
  laboratoryTests: string | null;
  carcinogenesisAndMutagenesis: string | null;
  // Patient info
  patientCounselingInformation: string | null;
  // Supply
  howSupplied: string | null;
  storageAndHandling: string | null;
}

/** Clean FDA label text: strip refs, add paragraph breaks, normalize whitespace */
export function cleanFdaText(text: string | undefined): string | null {
  if (!text) return null;
  let t = text;

  // Normalize line endings
  t = t.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Fix missing spaces: lowercase/digit directly followed by uppercase (RunningTogether)
  t = t.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

  // Strip section header at very start: "1 INDICATIONS AND USAGE" or "1.1 Title"
  t = t.replace(/^\d+(\.\d+)*\s+[A-Z][A-Z\s/()-]{2,}\n?/, "");

  // Strip cross-references like [see Warnings (5.1)]
  t = t.replace(/\[see [^\]]+\]/gi, "");

  // Break before numbered sub-sections like "1.1 Title" or "5.2 Something"
  t = t.replace(/([^\n])(\d+\.\d+\s+[A-Z])/g, "$1\n\n$2");

  // Break before list-like bullets: lines starting with • or -
  t = t.replace(/([^\n])([\u2022\u2013\-]\s)/g, "$1\n$2");

  // Break on sentence endings before a capital: ". The " or ". In " etc.
  // Only when preceded by a word character (avoid abbreviations like "Dr.")
  t = t.replace(/([a-z\d])\.\s{1,3}([A-Z])/g, "$1.\n\n$2");

  // Collapse excessive blank lines
  t = t.replace(/\n{3,}/g, "\n\n");

  // Collapse multiple spaces to one
  t = t.replace(/ {2,}/g, " ");

  return t.trim() || null;
}

/**
 * Fetch FDA drug label sections for a given drug name.
 * Tries generic_name first, then brand_name.
 */
export async function fetchFdaLabel(drugName: string): Promise<FdaLabel> {
  const empty: FdaLabel = {
    description: null,
    recentMajorChanges: null,
    indicationsAndUsage: null,
    dosageAndAdministration: null,
    boxedWarning: null,
    contraindications: null,
    warnings: null,
    adverseReactions: null,
    overdosage: null,
    mechanismOfAction: null,
    pharmacokinetics: null,
    clinicalPharmacology: null,
    pregnancy: null,
    nursingMothers: null,
    pediatricUse: null,
    geriatricUse: null,
    drugInteractions: null,
    laboratoryTests: null,
    carcinogenesisAndMutagenesis: null,
    patientCounselingInformation: null,
    howSupplied: null,
    storageAndHandling: null,
  };

  const tryFetch = async (field: string, value: string) => {
    const q = encodeURIComponent(`"${value}"`);
    const url = `${FDA_BASE}?search=openfda.${field}:${q}&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json() as { results?: FdaRawResult[] };
    return json.results?.[0] ?? null;
  };

  let result = await tryFetch("generic_name", drugName);
  if (!result) result = await tryFetch("brand_name", drugName);
  if (!result) return empty;

  return {
    description: cleanFdaText(result.description?.[0]),
    recentMajorChanges: cleanFdaText(result.recent_major_changes?.[0]),
    indicationsAndUsage: cleanFdaText(result.indications_and_usage?.[0]),
    dosageAndAdministration: cleanFdaText(result.dosage_and_administration?.[0]),
    boxedWarning: cleanFdaText(result.boxed_warning?.[0]),
    contraindications: cleanFdaText(result.contraindications?.[0]),
    warnings: cleanFdaText(result.warnings?.[0]),
    adverseReactions: cleanFdaText(result.adverse_reactions?.[0]),
    overdosage: cleanFdaText(result.overdosage?.[0]),
    mechanismOfAction: cleanFdaText(result.mechanism_of_action?.[0]),
    pharmacokinetics: cleanFdaText(result.pharmacokinetics?.[0]),
    clinicalPharmacology: cleanFdaText(result.clinical_pharmacology?.[0]),
    pregnancy: cleanFdaText(result.pregnancy?.[0]),
    nursingMothers: cleanFdaText(result.nursing_mothers?.[0]),
    pediatricUse: cleanFdaText(result.pediatric_use?.[0]),
    geriatricUse: cleanFdaText(result.geriatric_use?.[0]),
    drugInteractions: cleanFdaText(result.drug_interactions?.[0]),
    laboratoryTests: cleanFdaText(result.laboratory_tests?.[0]),
    carcinogenesisAndMutagenesis: cleanFdaText(result.carcinogenesis_and_mutagenesis_and_impairment_of_fertility?.[0]),
    patientCounselingInformation: cleanFdaText(result.patient_counseling_information?.[0]),
    howSupplied: cleanFdaText(result.how_supplied?.[0]),
    storageAndHandling: cleanFdaText(result.storage_and_handling?.[0]),
  };
}

interface FdaRawResult {
  description?: string[];
  recent_major_changes?: string[];
  indications_and_usage?: string[];
  dosage_and_administration?: string[];
  boxed_warning?: string[];
  contraindications?: string[];
  warnings?: string[];
  adverse_reactions?: string[];
  overdosage?: string[];
  mechanism_of_action?: string[];
  pharmacokinetics?: string[];
  clinical_pharmacology?: string[];
  pregnancy?: string[];
  nursing_mothers?: string[];
  pediatric_use?: string[];
  geriatric_use?: string[];
  drug_interactions?: string[];
  laboratory_tests?: string[];
  carcinogenesis_and_mutagenesis_and_impairment_of_fertility?: string[];
  patient_counseling_information?: string[];
  how_supplied?: string[];
  storage_and_handling?: string[];
}
