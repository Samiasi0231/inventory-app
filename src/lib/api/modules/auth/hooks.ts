"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import type { ApiError } from "../../core";
import { authSession, subscribeToSession, type AuthSessionData } from "./session";
import { authService } from "./service";
import type {
  ActivateAccountPayload,
  ActivateAndLoginResult,
  ApiMessage,
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  ResendActivationPayload,
  ResendActivationResponse,
  ResetPasswordConfirmPayload,
  SetEmailPayload,
  SetPasswordPayload,
} from "./types";

type Options<TData, TVariables> = Omit<
  UseMutationOptions<TData, ApiError, TVariables>,
  "mutationFn"
>;

// ───────── sign-up → verify email ─────────

export function useRegister(
  options?: Options<RegisterResponse, RegisterPayload>,
) {
  return useMutation<RegisterResponse, ApiError, RegisterPayload>({
    mutationFn: authService.register,
    ...options,
  });
}

export function useActivateAccount(
  options?: Options<ApiMessage, ActivateAccountPayload>,
) {
  return useMutation<ApiMessage, ApiError, ActivateAccountPayload>({
    mutationFn: authService.activate,
    ...options,
  });
}

/** Verify the emailed code, then log the new user in automatically. See authService.activateAndLogin. */
export function useActivateAndLogin(
  options?: Options<ActivateAndLoginResult, ActivateAccountPayload>,
) {
  return useMutation<ActivateAndLoginResult, ApiError, ActivateAccountPayload>({
    mutationFn: authService.activateAndLogin,
    ...options,
  });
}

export function useResendActivation(
  options?: Options<ResendActivationResponse, ResendActivationPayload>,
) {
  return useMutation<ResendActivationResponse, ApiError, ResendActivationPayload>({
    mutationFn: authService.resendActivation,
    ...options,
  });
}

// ───────── session ─────────

export function useLogin(options?: Options<LoginResponse, LoginPayload>) {
  return useMutation<LoginResponse, ApiError, LoginPayload>({
    mutationFn: authService.login,
    ...options,
  });
}

export function useLogout(options?: Options<void, void>) {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, void>({
    mutationFn: authService.logout,
    ...options,
    // Always wipe cached data on logout, success or not.
    onSettled: (...args) => {
      queryClient.clear();
      return options?.onSettled?.(...args);
    },
  });
}

/**
 * The persisted login snapshot: `{ user, registrationComplete }`, or null when logged out.
 * Re-renders on login / logout (also across tabs). Null during server render.
 */
export function useAuthSession(): AuthSessionData | null {
  return useSyncExternalStore(subscribeToSession, authSession.get, () => null);
}

// ───────── password / email ─────────

export function useForgotPassword(
  options?: Options<ApiMessage, ForgotPasswordPayload>,
) {
  return useMutation<ApiMessage, ApiError, ForgotPasswordPayload>({
    mutationFn: authService.forgotPassword,
    ...options,
  });
}

export function useResetPasswordConfirm(
  options?: Options<ApiMessage, ResetPasswordConfirmPayload>,
) {
  return useMutation<ApiMessage, ApiError, ResetPasswordConfirmPayload>({
    mutationFn: authService.resetPasswordConfirm,
    ...options,
  });
}

export function useSetPassword(options?: Options<ApiMessage, SetPasswordPayload>) {
  return useMutation<ApiMessage, ApiError, SetPasswordPayload>({
    mutationFn: authService.setPassword,
    ...options,
  });
}

export function useSetEmail(options?: Options<ApiMessage, SetEmailPayload>) {
  return useMutation<ApiMessage, ApiError, SetEmailPayload>({
    mutationFn: authService.setEmail,
    ...options,
  });
}
