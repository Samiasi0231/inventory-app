import { ArrowRight } from "lucide-react";
import { PrimaryButton } from "@/components/button";
import { cn } from "@/lib/utils";
 
interface CenteredSubmitProps {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  /** Show the trailing arrow icon. */
  withArrow?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
  className?: string;
}
 
/** Centered, fixed-width primary action used on single-column screens. */
export function CenteredSubmit({
  label = "Continue",
  loading,
  disabled,
  withArrow = true,
  type = "submit",
  onClick,
  className,
}: CenteredSubmitProps) {
  return (
    <div className={cn("mt-6 flex justify-center", className)}>
      <PrimaryButton
        type={type}
        onClick={onClick}
        loading={loading}
        disabled={disabled}
        rightIcon={withArrow ? <ArrowRight className="size-4" aria-hidden /> : undefined}
        className="w-full max-w-[272px]"
      >
        {label}
      </PrimaryButton>
    </div>
  );
}