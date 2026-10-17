import { cn } from "@/lib/utils";
 
interface StepIndicatorProps {
  current: number;
  total: number;
  className?: string;
}
 
/** "Step 1 out of 2" + progress bars. */
export function StepIndicator({ current, total, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex flex-col items-end gap-1.5", className)}>
      <span className="text-[10px] text-neutral-500">
        Step {current} out of {total}
      </span>
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: total }).map((_, index) => (
          <span
            key={index}
            className={cn("h-[3px] w-5 rounded-full", index < current ? "bg-brand-500" : "bg-neutral-200")}
          />
        ))}
      </div>
    </div>
  );
}
