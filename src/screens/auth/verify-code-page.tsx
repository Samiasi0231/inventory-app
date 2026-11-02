"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthHeading, BackLink } from "@/components/auth";
import { useOnboarding } from "@/context/onboarding-context";
import { VerifyCodeForm } from "@/features/auth/verify-code-form";
import { useActivateAndLogin, useResendActivation } from "@/lib/api/"; 

export default function VerifyCodePage() {
  const router = useRouter();
  const { email } = useOnboarding();
  const verify = useActivateAndLogin(); // [2] POST /api/users/activation/ then login
  const resend = useResendActivation(); // [3] POST /api/users/resend_activation/

  // [4] no email in memory (page refreshed or opened directly): back to sign up
  useEffect(() => {
    if (!email) router.replace("/signup");
  }, [email, router]);

  return (
    <div>
      <BackLink to="/signup">Back to Create Account</BackLink>
      <AuthHeading
        title="Verify code"
        description="An authentication code has been sent to your email."
      />
      <VerifyCodeForm
        onVerify={async (code) => {
          // [5] the code goes to the backend as `token`, then the user is logged in
          const result = await verify.mutateAsync({ email, token: code });
          // logged in -> verified screen -> business type
          // not logged in (the password was lost on a refresh) -> sign in, email is already verified
          router.replace(result.loggedIn ? "/verified" : "/signin");
        }}
        onResend={async () => {
          await resend.mutateAsync({ email });
        }}
      />
    </div>
  );
}