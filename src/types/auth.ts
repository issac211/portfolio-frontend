/** Credentials sent to the login endpoint as `application/x-www-form-urlencoded` (OAuth2 password flow). */
export interface LoginRequest {
  username: string;
  password: string;
}

/** JWT token pair returned by `POST /auth/login`. */
export interface Token {
  access_token: string;
  token_type: string;
}
