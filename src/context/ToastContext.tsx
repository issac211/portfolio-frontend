import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  /** Auto-dismiss delay in ms. Defaults to 4000. */
  duration: number;
}

interface AddToastOptions {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

/** Values exposed to every consumer of the toast context. */
interface ToastContextValue {
  toasts: Toast[];
  addToast: (options: AddToastOptions) => void;
  removeToast: (id: string) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

// ─── Context ─────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Ref map prevents stale-closure issues when clearing multiple timers
  // that were scheduled at different points in time.
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ message, variant = "info", duration = 4000 }: AddToastOptions) => {
      const id = crypto.randomUUID();
      const toast: Toast = { id, message, variant, duration };

      setToasts((prev) => [...prev, toast]);

      // Schedule auto-dismiss; the timer is stored so removeToast can cancel it
      // if the user closes the toast manually before it expires.
      const timer = setTimeout(() => removeToast(id), duration);
      timers.current.set(id, timer);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// ─── Consumer Hook ───────────────────────────────────────────────

/** Reads toast state from the nearest `<ToastProvider>`. Throws if none exists. */
// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return context;
}
