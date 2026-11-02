import { fetcher, tokenStorage } from "../../core";
import type { User } from "../users/types";
import { authEndpoints } from "./endpoints";
import { pendingCredentials } from "./pending-credentials";
import { authSession } from "./session";
import type {
  ActivateAccountPayload,
  ActivateAndLoginResult,
  ApiMessage,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RefreshResponse,
  RegisterPayload,
  RegisterResponse,
  ResendActivationPayload,
  ResendActivationResponse,
  ResetPasswordConfirmPayload,
  SetEmailPayload,
  SetPasswordPayload,
  VerifyTokenPayload,
} from "./types";

// ───────── sign-up → verify email ─────────

function register(payload: RegisterPayload) {
  return fetcher.post<RegisterResponse, RegisterPayload>(
    authEndpoints.register,
    payload,
    { skipAuth: true },
  );
}

function activate(payload: ActivateAccountPayload) {
  return fetcher.post<ApiMessage, ActivateAccountPayload>(
    authEndpoints.activation,
    payload,
    { skipAuth: true },
  );
}

function resendActivation(payload: ResendActivationPayload) {
  return fetcher.postForm<ResendActivationResponse, ResendActivationPayload>(
    authEndpoints.resendActivation,
    payload,
    { skipAuth: true },
  );
}

// ───────── session ─────────

async function login(payload: LoginPayload): Promise<LoginResponse> {
  const data = await fetcher.postForm<LoginResponse, LoginPayload>(
    authEndpoints.login,
    payload,
    { skipAuth: true },
  );
  tokenStorage.setTokens({ access: data.access, refresh: data.refresh });
  authSession.set({
    user: data.setup_info,
    registrationComplete: data.registration_complete,
  });
  return data;
}

/**
 * New-user path: verify the emailed code, then log in with the credentials kept in memory
 * since sign-up, so the user lands on the business setup without typing anything again.
 * If the code is wrong, activation throws and nothing else happens.
 * If the email is verified but auto-login isn't possible, it resolves { loggedIn: false }.
 */
async function activateAndLogin(
  payload: ActivateAccountPayload,
): Promise<ActivateAndLoginResult> {
  await activate(payload);

  const credentials = pendingCredentials.take(payload.email);
  if (!credentials) return { loggedIn: false, registrationComplete: false };

  try {
    await login(credentials);
    // A user who has only just verified their email cannot have an organization yet, so
    // onboarding is NOT finished, whatever `registration_complete` says. (The backend currently
    // returns true here, which made the route guard skip the business setup.)
    authSession.patch({ registrationComplete: false });
    return { loggedIn: true, registrationComplete: false };
  } catch {
    return { loggedIn: false, registrationComplete: false };
  }
}

function refresh(refreshToken: string) {
  return fetcher.postForm<RefreshResponse>(
    authEndpoints.refresh,
    { refresh: refreshToken },
    { skipAuth: true },
  );
}

function verify(payload: VerifyTokenPayload) {
  return fetcher.postForm<Record<string, never>, VerifyTokenPayload>(
    authEndpoints.verify,
    payload,
    { skipAuth: true },
  );
}

/** Local session is cleared even if the server call fails. */
async function logout(): Promise<void> {
  try {
    await fetcher.get<User>(authEndpoints.logout);
  } finally {
    tokenStorage.clearTokens();
    authSession.clear();
    pendingCredentials.clear();
  }
}

// ───────── password / email ─────────

function forgotPassword(payload: ForgotPasswordPayload) {
  return fetcher.post<ApiMessage, ForgotPasswordPayload>(
    authEndpoints.resetPassword,
    payload,
    { skipAuth: true },
  );
}

function resetPasswordConfirm(payload: ResetPasswordConfirmPayload) {
  return fetcher.post<ApiMessage, ResetPasswordConfirmPayload>(
    authEndpoints.resetPasswordConfirm,
    payload,
    { skipAuth: true },
  );
}

function setPassword(payload: SetPasswordPayload) {
  return fetcher.post<ApiMessage, SetPasswordPayload>(
    authEndpoints.setPassword,
    payload,
  );
}

function setEmail(payload: SetEmailPayload) {
  return fetcher.post<ApiMessage, SetEmailPayload>(authEndpoints.setEmail, payload);
}

export const authService = {
  register,
  activate,
  activateAndLogin,
  resendActivation,
  login,
  refresh,
  verify,
  logout,
  forgotPassword,
  resetPasswordConfirm,
  setPassword,
  setEmail,
};