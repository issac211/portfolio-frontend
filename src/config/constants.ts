/**
 * Application Constants
 *
 * Centralized configuration values. If the backend moves to a different
 * host or port, we only change these values — nothing else in the app.
 */

/** Base URL for all API requests (no trailing slash) */
export const API_BASE_URL = "http://localhost:8000/api/v1";

/**
 * Base URL for rendering images returned by the API.
 *
 * The API returns relative paths like "/uploads/profile/img.jpg".
 * Components must build the full URL: `${IMAGE_BASE_URL}${image_url}`
 */
export const IMAGE_BASE_URL = "http://localhost:8000";

/**
 * Token key used in localStorage for the JWT
 */
export const TOKEN_KEY = "portfolio_auth_token";
