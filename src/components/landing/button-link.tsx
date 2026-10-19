import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
 
type Variant = "primary" | "white" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";
 
const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  white: "bg-white text-brand-700 hover:bg-brand-50",
  outline: "border border-brand-500 bg-white text-brand-600 hover:bg-brand-50",
  ghost: "text-white/90 hover:text-white",
};
 
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};
 
type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
};
 
/** A <Link> that looks like a button (landing-page CTAs). */
export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/40",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}