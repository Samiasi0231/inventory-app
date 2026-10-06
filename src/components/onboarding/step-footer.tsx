import { ArrowLeft, ArrowRight } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { cn } from "@/lib/utils";
 
interface StepFooterProps {
  /** When provided, a Back button is shown on the left. */
  onBack?: () => void;
  backLabel?: string;
  nextLabel?: string;
  nextType?: "button" | "submit";
  onNext?: () => void;
  nextDisabled?: boolean;
  loading?: boolean;
  className?: string;
}
 
export function StepFooter({
  onBack,
  backLabel = "Back",
  nextLabel = "Continue",
  nextType = "button",
  onNext,
  nextDisabled,
  loading,
  className,
}: StepFooterProps) {
  return (
    <div
      className={cn(
        "mt-10 flex items-center border-t border-neutral-200 pt-6",
        onBack ? "justify-between" : "justify-center",
        className,
      )}
    >
      {onBack && (
        <SecondaryButton onClick={onBack} leftIcon={<ArrowLeft className="size-4" aria-hidden />}>
          {backLabel}
        </SecondaryButton>
      )}
      <PrimaryButton
        type={nextType}
        onClick={onNext}
        disabled={nextDisabled}
        loading={loading}
        rightIcon={<ArrowRight className="size-4" aria-hidden />}
        className={cn(!onBack && "w-full max-w-[220px]")}
      >
        {nextLabel}
      </PrimaryButton>
    </div>
  );
}