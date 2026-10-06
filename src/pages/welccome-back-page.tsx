import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { StatusScreen } from "@/components/feedback/status-screen";
 
export default function WelcomeBackPage() {
  const navigate = useNavigate();
 
  useEffect(() => {
    const id = window.setTimeout(() => navigate("/dashboard", { replace: true }), 2000);
    return () => window.clearTimeout(id);
  }, [navigate]);
 
  return (
    <StatusScreen
      icon={MailCheck}
      title="Welcome back!"
      description="Glad to have you back on Riinox"
    />
  );
}