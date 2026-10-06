
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
 
export interface SignUpPayload {
  email: string;
  password: string;
}
 
export interface SignInPayload {
  email: string;
  password: string;
}
 
export interface ResetPasswordPayload {
  email: string;
  token: string;
  password: string;
}
 
export interface BusinessDetailsPayload {
  businessType: string;
  businessName: string;
  staffRange: string;
  country: string;
  address: string;
  city: string;
  postalCode?: string;
  currency: string;
  taxId?: string;
}
 
export const authApi = {
  async signUp(payload: SignUpPayload) {
    await sleep(700);
    return { email: payload.email };
  },
  async signIn(payload: SignInPayload) {
    await sleep(700);
    return { email: payload.email };
  },
  async signUpWithGoogle() {
    await sleep(400);
    return { email: "google-user@example.com" };
  },
  async verifyCode(_payload: { email: string; code: string }) {
    await sleep(700);
    return { verified: true };
  },
  async resendCode(_payload: { email: string }) {
    await sleep(500);
    return { sent: true };
  },
 
  // --- Forgot password -------------------------------------------------------
  async forgotPassword(_payload: { email: string }) {
    await sleep(700);
    return { sent: true };
  },
  async verifyResetCode(_payload: { email: string; code: string }) {
    await sleep(700);
    return { token: "reset_token_demo" };
  },
  async resetPassword(_payload: ResetPasswordPayload) {
    await sleep(800);
    return { changed: true };
  },
};
 
export const onboardingApi = {
  async saveBusiness(_payload: BusinessDetailsPayload) {
    await sleep(900);
    return { workspaceId: "ws_demo" };
  },
};