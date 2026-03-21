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

// ── Helpers ─────────────────────────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
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

// ── Write endpoints ──────────────────────────────────────────────────────────

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
  const res = await fetch(`${API_BASE}/transactions/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json();
    throw err;
  }
  return res.json() as Promise<ApiTransaction>;
}
