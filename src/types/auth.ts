/**
 * Authentication Types
 * Derived from: api-contract.json → Token, Body_login_for_access_token
 *
 * The login endpoint uses OAuth2 password flow (application/x-www-form-urlencoded),
 * so LoginRequest represents the form fields we send — not a JSON body.
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}
