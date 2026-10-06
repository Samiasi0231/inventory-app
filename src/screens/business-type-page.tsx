"use client";

import { useRouter } from "next/navigation";
import { BusinessTypePicker, OnboardingHeader, StepFooter } from "@/components/onboarding";
import { useOnboarding } from "@/context/onboarding-context";
 
export default function BusinessTypePage() {
  const router = useRouter();
  const { businessType, setBusinessType } = useOnboarding();
 
  return (
    <section>
      <OnboardingHeader
        title="What kind of business do you run?"
        description="This helps us tailor your workspace to meet your business needs"
      />
      <BusinessTypePicker value={businessType} onChange={setBusinessType} />
      <StepFooter
        nextDisabled={!businessType}
        onNext={() => router.push("/onboarding/business-details")}
      />
    </section>
  );
}