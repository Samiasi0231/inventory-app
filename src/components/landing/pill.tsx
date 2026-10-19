import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
 
interface PillProps {
  children: ReactNode;
  tone?: "mint" | "white";
  className?: string;
}
 
export function Pill({ children, tone = "mint", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "mint" ? "border border-brand-100 bg-brand-50 text-brand-700" : "bg-white text-brand-700 shadow-sm",
        className,
      )}
    >
      {children}
    </span>
  );
}