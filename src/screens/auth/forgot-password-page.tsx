import { CenteredHeading } from "@/components/auth";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
 import { BackLink } from "@/components/auth";
export default function ForgotPasswordPage() {
  return (
    <section>
      <BackLink to="/">Back</BackLink>
      <CenteredHeading title="Forgot password?" description="Enter your email to reset your password." />
      <ForgotPasswordForm />
    </section>
  );
}