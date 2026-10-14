interface IconProps {
  className?: string;
}

/**
 * Downward-pointing solid triangle (caret) icon.
 * Features subtle corner rounding for an elegant, modern UI aesthetic.
 */
export function TriangleDownIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 12.25a.75.75 0 0 1-.6-.3L2.65 6.2a.75.75 0 0 1 .58-1.2h9.54a.75.75 0 0 1 .58 1.2l-4.75 5.75a.75.75 0 0 1-.6.3z" />
    </svg>
  );
}
