/** Everything that creates, confirms, secures or ends a session, even where the path lives under /users/. */
export const authEndpoints = {
  // sign-up and email verification
  register: "/api/users/",
  activation: "/api/users/activation/",
  resendActivation: "/api/users/resend_activation/",
  // session
  login: "/api/auth/jwt/login/",
  refresh: "/api/auth/jwt/refresh/",
  verify: "/api/auth/jwt/verify/",
  logout: "/api/users/logout/",
  // password / email management
  /** ASSUMED (standard Djoser path, not in the Swagger you sent): emails the reset code. */
  resetPassword: "/api/users/reset_password/",
  resetPasswordConfirm: "/api/users/reset_password_confirm/",
  setPassword: "/api/users/set_password/",
  setEmail: "/api/users/set_email/",
} as const;
