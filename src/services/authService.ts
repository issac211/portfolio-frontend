import type { LoginRequest, Token } from "../types/auth";
import { apiRequest } from "./apiClient";

/**
 * Sends login credentials and returns a JWT token.
 *
 * FastAPI's OAuth2PasswordRequestForm expects `application/x-www-form-urlencoded`,
 * which `URLSearchParams` produces. `apiRequest` detects it as a native body and
 * lets the browser set Content-Type automatically.
 */
export async function login(credentials: LoginRequest): Promise<Token> {
  const formBody = new URLSearchParams({
    username: credentials.username,
    password: credentials.password,
  });

  return apiRequest<Token>("/auth/login", {
    method: "POST",
    body: formBody,
    skipAuth: true,
  });
}
