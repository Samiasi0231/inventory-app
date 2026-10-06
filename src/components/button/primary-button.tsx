import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppButtonProps } from "./types";
 
export const PrimaryButton = forwardRef<HTMLButtonElement, AppButtonProps>(
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
        "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-500 px-5 text-sm font-semibold text-white",
        "transition-colors hover:bg-brand-600 active:bg-brand-700",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/30",
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
PrimaryButton.displayName = "PrimaryButton";