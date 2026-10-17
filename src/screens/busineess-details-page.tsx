"use client";
 
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingCard } from "@/components/onboarding";
import { useOnboarding } from "@/context/onboarding-context";
import { BusinessDetailsForm } from "@/features/onboarding/business-details-form";
 
export default function BusinessDetailsPage() {
  const router = useRouter();
  const { businessType } = useOnboarding();
 
  // A business type is required to land here — send people back if it's missing.
  useEffect(() => {
    if (!businessType) router.replace("/onboarding/business-type");
  }, [businessType, router]);
 
  return (
    <OnboardingCard
      step={2}
      totalSteps={2}
      title="Tell us about your business."
      description="A few details will help us set up your workspace and regional preferences."
    >
      <BusinessDetailsForm />
    </OnboardingCard>
  );
}