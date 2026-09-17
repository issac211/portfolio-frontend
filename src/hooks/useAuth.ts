import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { login as loginRequest } from "../services/authService";
import type { ApiError } from "../types/api";

/**
 * Bridges `AuthContext` (state) with `authService` (API).
 * Returns auth state plus `handleLogin` / `handleLogout` actions
 * with built-in loading and error tracking.
 *
 * Error strategy:
 * - 401 (wrong credentials) → `error` local state, rendered inline on LoginPage.
 * - 5xx / network failure → global error toast (unexpected system failure).
 */
export function useAuth() {
  const { token, isAuthenticated, saveToken, logout } = useAuthContext();
  const { addToast } = useToast();
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

      // 401 = expected user error (wrong password) → stay inline
      if (apiError.status === 401) {
        setError("Invalid username or password.");
      } else {
        // Unexpected system/network failure → global toast
        addToast({
          message: apiError.message || "Login failed due to a server error. Please try again.",
          variant: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    logout();
  }

  return { token, isAuthenticated, isLoading, error, handleLogin, handleLogout };
}
