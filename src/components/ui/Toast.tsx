import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
  XIcon,
} from "./icons";
import { useToast, type Toast, type ToastVariant } from "../../context/ToastContext";

// ─── Variant Style Maps ───────────────────────────────────────────

/**
 * Exhaustive Tailwind class lookup keyed by variant.
 * Using a Record<ToastVariant, …> ensures TypeScript will error if a
 * new variant is added to the union without updating this table.
 */
const variantStyles: Record<
  ToastVariant,
  { border: string; iconColor: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  success: {
    border:    "border-l-green-500",
    iconColor: "text-green-600",
    Icon:      CheckCircleIcon,
  },
  error: {
    border:    "border-l-red-500",
    iconColor: "text-red-600",
    Icon:      ExclamationCircleIcon,
  },
  info: {
    border:    "border-l-blue-500",
    iconColor: "text-blue-600",
    Icon:      InfoCircleIcon,
  },
};

// ─── Single Toast Item ────────────────────────────────────────────

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  // Two-phase animation: mount → animate-toast-in, dismiss → animate-toast-out
  const [exiting, setExiting] = useState(false);

  const handleClose = () => {
    setExiting(true);
    // Allow the exit keyframe to complete before removing from context state
    setTimeout(() => onRemove(toast.id), 300);
  };

  // Begin exit animation 300 ms before the context auto-removes the toast
  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), toast.duration - 300);
    return () => clearTimeout(exitTimer);
  }, [toast.duration]);

  const { border, iconColor, Icon } = variantStyles[toast.variant];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        // Layout
        "pointer-events-auto flex items-start gap-3",
        // Spacing & shape
        "px-4 py-3.5 rounded-lg",
        // Appearance
        "bg-white border-l-4 shadow-md",
        // Variant border color (from lookup table)
        border,
        // Animation — resolved from index.css keyframes
        exiting ? "animate-toast-out" : "animate-toast-in",
      ].join(" ")}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-px ${iconColor}`} />

      <p className="flex-1 text-sm font-medium text-slate-800 leading-snug break-words">
        {toast.message}
      </p>

      <button
        onClick={handleClose}
        aria-label="Dismiss notification"
        className="shrink-0 flex items-center justify-content-center p-0.5 rounded text-slate-400 hover:text-slate-600 transition-colors duration-150 cursor-pointer"
      >
        <XIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Toast Container (Portal) ─────────────────────────────────────

/**
 * Renders all active toasts into `document.body` via a React Portal.
 * Mount once at the app root — the portal bypasses the React tree's
 * CSS stacking context, so it works for both PublicLayout and AdminLayout.
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return ReactDOM.createPortal(
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-[calc(100vw-3rem)]"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>,
    document.body,
  );
}
