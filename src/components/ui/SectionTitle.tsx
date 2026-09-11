/** Alignment options for SectionTitle. */
type SectionTitleAlign = "left" | "center";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: SectionTitleAlign;
  className?: string;
}

const alignContainerClasses: Record<SectionTitleAlign, string> = {
  left: "text-left items-start",
  center: "text-center items-center mx-auto",
};

/**
 * Reusable section heading component for structural page sections.
 *
 * Enforces `<h2>` semantic hierarchy for SEO (reserving `<h1>` for Hero),
 * provides optional category badge and subtitle, and supports flexible alignment.
 */
export function SectionTitle({
  title,
  subtitle,
  badge,
  align = "left",
  className = "",
}: SectionTitleProps) {
  return (
    <div
      className={[
        "flex flex-col mb-10 max-w-3xl",
        alignContainerClasses[align],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {badge && (
        <span className="mb-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 ring-1 ring-blue-700/10">
          {badge}
        </span>
      )}

      {/* Semantic h2 preserves heading hierarchy across all page sections */}
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-gray-600 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
