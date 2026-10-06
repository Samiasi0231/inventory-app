"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface OnboardingState {
  email: string;
  setEmail: (email: string) => void;
  businessType: string | null;
  setBusinessType: (type: string | null) => void;
  /** Short-lived token returned after the password-reset code is verified. */
  resetToken: string | null;
  setResetToken: (token: string | null) => void;
}

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const value = useMemo(
    () => ({ email, setEmail, businessType, setBusinessType, resetToken, setResetToken }),
    [email, businessType, resetToken],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside <OnboardingProvider>");
  return ctx;
}