"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingHeader } from "@/components/onboarding";
import { useOnboarding } from "@/context/onboarding-context";
import { BusinessDetailsForm } from "@/features/onboarding/business-details-form";
 
export default function BusinessDetailsPage() {
  const router = useRouter();
  const { businessType } = useOnboarding();
 
  
  useEffect(() => {
    if (!businessType) router.replace("/onboarding/business-type");
  }, [businessType, navigator]);
 
  return (
    <section>
      <OnboardingHeader
        title="Your Business details?"
        description="Help us set up your workspace with the right information."
      />
      <BusinessDetailsForm />
    </section>
  );
}