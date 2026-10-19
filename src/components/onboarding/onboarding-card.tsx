import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { OnboardingHeader } from "@/components/onboarding/onboarding-header";
import { StepIndicator } from "@/components/onboarding/step-indicator";
 
interface OnboardingCardProps {
  step: number;
  totalSteps?: number;
  title: string;
  description?: string;
  children: ReactNode;
}
 
/** White card ("fill") that frames every onboarding step. */
export function OnboardingCard({ step, totalSteps = 2, title, description, children }: OnboardingCardProps) {
  return (
    <section className="rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <Logo />
        <StepIndicator current={step} total={totalSteps} />
      </div>
      <OnboardingHeader title={title} description={description} className="mt-4" />
      <div className="mt-8">{children}</div>
    </section>
  );
}