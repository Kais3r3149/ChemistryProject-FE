import type { SeverityLevel } from "./constants";

// ── Configuration ──

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ── Token helpers (localStorage) ──

const TOKEN_KEY = "dic_access_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

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
  readonly severity: "major" | "moderate" | "minor" | "unknown";
  readonly description: string | null;
  readonly source: string;
}

interface FoodInteractionFromApi {
  readonly id: number;
  readonly drug: { id: number; name: string };
  readonly interaction: string;
}

interface ConditionFromApi {
  readonly id: number;
  readonly drug: { id: number; name: string };
  readonly type: "indication" | "toxicity";
  readonly text: string;
}

interface DtiResultFromApi {
  readonly id: number;
  readonly drug: { id: number; name: string };
  readonly target: { id: number; name: string; uniprotId: string | null };
  readonly knownAction: string | null;
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
  readonly source: string;
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
    description: item.description ?? "No description available.",
    source: item.source,
  }));
}

// ── Drug-Food Interaction Endpoints ──

export interface FoodInteractionResult {
  readonly id: number;
  readonly drugName: string;
  readonly interaction: string;
}

export async function searchFoodInteractions(
  drugId: number,
): Promise<FoodInteractionResult[]> {
  const raw = await apiFetch<FoodInteractionFromApi[]>(
    `/drug-food/by-drug?drugId=${drugId}`,
  );
  return raw.map((item) => ({
    id: item.id,
    drugName: item.drug.name,
    interaction: item.interaction,
  }));
}

// ── Drug-Condition Endpoints ──

export interface ConditionResult {
  readonly id: number;
  readonly drugName: string;
  readonly type: "indication" | "toxicity";
  readonly text: string;
}

export async function searchDrugConditions(
  drugId: number,
): Promise<ConditionResult[]> {
  const raw = await apiFetch<ConditionFromApi[]>(
    `/drug-condition/by-drug?drugId=${drugId}`,
  );
  return raw.map((item) => ({
    id: item.id,
    drugName: item.drug.name,
    type: item.type,
    text: item.text,
  }));
}

// ── DTI Endpoints ──

export interface DtiDisplayResult {
  readonly id: number;
  readonly drugName: string;
  readonly targetName: string;
  readonly uniprotId: string | null;
  readonly knownAction: string | null;
  readonly source: string;
}

export async function searchDti(drugId: number): Promise<DtiDisplayResult[]> {
  const raw = await apiFetch<DtiResultFromApi[]>(
    `/dti/by-drug?drugId=${drugId}`,
  );
  return raw.map((item) => ({
    id: item.id,
    drugName: item.drug.name,
    targetName: item.target.name,
    uniprotId: item.target.uniprotId,
    knownAction: item.knownAction,
    source: item.source,
  }));
}

// ── Auth Endpoints ──

export interface AuthUser {
  readonly id: number;
  readonly email: string;
  readonly fullName: string;
}

interface AuthResponse {
  readonly accessToken: string;
  readonly user: AuthUser;
}

async function authPost<T>(path: string, body: Record<string, string>): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const body2 = await res.json().catch(() => ({}));
    const message =
      (body2 as { message?: string | string[] }).message;
    throw new Error(
      Array.isArray(message) ? message[0] : (message ?? `Error ${res.status}`),
    );
  }

  return res.json() as Promise<T>;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  return authPost<AuthResponse>("/auth/login", { email, password });
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return authPost<AuthResponse>("/auth/register", { fullName, email, password });
}

// ── Dashboard Stats ──

export interface DashboardStats {
  readonly totalDrugs: number;
  readonly totalDDIs: number;
  readonly totalDTIs: number;
  readonly totalFoodInteractions: number;
  readonly totalConditions: number;
  readonly severityDistribution: Record<string, number>;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  const json = (await res.json()) as { success: boolean; data: DashboardStats };
  return json.data;
}

// ── Search History ──

export interface SearchHistoryItem {
  readonly id: number;
  readonly searchType: string;
  readonly query: string;
  readonly resultCount: number;
  readonly createdAt: string;
}

async function apiFetchAuthed<T>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${body}`);
  }
  const json = (await res.json()) as ApiSuccessResponse<T>;
  if (!json.success) throw new Error("API returned unsuccessful response");
  return json.data;
}

export async function fetchSearchHistory(
  page = 1,
  limit = 20,
  searchType?: string,
): Promise<{ items: SearchHistoryItem[]; total: number }> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (searchType) params.set("searchType", searchType);
  const data = await apiFetchAuthed<SearchHistoryItem[]>(`/search-history?${params}`);
  return { items: data, total: (data as unknown as { length: number }).length };
}

export async function fetchRecentSearches(): Promise<SearchHistoryItem[]> {
  return apiFetchAuthed<SearchHistoryItem[]>("/search-history/recent");
}

export async function recordSearch(
  searchType: string,
  query: string,
  resultCount: number,
): Promise<void> {
  const token = getToken();
  if (!token) return;
  await fetch(`${API_BASE_URL}/search-history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ searchType, query, resultCount }),
  }).catch(() => { });
}
