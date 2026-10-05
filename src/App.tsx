import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ToastContainer } from "./components/ui/Toast";
import { AppRouter } from "./router/AppRouter";

/**
 * Singleton QueryClient instance for caching, deduplication, and background refetching.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes fresh data window
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Root component. Providers are layered outermost-first:
 * QueryClientProvider → ToastProvider → AuthProvider → Router.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ToastContainer />
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
