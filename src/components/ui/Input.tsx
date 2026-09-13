import {
  useId,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

/** Shared configuration props across all input element variants. */
interface BaseFieldProps {
  /** Visible label displayed above the input control. */
  label?: string;
  /** Validation error message displayed below the input. Triggers red border and aria-invalid. */
  error?: string;
  /** Supplementary instruction or guidance text displayed below the input. */
  helperText?: string;
  /** If true, expands the container to 100% width. Defaults to true. */
  fullWidth?: boolean;
  /** Custom CSS classes for the outer wrapper container. */
  containerClassName?: string;
}

/** Props when rendering a standard single-line `<input>` element. */
export interface TextInputProps
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  as?: "input";
}

/** Props when rendering a multi-line `<textarea>` element. */
export interface TextareaInputProps
  extends BaseFieldProps,
    TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: "textarea";
  rows?: number;
}

/** Discriminated union type supporting both standard inputs and textareas with strict type safety. */
export type InputProps = TextInputProps | TextareaInputProps;

/**
 * Reusable form input component supporting single-line inputs and multi-line textareas.
 *
 * Implements a discriminated union for strict tag-specific typing, generates accessible
 * DOM IDs via React 19 `useId` to connect labels and ARIA descriptions, and enforces visual
 * and screen-reader accessible error/helper states.
 */
export function Input(props: InputProps) {
  const generatedId = useId();
  const {
    as = "input",
    label,
    error,
    helperText,
    fullWidth = true,
    containerClassName = "",
    id,
    className = "",
    required,
    disabled,
    ...rest
  } = props;

  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const ariaDescribedBy =
    [error ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const baseControlClasses = [
    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500",
    error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
      : "border-gray-300 focus:border-blue-600 focus:ring-blue-600/20",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={[
        "flex flex-col",
        fullWidth ? "w-full" : "",
        containerClassName,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {as === "textarea" ? (
        <textarea
          id={inputId}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
          rows={4}
          className={baseControlClasses}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
          className={baseControlClasses}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="mt-1.5 text-xs text-gray-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
