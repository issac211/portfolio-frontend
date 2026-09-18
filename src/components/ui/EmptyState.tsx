import type { ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────

interface EmptyStateProps {
  /** Icon element rendered above the heading. Pass an icon sized externally. */
  icon: ReactNode;
  title: string;
  description?: string;
  /** Optional action slot — pass a `<Button>` or `<Link>` CTA. */
  action?: ReactNode;
  /** Visual style of the container border. Defaults to `"dashed"`. */
  variant?: "dashed" | "solid";
}

// ─── Component ───────────────────────────────────────────────────

/**
 * Generic empty-state panel used wherever a data collection is empty
 * or a resource has not yet been configured.
 *
 * Intentionally presentational — callers own the icon, copy, and CTA.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "dashed",
}: EmptyStateProps) {
  const borderClass =
    variant === "dashed"
      ? "border-dashed border-gray-300 bg-white"
      : "border-gray-200 bg-gray-50/60";

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border px-8 py-14 text-center ${borderClass}`}
    >
      {/* Icon wrapper — subtle circular backdrop */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        {icon}
      </div>

      <h3 className="text-base font-semibold text-gray-900">{title}</h3>

      {description && (
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
