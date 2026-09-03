/** Single field-level validation error returned by the API (422). */
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

/** Wrapper for 422 Validation Error responses. */
export interface HTTPValidationError {
  detail: ValidationError[];
}

/** Normalized error shape thrown by `apiClient` for consistent error handling across the app. */
export interface ApiError {
  status: number;
  message: string;
  validationErrors?: ValidationError[];
}
