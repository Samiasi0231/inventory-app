import { useNavigate } from "react-router-dom";
import { ArrowRight, Gem } from "lucide-react";
import { PrimaryButton } from "@/components/button";
import { StatusScreen } from "@/components/feedback/status-screen";
 
export default function PasswordChangedPage() {
  const navigate = useNavigate();
 
  return (
    <StatusScreen
      icon={Gem}
      iconStyle="plain"
      title="Password successfully changed!"
      description="You have successfully changed your password"
    >
      <PrimaryButton
        onClick={() => navigate("/signin", { replace: true })}
        rightIcon={<ArrowRight className="size-4" aria-hidden />}
        className="mt-6 w-full max-w-[290px]"
      >
        Sign in
      </PrimaryButton>
    </StatusScreen>
  );
}