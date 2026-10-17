import { cn } from "@/lib/utils";
 
interface OnboardingHeaderProps {
  title: string;
  description?: string;
  className?: string;
}
 
/** Left-aligned heading used inside <OnboardingCard>. */
export function OnboardingHeader({ title, description, className }: OnboardingHeaderProps) {
  return (
    <div className={cn(className)}>
      <h1 className="text-2xl font-bold text-neutral-900 sm:text-[28px] sm:leading-9">{title}</h1>
      {description && <p className="mt-1 text-base text-neutral-700">{description}</p>}
    </div>
  );
}