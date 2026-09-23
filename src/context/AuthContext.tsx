import { createContext, useContext, useState, type ReactNode } from "react";
import {
  getStoredToken,
  removeStoredToken,
  setStoredToken,
} from "../services/apiClient";

// ─── Types ───────────────────────────────────────────────────────

/** Values exposed to any consumer of the auth context. */
interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  saveToken: (token: string) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// ─── Context ─────────────────────────────────────────────────────

/**
 * Initialized as `null` so `useAuthContext` can throw
 * when called outside of `<AuthProvider>`.
 */
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────

export function AuthProvider({ children }: AuthProviderProps) {
  // Lazy initializer avoids reading localStorage on every re-render.
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  function saveToken(newToken: string) {
    setStoredToken(newToken);
    setToken(newToken);
  }

  function logout() {
    removeStoredToken();
    setToken(null);
  }

  const value: AuthContextValue = {
    token,
    isAuthenticated: token !== null,
    saveToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Consumer Hook ───────────────────────────────────────────────

/** Reads auth state from the nearest `<AuthProvider>`. Throws if none exists. */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuthContext must be used within an <AuthProvider>");
  }
  return context;
}
