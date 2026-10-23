"use client";

import { useRouter } from "next/navigation";
import { AuthHeading, BackLink } from "@/components/auth";
import { useOnboarding } from "@/context/onboarding-context";
import { VerifyCodeForm } from "@/features/auth/verify-code-form";
import { authApi } from "@/lib/api";
 
export default function VerifyCodePage() {
  const router = useRouter();
  const { email } = useOnboarding();
 
  return (
    <div>
      <BackLink to="/signup">Back to Create Account</BackLink>
      <AuthHeading
        title="Verify code"
        description="An authentication code has been sent to your email."
      />
      <VerifyCodeForm
        onVerify={async (code) => {
          await authApi.verifyCode({ email, code });
          router.push("/verified");
        }}
        onResend={async () => {
          await authApi.resendCode({ email });
        }}
      />
    </div>
  );
}