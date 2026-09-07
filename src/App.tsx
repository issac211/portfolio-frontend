import { AuthProvider } from "./context/AuthContext";
import { AppRouter } from "./router/AppRouter";

/**
 * Root component. Wraps the entire app with `AuthProvider`
 * so auth state is available to all routes and components.
 */
export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
