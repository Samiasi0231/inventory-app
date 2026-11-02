/** Generic body for endpoints whose 200 response the docs only show as an echo. */
export type ApiMessage = Record<string, unknown>;

// ───────── sign-up ─────────

/** POST /api/users/ */
export interface RegisterPayload {
  name?: string;
  email: string;
  password: string;
  re_password: string;
}

/** 201 response: no tokens, so the user must verify their email and then log in. */
export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
}

/** POST /api/users/activation/ — `token` is the 6-digit code emailed to the user. */
export interface ActivateAccountPayload {
  email: string;
  token: string;
}

/** Result of verifying the email and then logging in automatically. */
export interface ActivateAndLoginResult {
  /** false when the auto-login wasn't possible (e.g. page was refreshed): send the user to sign in. */
  loggedIn: boolean;
  registrationComplete: boolean;
}

/** POST /api/users/resend_activation/ */
export interface ResendActivationPayload {
  email: string;
}

export interface ResendActivationResponse {
  email: string;
}

// ───────── session ─────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

/** The user as returned by login (there is no /users/me/ yet). */
export interface SetupInfo {
  id: number;
  email: string;
  name: string;
}

export interface LoginResponse extends AuthTokens {
  setup_info: SetupInfo;
  /** Assumed: true once the business onboarding is finished. Confirm with the backend. */
  registration_complete: boolean;
}

export interface RefreshPayload {
  refresh: string;
}

export interface RefreshResponse {
  access: string;
  // Only present when the backend rotates refresh tokens.
  refresh?: string;
}

export interface VerifyTokenPayload {
  token: string;
}

// ───────── password / email ─────────

/** POST /api/users/reset_password/ (assumed endpoint) */
export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordConfirmPayload {
  email: string;
  token: string;
  new_password: string;
  re_new_password: string;
}

export interface SetPasswordPayload {
  current_password: string;
  new_password: string;
  re_new_password: string;
}

export interface SetEmailPayload {
  current_password: string;
  new_email: string;
}
