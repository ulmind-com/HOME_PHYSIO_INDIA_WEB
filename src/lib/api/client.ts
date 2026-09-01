import { tokenStore } from "@/services/api/tokens";

export const API_BASE = import.meta.env.VITE_API_UPSTREAM ?? "https://home-physio-india-backend.onrender.com/api/v1";

export type Envelope<T> = {
  success: boolean;
  message?: string;
  data: T;
  errors?: unknown;
};

export type Paginated<T> = {
  items: T[];
  pagination?: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
};

export type PaginatedResponse<T> = Paginated<T>;

export class ApiError extends Error {
  status: number;
  payload?: unknown;
  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

type FetchOpts = {
  method?: string;
  body?: unknown;
  formData?: FormData;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  query?: Record<string, string | number | boolean | undefined | null>;
  _isRetry?: boolean;
};

export async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const base = typeof window !== "undefined" ? window.location.origin : "http://localhost:8080";
  const url = new URL(`${API_BASE}${path}`, base);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    }
  }

  const init: RequestInit = {
    method: opts.method ?? "GET",
    headers: { Accept: "application/json", ...(opts.headers ?? {}) },
    signal: opts.signal,
  };

  if (opts.formData) {
    init.body = opts.formData;
  } else if (opts.body !== undefined) {
    (init.headers as Record<string, string>)["Content-Type"] = "application/json";
    init.body = JSON.stringify(opts.body);
  }

  const access = tokenStore.getAccess();
  if (access) {
    (init.headers as Record<string, string>)["Authorization"] = `Bearer ${access}`;
  }

  const res = await fetch(url.toString(), init);
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* non-JSON */
  }

  if (!res.ok) {
    const msg =
      (json as { message?: string; detail?: string } | null)?.message ??
      (json as { detail?: string } | null)?.detail ??
      `Request failed (${res.status})`;
      
    if (res.status === 401 && !opts._isRetry && !path.includes("/auth/login") && !path.includes("/auth/refresh")) {
      const refresh = tokenStore.getRefresh();
      if (refresh) {
        try {
          const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ refresh_token: refresh }),
          });
          if (refreshRes.ok) {
            const refreshJson = await refreshRes.json();
            const newAccess = refreshJson?.data?.access_token ?? refreshJson?.access_token;
            if (newAccess) {
              tokenStore.setAccess(newAccess);
              return apiFetch<T>(path, { ...opts, _isRetry: true });
            }
          }
        } catch {
          /* refresh failed */
        }
      }
      tokenStore.clear();
      if (typeof window !== "undefined" && !url.pathname.includes("/login")) {
        const event = new CustomEvent("hpi:auth:unauthorized");
        window.dispatchEvent(event);
      }
    }
    
    throw new ApiError(msg, res.status, json);
  }

  const env = json as Envelope<T> | T;
  if (env && typeof env === "object" && "data" in (env as object) && "success" in (env as object)) {
    return (env as Envelope<T>).data;
  }
  return env as T;
}

export const api = {
  get: <T>(path: string, query?: FetchOpts["query"], signal?: AbortSignal) =>
    apiFetch<T>(path, { query, signal }),
  post: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiFetch<T>(path, { method: "POST", body, signal }),
  postForm: <T>(path: string, formData: FormData, signal?: AbortSignal) =>
    apiFetch<T>(path, { method: "POST", formData, signal }),
  put: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiFetch<T>(path, { method: "PUT", body, signal }),
  patch: <T>(path: string, body?: unknown, signal?: AbortSignal) =>
    apiFetch<T>(path, { method: "PATCH", body, signal }),
  delete: <T>(path: string, signal?: AbortSignal) =>
    apiFetch<T>(path, { method: "DELETE", signal }),
  putForm: <T>(path: string, formData: FormData, signal?: AbortSignal) =>
    apiFetch<T>(path, { method: "PUT", formData, signal }),
};
