import type { Drug } from "./drug";

/** Cell line entity */
export interface CellLine {
  readonly id: string;
  readonly name: string;
  readonly tissue?: string;
  readonly cancerType?: string;
}

/** Drug response prediction result */
export interface DrugResponseResult {
  readonly id: string;
  readonly drug: Drug;
  readonly cellLine: CellLine;
  readonly ic50: number;
  readonly auc: number;
  readonly sensitivity: "sensitive" | "resistant" | "intermediate";
  readonly confidence: number;
  readonly source: string;
}

/** Drug response search input */
export interface DrugResponseSearchInput {
  readonly drug: string;
  readonly cellLine: string;
}
