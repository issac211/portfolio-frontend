import { API_BASE_URL, TOKEN_KEY } from "../config/constants";
import type { ApiError, HTTPValidationError } from "../types/api";

// ─── Token Helpers ───────────────────────────────────────────────

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Request Helper ──────────────────────────────────────────────

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** If true, skip the Authorization header even if a token exists. */
  skipAuth?: boolean;
}

/**
 * Central fetch wrapper used by all service functions.
 *
 * @param endpoint - API path appended to `API_BASE_URL` (e.g., `"/projects/"`).
 * @param options  - HTTP method, body, and auth control.
 * @returns Parsed JSON response typed as `T`.
 * @throws {ApiError} On non-2xx responses, with parsed validation details when available.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, skipAuth = false } = options;

  const headers: Record<string, string> = {};

  if (!skipAuth) {
    const token = getStoredToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Both FormData and URLSearchParams are self-describing bodies whose
  // Content-Type (multipart/form-data and application/x-www-form-urlencoded)
  // must be set by the browser to include the correct boundary or encoding.
  const isNativeBody = body instanceof FormData || body instanceof URLSearchParams;
  if (body && !isNativeBody) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: isNativeBody ? (body as BodyInit) : body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // TypeError is thrown by the browser when the server is unreachable
    // (network down, DNS failure, CORS preflight abort, etc.)
    // Normalizing here means every hook/page automatically gets the
    // friendly message without any per-call handling.
    if (err instanceof TypeError) {
      throw {
        status: 0,
        message: "Network error: Cannot connect to the server.",
      } satisfies ApiError;
    }
    throw err;
  }

  if (!response.ok) {
    const apiError: ApiError = {
      status: response.status,
      message: `Request failed: ${response.status} ${response.statusText}`,
    };

    try {
      const errorBody = (await response.json()) as HTTPValidationError;
      if (errorBody.detail) {
        apiError.validationErrors = errorBody.detail;
        apiError.message = errorBody.detail.map((e) => e.msg).join(", ");
      }
    } catch {
      // Response body wasn't JSON — keep the generic message
    }

    throw apiError;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
