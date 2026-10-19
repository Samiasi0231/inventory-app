"use client";
 
import { useRouter } from "next/navigation";
import { BusinessTypePicker, OnboardingCard, StepFooter } from "@/components/onboarding";
import { useOnboarding } from "@/context/onboarding-context";
 
export default function BusinessTypePage() {
  const router = useRouter();
  const { businessType, setBusinessType } = useOnboarding();
 
  return (
    <OnboardingCard
      step={1}
      totalSteps={2}
      title="What kind of business do you run?"
      description="Tell us a little about your business so we can tailor RIINOX to your needs"
    >
      <BusinessTypePicker value={businessType} onChange={setBusinessType} />
      <StepFooter
        onBack={() => router.back()}
        nextDisabled={!businessType}
        onNext={() => router.push("/onboarding/business-details")}
      />
    </OnboardingCard>
  );
}