import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { StatusScreen } from "@/components/feedback/status-screen";
 
export default function VerifiedPage() {
  const navigate = useNavigate();
 
  useEffect(() => {
    const id = window.setTimeout(() => navigate("/onboarding/business-type", { replace: true }), 2000);
    return () => window.clearTimeout(id);
  }, [navigate]);
 
  return (
    <StatusScreen
      icon={MailCheck}
      title="Verified!"
      description="You have successfully verified your email"
    />
  );
}