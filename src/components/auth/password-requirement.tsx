import { CircleCheck } from "lucide-react";
import { passwordRules } from "@/features/auth/auth.schema";
import { cn } from "@/lib/utils";
 
export function PasswordRequirements({ password }: { password: string }) {
  return (
    <ul className="mt-1 flex flex-col gap-1" aria-label="Password requirements">
      {passwordRules.map((rule) => {
        const passed = rule.test(password);
        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-1.5 text-[10px] transition-colors",
              passed ? "text-brand-600" : "text-neutral-500",
            )}
          >
            <CircleCheck className={cn("size-3", passed ? "text-brand-500" : "text-neutral-300")} aria-hidden />
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}