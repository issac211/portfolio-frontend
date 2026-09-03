import { API_BASE_URL } from "../config/constants";
import type { LoginRequest, Token } from "../types/auth";
import type { ApiError } from "../types/api";

/**
 * Sends login credentials and returns a JWT token.
 *
 * Uses direct `fetch` instead of `apiRequest` because the endpoint
 * expects `application/x-www-form-urlencoded` (OAuth2 password flow), not JSON.
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
