import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CenteredHeading } from "@/components/auth";
import { useOnboarding } from "@/context/onboarding-context";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
 
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetToken } = useOnboarding();
 
  // A verified code is required to land here.
  useEffect(() => {
    if (!resetToken) navigate("/forgot-password", { replace: true });
  }, [resetToken, navigate]);
 
  return (
    <section>
      <CenteredHeading title="Forgot password?" description="Enter and confirm your new password." />
      <ResetPasswordForm />
    </section>
  );
}