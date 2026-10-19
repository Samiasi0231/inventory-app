"use client";
 
import { CircleCheck } from "lucide-react";
import { passwordRules } from "@/features/auth/auth.schema";
import { cn } from "@/lib/utils";
 
interface PasswordRequirementsProps {
  password: string;
  /** Whether the dropdown is visible (typically: password input is focused). */
  open: boolean;
  id?: string;
}
 
/** Dropdown under the password input listing the rules and which are met. */
export function PasswordRequirements({ password, open, id }: PasswordRequirementsProps) {
  return (
    // Zero-height anchor so the dropdown overlays the form instead of pushing it down.
    <div className="relative h-0">
      <ul
        id={id}
        aria-label="Password requirements"
        aria-hidden={!open}
        className={cn(
          "absolute inset-x-0 top-0 z-20 flex flex-col gap-1.5 rounded-md border border-neutral-200 bg-white p-3 shadow-md",
          "transition duration-200",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        {passwordRules.map((rule) => {
          const passed = rule.test(password);
          return (
            <li
              key={rule.id}
              className={cn(
                "flex items-center gap-1.5 text-[11px] transition-colors",
                passed ? "text-brand-600" : "text-neutral-500",
              )}
            >
              <CircleCheck className={cn("size-3.5", passed ? "text-brand-500" : "text-neutral-300")} aria-hidden />
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}