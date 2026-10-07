/**
 * Retrieves a required environment variable.
 * Throws an error if missing to enforce fail-fast configuration.
 */
function getRequiredEnvVar(key: string): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(
      `CRITICAL CONFIG ERROR: Missing required environment variable: ${key}`,
    );
  }
  return value;
}

/** Base URL for all API requests (no trailing slash) */
export const API_BASE_URL = getRequiredEnvVar("VITE_API_BASE_URL");

/**
 * Base URL for rendering images returned by the API.
 * The API returns relative paths — components must build the full URL:
 * `${IMAGE_BASE_URL}${image_url}`
 */
export const IMAGE_BASE_URL = getRequiredEnvVar("VITE_IMAGE_BASE_URL");

/** localStorage key for the JWT token */
export const TOKEN_KEY = "portfolio_auth_token";

/**
 * Centralized React Query cache keys.
 * All queries and mutations must consume this object to prevent typo drift.
 */
export const QUERY_KEYS = {
  profile: ["profile"] as const,
  projects: ["projects"] as const,
  project: (id: number) => ["projects", id] as const,
} as const;
