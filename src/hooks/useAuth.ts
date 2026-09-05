import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { login as loginRequest } from "../services/authService";
import type { ApiError } from "../types/api";

/**
 * Bridges `AuthContext` (state) with `authService` (API).
 * Returns auth state plus `handleLogin` / `handleLogout` actions
 * with built-in loading and error tracking.
 */
export function useAuth() {
  const { token, isAuthenticated, saveToken, logout } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(username: string, password: string) {
    setIsLoading(true);
    setError(null);

    try {
      const { access_token } = await loginRequest({ username, password });
      saveToken(access_token);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    logout();
  }

  return { token, isAuthenticated, isLoading, error, handleLogin, handleLogout };
}
