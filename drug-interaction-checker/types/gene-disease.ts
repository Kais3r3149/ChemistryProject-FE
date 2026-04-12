/** Gene entity */
export interface Gene {
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly ncbiId?: string;
}

/** Disease entity */
export interface Disease {
  readonly id: string;
  readonly name: string;
  readonly mondoId?: string;
}

/** Gene-Disease Association result */
export interface GeneDiseaseAssociation {
  readonly id: string;
  readonly gene: Gene;
  readonly disease: Disease;
  readonly associationScore: number;
  readonly confidence: number;
  readonly evidenceType: string;
  readonly source: string;
  readonly publications?: readonly string[];
}

/** GDA search input */
export interface GDASearchInput {
  readonly query: string;
  readonly searchType: "gene" | "disease";
}
