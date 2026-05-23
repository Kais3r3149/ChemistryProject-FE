import type { SeverityLevel } from "@/lib/constants";

/** API response wrapper */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly data: T | null;
  readonly error: string | null;
  readonly timestamp: string;
}

/** Pagination metadata */
export interface PaginationMeta {
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly totalPages: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly pagination: PaginationMeta;
}

/** Search/query history entry */
export interface SearchHistoryEntry {
  readonly id: string;
  readonly type: "ddi" | "dti" | "ppi" | "gda" | "drug-response";
  readonly query: string;
  readonly summary: string;
  readonly severity?: SeverityLevel;
  readonly createdAt: string;
}

/** Dashboard statistics */
export interface DashboardStats {
  readonly totalSearches: number;
  readonly interactionsFound: number;
  readonly dangerousInteractions: number;
  readonly recentSearches: readonly SearchHistoryEntry[];
}

/** Loading state for async operations */
export type LoadingState = "idle" | "loading" | "success" | "error";
