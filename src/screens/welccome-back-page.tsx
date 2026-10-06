"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";
import { StatusScreen } from "@/components/feedback/status-screen";
 
export default function WelcomeBackPage() {
  const router = useRouter();
 
  useEffect(() => {
    const id = window.setTimeout(() => router.replace("/dashboard"), 2000);
    return () => window.clearTimeout(id);
  }, [router]);
 
  return (
    <StatusScreen
      icon={MailCheck}
      title="Welcome back!"
      description="Glad to have you back on Riinox"
    />
  );
}