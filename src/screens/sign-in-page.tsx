import { AuthFooterLink, AuthHeading } from "@/components/auth";
import { SignInForm } from "@/features/auth/sign-in-form";
 
export default function SignInPage() {
  return (
    <div>
      <AuthHeading title="Welcome back!" description="Sign in to continue to your workspace." />
      <SignInForm />
      <AuthFooterLink prompt="Don't have an account?" linkLabel="Sign up" to="/signup" />
    </div>
  );
}