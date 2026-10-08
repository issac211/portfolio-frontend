import type { StatusIndicator } from "../../types/profile";
import { getStatusConfig } from "../../utils/status";

export interface StatusDotProps {
  /** Backend status indicator enum value or null. */
  indicator: StatusIndicator;
  /** Optional custom CSS classes for the outer relative container. */
  className?: string;
}

/**
 * Animated status indicator dot.
 *
 * Renders a solid color circle, paired with an animated ping pulse
 * when the status indicates active availability.
 */
export function StatusDot({ indicator, className = "" }: StatusDotProps) {
  const config = getStatusConfig(indicator);

  return (
    <span className={`relative flex h-2 w-2 shrink-0 ${className}`}>
      {config.hasPing && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.pingClass} opacity-75`}
          aria-hidden="true"
        />
      )}
      <span
        className={`relative inline-flex h-2 w-2 rounded-full ${config.dotClass}`}
        aria-hidden="true"
      />
    </span>
  );
}

export interface StatusBadgeProps {
  /** Backend status indicator enum value or null. */
  indicator: StatusIndicator;
  /** Optional custom text override; falls back to config.defaultText if omitted or empty. */
  text?: string | null;
  /** Visual presentation mode: "pill" (Hero style with border) or "inline" (Footer style). */
  variant?: "pill" | "inline";
  /** Optional extra Tailwind utility classes. */
  className?: string;
}

/**
 * Reusable availability badge component displaying a status dot and descriptive text.
 *
 * Provides two variants:
 * - `pill`: Encapsulated rounded pill with subtle background and border (Hero section).
 * - `inline`: Clean text and dot combination matching footer typography (Footer section).
 */
export function StatusBadge({
  indicator,
  text,
  variant = "pill",
  className = "",
}: StatusBadgeProps) {
  const config = getStatusConfig(indicator);
  const displayText = text?.trim() || config.defaultText;

  if (variant === "inline") {
    return (
      <div
        className={`flex items-center gap-2 text-xs font-medium ${config.textClass} ${className}`}
      >
        <StatusDot indicator={indicator} />
        <span>{displayText}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium ${config.badgeClass} ${className}`}
    >
      <StatusDot indicator={indicator} />
      <span>{displayText}</span>
    </div>
  );
}
