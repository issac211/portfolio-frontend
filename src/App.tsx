import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/ui/Toast";
import { AppRouter } from "./router/AppRouter";

/**
 * Root component. Providers are layered outermost-first:
 * ToastProvider → AuthProvider → Router, so any layer (including auth flows)
 * can surface toast notifications.
 */
export default function App() {
  return (
    <ToastProvider>
      <ToastContainer />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ToastProvider>
  );
}
