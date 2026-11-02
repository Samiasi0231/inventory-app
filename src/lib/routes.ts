/** signIn comes from your password-changed page. EDIT signUp if your folder is named differently. */
export const ROUTES = {
  signIn: "/signin",
  signUp: "/signup",
  verifyEmail: "/verify",
  verified: "/verified",
  welcomeBack: "/welcome-back",
  forgotPassword: "/forgot-password",
  forgotPasswordVerify: "/forgot-password/verify",
  forgotPasswordReset: "/forgot-password/reset",
  passwordChanged: "/password-changed",
  businessType: "/onboarding/business-type",
  dashboard: "/dashboard",
} as const;
