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
    // Collapsing grid row: takes real space when open, so the confirm field moves down.
    <div
      className={cn(
        "grid transition-all duration-200 ease-out",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="overflow-hidden">
        <ul
          id={id}
          aria-label="Password requirements"
          aria-hidden={!open}
          className="mt-1 flex flex-col gap-1.5 rounded-md border border-neutral-200 bg-white p-3 shadow-md"
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
    </div>
  );
}