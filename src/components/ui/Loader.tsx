/** Predefined spinner diameters. */
type LoaderSize = "sm" | "md" | "lg";

interface LoaderProps {
  size?: LoaderSize;
  /** Additional classes applied to the outer wrapper. */
  className?: string;
}

const sizeClasses: Record<LoaderSize, string> = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4",
};

/** Accessible CSS-only spinner. Wraps in a flex container for easy centering. */
export function Loader({ size = "md", className = "" }: LoaderProps) {
  return (
    <div
      role="status"
      className={["flex items-center justify-center py-8", className]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        className={[
          "inline-block animate-spin rounded-full border-blue-600 border-t-transparent",
          sizeClasses[size],
        ].join(" ")}
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
