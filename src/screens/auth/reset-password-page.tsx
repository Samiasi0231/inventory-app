"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CenteredHeading } from "@/components/auth";
import { useOnboarding } from "@/context/onboarding-context";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { BackLink } from "@/components/auth";
 
export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetToken } = useOnboarding();
 
  // A verified code is required to land here.
  useEffect(() => {
    if (!resetToken) router.replace("/forgot-password");
  }, [resetToken, router]);
 
  return (
    <section>
       <BackLink to="/forgot-password">Back</BackLink>
      <CenteredHeading title="Forgot password?" description="Enter and confirm your new password." />
      <ResetPasswordForm />
    </section>
  );
}