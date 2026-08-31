/**
 * Authentication Service
 *
 * Handles the login endpoint. Note: this is the ONE service that does NOT
 * use our generic apiRequest helper, because the login endpoint expects
 * `application/x-www-form-urlencoded` (OAuth2 password flow), not JSON.
 */

import { API_BASE_URL } from "../config/constants";
import type { LoginRequest, Token } from "../types/auth";
import type { ApiError } from "../types/api";

/**
 * Sends login credentials to the API and returns a JWT token.
 *
 * The API expects form-urlencoded data (OAuth2 spec), not JSON:
 *   Content-Type: application/x-www-form-urlencoded
 *   Body: username=xxx&password=yyy
 */
export async function login(credentials: LoginRequest): Promise<Token> {
  const formBody = new URLSearchParams({
    username: credentials.username,
    password: credentials.password,
  });

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody,
  });

  if (!response.ok) {
    const apiError: ApiError = {
      status: response.status,
      message:
        response.status === 401
          ? "Invalid username or password"
          : `Login failed: ${response.status} ${response.statusText}`,
    };
    throw apiError;
  }

  return response.json() as Promise<Token>;
}
