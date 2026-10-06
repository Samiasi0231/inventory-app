"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MailCheck } from "lucide-react";
import { StatusScreen } from "@/components/feedback/status-screen";
 
export default function VerifiedPage() {
  const router = useRouter();
 
  useEffect(() => {
    const id = window.setTimeout(() => router.replace("/onboarding/business-type"), 2000);
    return () => window.clearTimeout(id);
  }, [router]);
 
  return (
    <StatusScreen
      icon={MailCheck}
      title="Verified!"
      description="You have successfully verified your email"
    />
  );
}