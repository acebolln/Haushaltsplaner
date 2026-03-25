/**
 * Google OAuth Session Data
 * Stored in encrypted iron-session cookie
 */
export interface GoogleSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Unix timestamp in milliseconds
  email: string;
}

/**
 * Client-side Google Auth State
 * Used by useGoogleAuth hook
 */
export interface GoogleAuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
  loading: boolean;
}

/**
 * Google OAuth Token Response
 * Returned by googleapis after code exchange
 */
export interface GoogleTokenResponse {
  access_token: string;
  refresh_token?: string;
  expiry_date: number;
  token_type: string;
  scope: string;
}
