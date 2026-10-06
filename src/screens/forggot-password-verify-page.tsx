"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CenteredHeading } from "@/components/auth";
import { useOnboarding } from "@/context/onboarding-context";
import { VerifyCodeForm } from "@/features/auth/verify-code-form";
import { authApi } from "@/lib/api";
 
export default function ForgotPasswordVerifyPage() {
  const router = useRouter();
  const { email, setResetToken } = useOnboarding();
 
  // The email comes from the previous step — send people back if it's missing.
  useEffect(() => {
    if (!email) router.replace("/forgot-password");
  }, [email, navigate]);
 
  return (
    <section>
      <CenteredHeading
        title="Verify code"
        description={`Enter verification code sent to ${email}`}
        descriptionTone="muted"
      />
      <VerifyCodeForm
        centered
        onVerify={async (code) => {
          const { token } = await authApi.verifyResetCode({ email, code });
          setResetToken(token);
          router.push("/forgot-password/reset");
        }}
        onResend={async () => {
          await authApi.forgotPassword({ email });
        }}
      />
    </section>
  );
}