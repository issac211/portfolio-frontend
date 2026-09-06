import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

/**
 * Route guard that wraps all `/admin` routes.
 * Renders child routes via `<Outlet />` if authenticated,
 * otherwise redirects to `/login`.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    // `replace` prevents the login page from stacking in browser history,
    // so pressing "Back" after login doesn't loop back to /login.
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
