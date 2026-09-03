/** Base URL for all API requests (no trailing slash) */
export const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * Base URL for rendering images returned by the API.
 * The API returns relative paths — components must build the full URL:
 * `${IMAGE_BASE_URL}${image_url}`
 */
export const IMAGE_BASE_URL = "http://localhost:8000";

/** localStorage key for the JWT token */
export const TOKEN_KEY = "portfolio_auth_token";
