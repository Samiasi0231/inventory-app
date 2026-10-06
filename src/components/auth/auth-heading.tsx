import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
 
interface AuthHeadingProps {
  title: string;
  description?: ReactNode;
  className?: string;
}
 
export function AuthHeading({ title, description, className }: AuthHeadingProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h1 className="text-2xl font-bold text-neutral-800">{title}</h1>
      {description && <p className="mt-2 text-xs text-neutral-500">{description}</p>}
    </div>
  );
}