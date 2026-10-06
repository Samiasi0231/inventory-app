import { useNavigate } from "react-router-dom";
import { AuthHeading, BackLink } from "@/components/auth";
import { useOnboarding } from "@/context/onboarding-context";
import { VerifyCodeForm } from "@/features/auth/verify-code-form";
import { authApi } from "@/lib/api";
 
export default function VerifyCodePage() {
  const navigate = useNavigate();
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
          navigate("/verified");
        }}
        onResend={async () => {
          await authApi.resendCode({ email });
        }}
      />
    </div>
  );
}