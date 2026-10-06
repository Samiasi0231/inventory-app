import { CenteredHeading } from "@/components/auth";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
 
export default function ForgotPasswordPage() {
  return (
    <section>
      <CenteredHeading title="Forgot password?" description="Enter your email to reset your password." />
      <ForgotPasswordForm />
    </section>
  );
}