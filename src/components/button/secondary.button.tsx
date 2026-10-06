import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppButtonProps } from "./types";
 
export const SecondaryButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    { className, children, loading = false, leftIcon, rightIcon, fullWidth, disabled, type = "button", ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-neutral-200 bg-white px-5 text-sm font-semibold text-brand-600",
        "transition-colors hover:bg-neutral-50 active:bg-neutral-100",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/20",
        "disabled:cursor-not-allowed disabled:opacity-60",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  ),
);
SecondaryButton.displayName = "SecondaryButton";