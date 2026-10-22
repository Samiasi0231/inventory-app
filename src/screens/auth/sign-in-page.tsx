import { AuthFooterLink, AuthHeading } from "@/components/auth";
import { SignInForm } from "@/features/auth/sign-in-form";
import { BackLink } from "@/components/auth";
 
export default function SignInPage() {
  return (
    <div>
      <BackLink to="/">Back</BackLink>
      <AuthHeading title="Welcome back!" description="Sign in to continue to your workspace." />
      <SignInForm />
      <AuthFooterLink prompt="Don't have an account?" linkLabel="Sign up" to="/signup" />
    </div>
  );
}