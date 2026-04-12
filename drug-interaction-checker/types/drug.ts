import type { SeverityLevel } from "@/lib/constants";

/** Drug entity */
export interface Drug {
  readonly id: string;
  readonly name: string;
  readonly smiles?: string;
  readonly drugbankId?: string;
}

/** Drug-Drug Interaction result */
export interface DrugDrugInteraction {
  readonly id: string;
  readonly drugA: Drug;
  readonly drugB: Drug;
  readonly severity: SeverityLevel;
  readonly description: string;
  readonly confidence: number;
  readonly source: string;
  readonly mechanism?: string;
}

/** Drug-Drug Interaction search input */
export interface DDISearchInput {
  readonly drugA: string;
  readonly drugB: string;
}

/** Target/Protein entity */
export interface Target {
  readonly id: string;
  readonly name: string;
  readonly uniprotId?: string;
  readonly sequence?: string;
}

/** Drug-Target Interaction result */
export interface DrugTargetInteraction {
  readonly id: string;
  readonly drug: Drug;
  readonly target: Target;
  readonly bindingAffinity: number;
  readonly confidence: number;
  readonly interactionType: string;
  readonly source: string;
}

/** DTI search input */
export interface DTISearchInput {
  readonly drug: string;
  readonly target: string;
}

/** Protein-Protein Interaction result */
export interface ProteinProteinInteraction {
  readonly id: string;
  readonly proteinA: Target;
  readonly proteinB: Target;
  readonly confidence: number;
  readonly interactionType: string;
  readonly source: string;
}

/** PPI search input */
export interface PPISearchInput {
  readonly proteinA: string;
  readonly proteinB: string;
}

/** Drug autocomplete suggestion */
export interface DrugSuggestion {
  readonly id: string;
  readonly name: string;
  readonly drugbankId?: string;
}
