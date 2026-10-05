interface BadgeProps {
  children: React.ReactNode;
  /** Visual variant controls color palette. */
  variant?: "default" | "primary";
}

/**
 * Atomic tag badge primitive (technologies, categories, or status labels).
 *
 * `default` — neutral gray, used in project cards and admin table.
 * `primary` — blue-tinted with ring, used in project detail deep-dives.
 */
export function Badge({ children, variant = "default" }: BadgeProps) {
  const styles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default:
      "inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700",
    primary:
      "inline-flex items-center rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset",
  };

  return <span className={styles[variant]}>{children}</span>;
}
