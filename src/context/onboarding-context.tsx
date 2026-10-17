"use client";
 
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
 
export interface BusinessProfile {
   fullName: string;
  businessName: string;
  city: string;
  country: string;
}
 
interface OnboardingState {
  email: string;
  setEmail: (email: string) => void;
  businessType: string | null;
  setBusinessType: (type: string | null) => void;
  /** Saved after the business details step; shown on the "You're all set" screen. */
  businessProfile: BusinessProfile | null;
  setBusinessProfile: (profile: BusinessProfile | null) => void;
  /** Account owner's name, if your API returns it. Hidden on the summary when empty. */
  fullName: string;
  setFullName: (name: string) => void;
  /** Short-lived token returned after the password-reset code is verified. */
  resetToken: string | null;
  setResetToken: (token: string | null) => void;
}
 
const OnboardingContext = createContext<OnboardingState | null>(null);
 
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState<string | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
 
  const value = useMemo(
    () => ({
      email,
      setEmail,
      businessType,
      setBusinessType,
      businessProfile,
      setBusinessProfile,
      fullName,
      setFullName,
      resetToken,
      setResetToken,
    }),
    [email, businessType, businessProfile, fullName, resetToken],
  );
 
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}
 
// eslint-disable-next-line react-refresh/only-export-components
export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside <OnboardingProvider>");
  return ctx;
}