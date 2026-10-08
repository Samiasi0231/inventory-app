import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StepSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/** The bordered card each wizard step sits inside. */
export function StepSection({ title, description, children, className }: StepSectionProps) {
  return (
    <section className={cn("rounded-xl border border-border/70 p-5", className)}>
      <header className="mb-5">
        <h3 className="text-base font-semibold text-ink-1">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-ink-3">{description}</p>}
      </header>
      {children}
    </section>
  );
}

/** Smaller heading used for groups inside a step, e.g. "Quantity Discounts". */
export function StepSubsection({
  title,
  description,
  children,
  className,
}: StepSectionProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div>
        <h4 className="text-sm font-semibold text-ink-1">{title}</h4>
        {description && <p className="mt-0.5 text-xs text-ink-3">{description}</p>}
      </div>
      {children}
    </div>
  );
}
