import type { ActiveStatusIndicator, StatusIndicator } from "../types/profile";

/**
 * Styling tokens and descriptive copy associated with a status indicator state.
 */
export interface StatusConfig {
  /** Short administrative label describing the status. */
  label: string;
  /** Default public availability text when no custom availability_status is configured. */
  defaultText: string;
  /** Tailwind background color class for the static status indicator dot. */
  dotClass: string;
  /** Tailwind background color class for the animated ping pulse dot. */
  pingClass: string;
  /** Whether the dot displays an animated pulse ping effect. */
  hasPing: boolean;
  /** Tailwind classes for pill-style badges (used in Hero). */
  badgeClass: string;
  /** Tailwind classes for metric icon container boxes (used in Admin Dashboard). */
  boxClass: string;
  /** Tailwind text color class for inline text and icons (used in Footer). */
  textClass: string;
  /** Descriptive label used within admin select dropdowns. */
  selectLabel: string;
}

/**
 * Centralized Single Source of Truth mapping each status indicator to its
 * visual design tokens and localized copy.
 */
export const STATUS_CONFIG: Record<ActiveStatusIndicator, StatusConfig> = {
  success: {
    label: "Available (Active)",
    defaultText: "Available for new opportunities",
    dotClass: "bg-emerald-500",
    pingClass: "bg-emerald-400",
    hasPing: true,
    badgeClass: "border-emerald-500/20 bg-emerald-50/70 text-emerald-700",
    boxClass: "bg-emerald-50 text-emerald-600",
    textClass: "text-emerald-600",
    selectLabel: "Success (Green / Active)",
  },
  warning: {
    label: "Limited Availability",
    defaultText: "Limited availability",
    dotClass: "bg-amber-500",
    pingClass: "bg-amber-400",
    hasPing: true,
    badgeClass: "border-amber-500/20 bg-amber-50/70 text-amber-700",
    boxClass: "bg-amber-50 text-amber-600",
    textClass: "text-amber-600",
    selectLabel: "Warning (Amber / Busy)",
  },
  error: {
    label: "Currently Unavailable",
    defaultText: "Currently unavailable",
    dotClass: "bg-red-500",
    pingClass: "bg-red-400",
    hasPing: false,
    badgeClass: "border-red-500/20 bg-red-50/70 text-red-700",
    boxClass: "bg-red-50 text-red-600",
    textClass: "text-red-600",
    selectLabel: "Error (Red / Unavailable)",
  },
  neutral: {
    label: "Open to Inquiries",
    defaultText: "Open to inquiries",
    dotClass: "bg-gray-400",
    pingClass: "bg-gray-300",
    hasPing: false,
    badgeClass: "border-gray-500/20 bg-gray-50/70 text-gray-700",
    boxClass: "bg-gray-100 text-gray-600",
    textClass: "text-gray-600",
    selectLabel: "Neutral (Gray)",
  },
};

/** Default status indicator used when profile configuration is null or missing. */
export const DEFAULT_STATUS_INDICATOR: ActiveStatusIndicator = "neutral";

/**
 * Safely resolves the status configuration for any StatusIndicator value,
 * falling back gracefully to the neutral configuration for null or unknown keys.
 */
export function getStatusConfig(indicator: StatusIndicator): StatusConfig {
  if (indicator && indicator in STATUS_CONFIG) {
    return STATUS_CONFIG[indicator as ActiveStatusIndicator];
  }
  return STATUS_CONFIG[DEFAULT_STATUS_INDICATOR];
}

/** Pre-ordered list of status options for admin select inputs. */
export const STATUS_OPTIONS: Array<{
  value: ActiveStatusIndicator;
  label: string;
}> = [
  { value: "success", label: STATUS_CONFIG.success.selectLabel },
  { value: "warning", label: STATUS_CONFIG.warning.selectLabel },
  { value: "error", label: STATUS_CONFIG.error.selectLabel },
  { value: "neutral", label: STATUS_CONFIG.neutral.selectLabel },
];
