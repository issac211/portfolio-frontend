/**
 * Shared API Error Types
 * Derived from: api-contract.json → ValidationError, HTTPValidationError
 *
 * These represent the error response shape when the API returns 422 (Validation Error).
 * We use them to parse and display user-friendly error messages.
 */

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface HTTPValidationError {
  detail: ValidationError[];
}

/**
 * A generic wrapper for API errors that our apiClient will throw.
 * This gives us a consistent error shape across the entire app.
 */
export interface ApiError {
  status: number;
  message: string;
  validationErrors?: ValidationError[];
}
