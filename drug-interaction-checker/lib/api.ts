import type { SeverityLevel } from "./constants";

// ── Configuration ──

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ── Types (matching BE response shapes) ──

interface ApiSuccessResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface DrugSuggestItem {
  readonly id: number;
  readonly name: string;
  readonly drugbankId: string | null;
}

interface DdiResultFromApi {
  readonly id: number;
  readonly drugA: { id: number; name: string };
  readonly drugB: { id: number; name: string };
  readonly interactionType: number;
  readonly severity: "major" | "moderate" | "minor" | "unknown";
  readonly description: string | null;
  readonly confidence: number | null;
  readonly source: string;
}

// ── Severity Mapping (BE → FE) ──

const BE_TO_FE_SEVERITY: Record<string, SeverityLevel> = {
  major: "danger",
  moderate: "warning",
  minor: "safe",
  unknown: "warning",
};

export function mapBeSeverityToFe(beSeverity: string): SeverityLevel {
  return BE_TO_FE_SEVERITY[beSeverity] ?? "warning";
}

// ── API Fetch Wrapper ──

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);

  if (!res.ok) {
    const body = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${body}`);
  }

  const json = (await res.json()) as ApiSuccessResponse<T>;

  if (!json.success) {
    throw new Error("API returned unsuccessful response");
  }

  return json.data;
}

// ── Drug Endpoints ──

export async function suggestDrugs(
  query: string,
  limit = 10,
): Promise<DrugSuggestItem[]> {
  if (query.length < 2) return [];
  const params = new URLSearchParams({ q: query, limit: String(limit) });
  return apiFetch<DrugSuggestItem[]>(`/drugs/suggest?${params}`);
}

// ── DDI Endpoints ──

export interface DdiDisplayResult {
  readonly drugA: string;
  readonly drugB: string;
  readonly severity: SeverityLevel;
  readonly description: string;
  readonly confidence: number;
  readonly source: string;
  readonly interactionType: number;
}

export async function searchDdi(
  drugAId: number,
  drugBId: number,
): Promise<DdiDisplayResult[]> {
  const params = new URLSearchParams({
    drugAId: String(drugAId),
    drugBId: String(drugBId),
  });

  const raw = await apiFetch<DdiResultFromApi[]>(`/ddi/search?${params}`);

  return raw.map((item) => ({
    drugA: item.drugA.name,
    drugB: item.drugB.name,
    severity: mapBeSeverityToFe(item.severity),
    description: item.description ?? "No description available",
    confidence: item.confidence ?? 0,
    source: item.source,
    interactionType: item.interactionType,
  }));
}
