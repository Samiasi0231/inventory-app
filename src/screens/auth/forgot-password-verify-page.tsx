"use client";
// The emailed code IS the token for reset_password_confirm, so this step only keeps it;
// the backend checks it on the next screen. (There is no separate "verify code" endpoint.)

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CenteredHeading } from "@/components/auth";
import { useOnboarding } from "@/context/onboarding-context";
import { VerifyCodeForm } from "@/features/auth/verify-code-form";
import { useForgotPassword } from "@/lib/api/index"; // [1] replaces authApi
import { BackLink } from "@/components/auth";

export default function ForgotPasswordVerifyPage() {
  const router = useRouter();
  const { email, setResetToken } = useOnboarding();
  const forgotPassword = useForgotPassword(); // [2] resend = ask for a new code

  useEffect(() => {
    if (!email) router.replace("/forgot-password");
  }, [email, router]);

  return (
    <section>
      {/* [3] was "/forgot-password/reset": Back returns to the email step */}
      <BackLink to="/forgot-password">Back</BackLink>
      <CenteredHeading
        title="Verify code"
        description={`Enter verification code sent to ${email}`}
        descriptionTone="muted"
      />

      <VerifyCodeForm
        centered
        onVerify={async (code) => {
          setResetToken(code); // [4] no API call here: the code is checked on the reset screen
          router.push("/forgot-password/reset");
        }}
        onResend={async () => {
          await forgotPassword.mutateAsync({ email });
        }}
      />
    </section>
  );
}