import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
 
interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  /** Shown on the right of the error row, e.g. a "Forgot password" link. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}
 
export function FormField({ label, htmlFor, error, action, children, className }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-xs font-medium text-neutral-700">
        {label}
      </Label>
      {children}
      {(error || action) && (
        <div className="flex items-start justify-between gap-3">
          {error ? (
            <p role="alert" className="text-[11px] text-red-600">
              {error}
            </p>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
    </div>
  );
}
