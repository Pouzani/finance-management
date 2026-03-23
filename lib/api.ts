import { getTokens, clearTokens, refreshAccessToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

// ── Response types ──────────────────────────────────────────────────────────

export type ApiAccount = {
  id: string;
  name: string;
  balance: string;
  created_at: string;
};

export type ApiCategory = {
  id: string;
  name: string;
  color: string;
  type: "income" | "expense";
};

export type ApiTransaction = {
  id: string;
  label: string;
  amount: string;
  date: string;
  type: "income" | "expense";
  account: string;
  account_name: string;
  category: string;
  category_detail: ApiCategory;
  created_at: string;
  updated_at: string;
};

export type ApiBudget = {
  id: string;
  category: { id: string; name: string; color: string; type: "income" | "expense" };
  account: { id: string; name: string } | null;
  amount_limit: string;
  start_day: number;
  rollover: boolean;
  period: { start: string; end: string };
  spent: string;
  remaining: string;
  utilization_pct: number;
};

export type ApiGoal = {
  id: string;
  label: string;
  current: string;
  target: string;
  icon: string;
  color: string;
};

export type ApiMonthlyFlow = {
  month: string; // "YYYY-MM"
  income: string;
  expenses: string;
};

export type ApiCategorySplit = {
  name: string;
  value: string;
  color: string;
};

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// ── Authenticated fetch ──────────────────────────────────────────────────────

function buildHeaders(base: HeadersInit | undefined, token: string | null): Headers {
  const h = new Headers(base);
  if (token) h.set("Authorization", `Bearer ${token}`);
  return h;
}

function handleAuthFailure(): void {
  clearTokens();
  if (typeof window !== "undefined") window.location.href = "/login";
}

async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const { access, refresh } = await getTokens();

  let res = await fetch(input, { ...init, headers: buildHeaders(init.headers, access) });

  if (res.status !== 401) return res;

  if (!refresh) {
    handleAuthFailure();
    return res;
  }

  const newAccess = await refreshAccessToken(refresh);
  if (!newAccess) {
    handleAuthFailure();
    return res;
  }

  return fetch(input, { ...init, headers: buildHeaders(init.headers, newAccess) });
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
  const res = await apiFetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

async function mutate<T>(path: string, method: string, body: unknown): Promise<T> {
  const res = await apiFetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await res.json();
  return res.json() as Promise<T>;
}

async function del(path: string): Promise<void> {
  const res = await apiFetch(`${API_BASE}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`API ${res.status}: DELETE ${path}`);
}

// ── Read endpoints ───────────────────────────────────────────────────────────

export async function getAccounts(): Promise<ApiAccount[]> {
  const data = await get<Paginated<ApiAccount>>("/accounts/");
  return data.results;
}

export async function getCategories(): Promise<ApiCategory[]> {
  const data = await get<Paginated<ApiCategory>>("/categories/");
  return data.results;
}

export async function getTransactions(
  params?: Record<string, string>
): Promise<Paginated<ApiTransaction>> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return get<Paginated<ApiTransaction>>(`/transactions/${qs}`);
}

export async function getGoals(): Promise<ApiGoal[]> {
  const data = await get<Paginated<ApiGoal>>("/goals/");
  return data.results;
}

export async function getMonthlyFlow(): Promise<ApiMonthlyFlow[]> {
  return get<ApiMonthlyFlow[]>("/analytics/monthly-flow/");
}

export async function getCategorySplit(): Promise<ApiCategorySplit[]> {
  return get<ApiCategorySplit[]>("/analytics/category-split/");
}

export async function getBudgets(): Promise<ApiBudget[]> {
  const data = await get<Paginated<ApiBudget>>("/budgets/");
  return data.results;
}

// ── Budget write endpoints ────────────────────────────────────────────────────

export type CreateBudgetInput = {
  category: string;
  account?: string | null;
  amount_limit: string;
  start_day?: number;
  rollover?: boolean;
};

export async function createBudget(body: CreateBudgetInput): Promise<ApiBudget> {
  return mutate<ApiBudget>("/budgets/", "POST", body);
}

export async function updateBudget(
  id: string,
  body: Partial<CreateBudgetInput>
): Promise<ApiBudget> {
  return mutate<ApiBudget>(`/budgets/${id}/`, "PATCH", body);
}

export async function deleteBudget(id: string): Promise<void> {
  return del(`/budgets/${id}/`);
}

// ── Goal write endpoints ──────────────────────────────────────────────────────

export type CreateGoalInput = {
  label: string;
  target: string;
  current?: string;
  icon?: string;
  color?: string;
};

export async function createGoal(body: CreateGoalInput): Promise<ApiGoal> {
  return mutate<ApiGoal>("/goals/", "POST", body);
}

export async function updateGoal(id: string, body: Partial<CreateGoalInput>): Promise<ApiGoal> {
  return mutate<ApiGoal>(`/goals/${id}/`, "PATCH", body);
}

export async function deleteGoal(id: string): Promise<void> {
  return del(`/goals/${id}/`);
}

// ── Account write endpoints ───────────────────────────────────────────────────

export type CreateAccountInput = {
  name: string;
  balance?: string;
};

export async function createAccount(body: CreateAccountInput): Promise<ApiAccount> {
  return mutate<ApiAccount>("/accounts/", "POST", body);
}

export async function updateAccount(
  id: string,
  body: CreateAccountInput
): Promise<ApiAccount> {
  return mutate<ApiAccount>(`/accounts/${id}/`, "PUT", body);
}

export async function deleteAccount(id: string): Promise<void> {
  return del(`/accounts/${id}/`);
}

// ── Transaction write endpoints ──────────────────────────────────────────────

export type CreateTransactionInput = {
  label: string;
  amount: string;
  date: string;
  type: "income" | "expense";
  account: string;
  category: string;
};

export async function createTransaction(
  body: CreateTransactionInput
): Promise<ApiTransaction> {
  return mutate<ApiTransaction>("/transactions/", "POST", body);
}
