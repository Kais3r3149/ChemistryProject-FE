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

/** Decode JWT payload and check if it is expired (client-side check). */
export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp is in seconds
    return Date.now() / 1000 > payload.exp;
  } catch {
    return true;
  }
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

export async function searchDdiMulti(
  drugIds: number[],
): Promise<DdiDisplayResult[]> {
  const res = await fetch(`${API_BASE_URL}/ddi/multi`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ drugIds }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${body}`);
  }
  const json = (await res.json()) as { success: boolean; data: DdiResultFromApi[] };
  return json.data.map((item) => ({
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

// ── Side Effects (SIDER) Endpoints ──

export interface SideEffectResult {
  readonly id: number;
  readonly effectName: string;
  readonly effectType: "side_effect" | "indication";
  readonly cui: string | null;
}

export async function searchDrugSideEffects(
  drugId: number,
  type?: "side_effect" | "indication",
): Promise<SideEffectResult[]> {
  const params = new URLSearchParams({ drugId: String(drugId) });
  if (type) params.set("type", type);
  const res = await fetch(`${API_BASE_URL}/drug-side-effects/by-drug?${params}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = (await res.json()) as { success: boolean; data: SideEffectResult[] };
  return json.data;
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

// ── Drug Response Endpoints ──

export interface DrugResponseResult {
  readonly id: number;
  readonly drug: { id: number; name: string };
  readonly cellLine: { id: number; name: string; tissueName: string | null; cancerType: string | null };
  readonly value: number;
  readonly metric: string;
  readonly source: string;
}

export interface DrugResponseSearchResponse {
  readonly items: DrugResponseResult[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
}

export async function searchDrugResponse(
  drug: string,
  cellLine?: string,
  page = 1,
  limit = 20,
): Promise<DrugResponseSearchResponse> {
  const params = new URLSearchParams({ drug, page: String(page), limit: String(limit) });
  if (cellLine) params.set("cellLine", cellLine);
  const res = await fetch(`${API_BASE_URL}/drug-response/by-name?${params}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${body}`);
  }
  const json = (await res.json()) as {
    success: boolean;
    data: DrugResponseResult[];
    meta: { total: number; page: number; limit: number };
  };
  return { items: json.data, total: json.meta.total, page: json.meta.page, limit: json.meta.limit };
}

// ── PPI Endpoints ──

export interface PpiResult {
  readonly id: number;
  readonly proteinA: { uniprotId: string; name: string | null };
  readonly proteinB: { uniprotId: string; name: string | null };
  readonly score: number | null;
  readonly source: string;
}

export interface PpiSearchResponse {
  readonly items: PpiResult[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
}

export async function searchPpi(
  protein: string,
  page = 1,
  limit = 20,
): Promise<PpiSearchResponse> {
  const params = new URLSearchParams({
    protein,
    page: String(page),
    limit: String(limit),
  });
  const res = await fetch(`${API_BASE_URL}/ppi/search?${params}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${body}`);
  }
  const json = (await res.json()) as {
    success: boolean;
    data: PpiResult[];
    meta: { total: number; page: number; limit: number };
  };
  return {
    items: json.data,
    total: json.meta.total,
    page: json.meta.page,
    limit: json.meta.limit,
  };
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

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return authPost<{ message: string }>("/auth/forgot-password", { email });
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<{ message: string }> {
  return authPost<{ message: string }>("/auth/reset-password", { token, newPassword });
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = (body as { message?: string | string[] }).message;
    throw new Error(
      Array.isArray(message) ? message[0] : (message ?? `Error ${res.status}`),
    );
  }
  return res.json() as Promise<{ message: string }>;
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
    if (res.status === 401) {
      clearToken();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
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
