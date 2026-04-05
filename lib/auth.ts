const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export const ACCESS_TOKEN_KEY = "lgb_access";
export const REFRESH_TOKEN_KEY = "lgb_refresh";

// ── Storage (localStorage + cookie mirror) ────────────────────────────────────

const COOKIE_OPTS = "; path=/; SameSite=Lax; Max-Age=2592000";

export function setTokens(access: string, refresh: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  document.cookie = `${ACCESS_TOKEN_KEY}=${access}${COOKIE_OPTS}`;
  document.cookie = `${REFRESH_TOKEN_KEY}=${refresh}${COOKIE_OPTS}`;
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  document.cookie = `${ACCESS_TOKEN_KEY}=; path=/; Max-Age=0`;
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; Max-Age=0`;
}

/** Reads access token — localStorage (client) or cookie (server). */
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") return localStorage.getItem(ACCESS_TOKEN_KEY);
  return null;
}

/** Reads both tokens — works on server (via cookies) and client (via localStorage). */
export async function getTokens(): Promise<{ access: string | null; refresh: string | null }> {
  if (typeof window !== "undefined") {
    return {
      access: localStorage.getItem(ACCESS_TOKEN_KEY),
      refresh: localStorage.getItem(REFRESH_TOKEN_KEY),
    };
  }
  // Server-side: read from request cookies
  const { cookies } = await import("next/headers");
  const store = await cookies();
  return {
    access: store.get(ACCESS_TOKEN_KEY)?.value ?? null,
    refresh: store.get(REFRESH_TOKEN_KEY)?.value ?? null,
  };
}

// ── Error helper ──────────────────────────────────────────────────────────────

export function extractErrorMessage(err: unknown, fallback = "Une erreur est survenue"): string {
  if (!err || typeof err !== "object") return fallback;
  const obj = err as Record<string, unknown>;
  if (typeof obj.detail === "string") return obj.detail;
  const first = Object.values(obj)[0];
  if (Array.isArray(first) && typeof first[0] === "string") return first[0];
  if (typeof first === "string") return first;
  return fallback;
}

// ── Auth API calls ────────────────────────────────────────────────────────────

export async function login(
  username: string,
  password: string
): Promise<{ access: string; refresh: string }> {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw await res.json().catch(() => ({}));
  return res.json();
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
  password2: string;
}): Promise<{ access: string; refresh: string }> {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json().catch(() => ({}));
  return res.json();
}

export async function refreshAccessToken(
  refresh: string
): Promise<string | null> {
  const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) return null;
  const { access } = await res.json();
  setTokens(access, refresh);
  return access;
}
