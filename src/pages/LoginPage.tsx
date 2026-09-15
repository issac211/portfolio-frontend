import { useState, useEffect, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/** Login page — redirects to `/admin` on successful authentication. */
export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, handleLogin } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Redirect to admin when auth state flips to authenticated.
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    handleLogin(username, password);
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 py-8">
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 w-full max-w-sm p-6 sm:p-8 bg-white rounded-xl border border-slate-200 shadow-md"
      >
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Username
          <input
            id="login-username"
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-300 text-base outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Password
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-gray-300 text-base outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </label>

        <button
          id="login-submit"
          type="submit"
          disabled={isLoading}
          className="mt-2 py-3 rounded-lg bg-blue-600 text-white text-base font-semibold cursor-pointer hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
