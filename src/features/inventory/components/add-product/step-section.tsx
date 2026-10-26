import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StepSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function StepSection({ title, description, children, className }: StepSectionProps) {
  return (
    <section className={cn("rounded-xl border border-border/70 p-6", className)}>
      <header className="mb-7">
        <h3 className="text-xl font-semibold text-ink-1">{title}</h3>
        {description && <p className="mt-2 text-xs text-ink-3">{description}</p>}
      </header>
      {children}
    </section>
  );
}

export function StepSubsection({
  title,
  description,
  children,
  className,
}: StepSectionProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div>
        <h4 className="text-base font-medium text-ink-1">{title}</h4>
        {description && <p className="mt-2 text-xs text-ink-3">{description}</p>}
      </div>
      {children}
    </div>
  );
}
