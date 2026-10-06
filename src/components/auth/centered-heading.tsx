import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
 
interface CenteredHeadingProps {
  title: string;
  description?: ReactNode;
  /** "default": larger dark text. "muted": smaller grey text. */
  descriptionTone?: "default" | "muted";
  className?: string;
}
 
/** Heading for single-column (no side image) screens. */
export function CenteredHeading({ title, description, descriptionTone = "default", className }: CenteredHeadingProps) {
  return (
    <div className={cn("mb-8 text-center", className)}>
      <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
      {description && (
        <p className={cn("mt-2", descriptionTone === "muted" ? "text-sm text-neutral-500" : "text-base text-neutral-700")}>
          {description}
        </p>
      )}
    </div>
  );
}