/**
 * API Client — Base Fetch Wrapper
 *
 * Every service function (authService, profileService, projectService) uses
 * this helper instead of calling fetch() directly. This gives us ONE place
 * to handle:
 *   - URL construction (API_BASE_URL + endpoint)
 *   - Auth header injection (Bearer token from localStorage)
 *   - Content-Type logic (JSON vs FormData — see CRITICAL note below)
 *   - Consistent error handling
 *
 * CRITICAL: When the body is FormData (file uploads), we must NOT set
 * Content-Type manually. The browser sets it automatically with the correct
 * multipart boundary. Setting it ourselves would break file uploads.
 */

import { API_BASE_URL, TOKEN_KEY } from "../config/constants";
import type { ApiError, HTTPValidationError } from "../types/api";

// ─── Token helpers ───────────────────────────────────────────────
// We read/write the token from localStorage so it persists across page refreshes.

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Request helper ──────────────────────────────────────────────

interface RequestOptions {
  method?: string;
  body?: unknown;
  /** If true, skip the Authorization header even if a token exists */
  skipAuth?: boolean;
}

/**
 * Makes an HTTP request to the API and returns the parsed JSON response.
 *
 * @param endpoint - The API path (e.g., "/projects/"). Will be appended to API_BASE_URL.
 * @param options  - HTTP method, body, and auth control.
 * @returns The parsed JSON response, typed as T.
 * @throws {ApiError} on non-2xx responses, with status and parsed error details.
 *
 * @example
 *   // GET request (no body, with auth)
 *   const projects = await apiRequest<ProjectResponse[]>("/projects/");
 *
 *   // POST JSON body
 *   const newProject = await apiRequest<ProjectResponse>("/projects/", {
 *     method: "POST",
 *     body: { title: "My App", description: "..." },
 *   });
 *
 *   // POST FormData (file upload) — Content-Type is set by browser
 *   const formData = new FormData();
 *   formData.append("file", imageFile);
 *   const updated = await apiRequest<ProjectResponse>("/projects/1/upload-image", {
 *     method: "POST",
 *     body: formData,
 *   });
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, skipAuth = false } = options;

  // ── Build headers ──
  const headers: Record<string, string> = {};

  // Auth: attach Bearer token if available (and not explicitly skipped)
  if (!skipAuth) {
    const token = getStoredToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // Content-Type: only set for JSON bodies.
  // FormData must NOT have a manual Content-Type — the browser handles it.
  const isFormData = body instanceof FormData;
  if (body && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // ── Make the request ──
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  // ── Handle errors ──
  if (!response.ok) {
    const apiError: ApiError = {
      status: response.status,
      message: `Request failed: ${response.status} ${response.statusText}`,
    };

    // Try to parse validation errors (422) for user-friendly messages
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

  // ── Handle 204 No Content (e.g., DELETE responses) ──
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
