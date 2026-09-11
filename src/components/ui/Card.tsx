import type { HTMLAttributes, ReactNode } from "react";

/** HTML semantic tags supported as root containers for Card. */
type CardElement = "div" | "article" | "section";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** The semantic HTML element to render as the card root. Defaults to `div`. */
  as?: CardElement;
  /** If true, enables micro-elevation and shadow enhancement on hover. */
  hoverable?: boolean;
  children: ReactNode;
}

interface CardSubComponentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Reusable surface container for grouping related content.
 *
 * Supports semantic HTML tags (`div`, `article`, `section`), optional hover
 * elevation effects, and compound sub-components (`CardHeader`, `CardBody`, `CardFooter`).
 */
export function Card({
  as: Component = "div",
  hoverable = false,
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <Component
      className={[
        "overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs transition-all duration-200",
        hoverable
          ? "hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Component>
  );
}

/** Top slot of a Card, suitable for titles, actions, or metadata banners. */
export function CardHeader({
  className = "",
  children,
  ...rest
}: CardSubComponentProps) {
  return (
    <div
      className={["border-b border-gray-100 px-6 py-5", className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Central content container of a Card with default padding. */
export function CardBody({
  className = "",
  children,
  ...rest
}: CardSubComponentProps) {
  return (
    <div
      className={["px-6 py-5", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Bottom slot of a Card, suitable for action buttons, links, or footer tags. */
export function CardFooter({
  className = "",
  children,
  ...rest
}: CardSubComponentProps) {
  return (
    <div
      className={[
        "flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
