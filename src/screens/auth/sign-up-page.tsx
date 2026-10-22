import { AuthFooterLink, AuthHeading } from "@/components/auth";
import { SignUpForm } from "@/features/auth/sign-up-form";
import { BackLink } from "@/components/auth";
 
export default function SignUpPage() {
  return (
    <div>
       <BackLink to="/">Back</BackLink>
      <AuthHeading title="Get started with us!" />
      <SignUpForm />
      <AuthFooterLink prompt="Already have an account?" linkLabel="Sign in" to="/signin" />
    </div>
  );
}