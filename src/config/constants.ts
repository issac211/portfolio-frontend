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
 * Base URL for rendering local media assets returned by the API in development.
 * In production, absolute CDN URLs (e.g. Cloudinary) are returned instead.
 * Components must resolve all images via `getImageUrl(imagePath)` in `utils/image.ts`.
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
