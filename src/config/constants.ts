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
