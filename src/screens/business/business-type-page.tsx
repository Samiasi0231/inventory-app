"use client";

import { useRouter } from "next/navigation";
import { FormAlert } from "@/components/auth";
import { BusinessTypePicker, OnboardingCard, StepFooter } from "@/components/onboarding";
import { useOnboarding } from "@/context/onboarding-context";
import { useBusinessTypeCards } from "@/features/onboarding/use-bussiness-type-card";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { getErrorMessage } from "@/lib/api/index";

export default function BusinessTypePage() {
  const router = useRouter();
  const { businessType, setBusinessType } = useOnboarding();
  const { cards, isLoading, error, refetch } = useBusinessTypeCards();

  useAuthGuard("onboarding");

  return (
    <OnboardingCard
      step={1}
      totalSteps={2}
      title="What kind of business do you run?"
      description="Tell us a little about your business so we can tailor RIINOX to your needs"
    >
      {isLoading ? (
        <p className="text-sm text-neutral-500" role="status">
          Loading business types…
        </p>
      ) : error ? (
        <div className="flex flex-col items-start gap-3">
          <FormAlert message={getErrorMessage(error)} />
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <BusinessTypePicker value={businessType} onChange={setBusinessType} options={cards} />
      )}

      <StepFooter
        onBack={() => router.back()}
        nextDisabled={!businessType || isLoading || Boolean(error)}
        onNext={() => router.push("/onboarding/business-details")}
      />
    </OnboardingCard>
  );
}