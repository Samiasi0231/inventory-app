import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
 
/** Centered content column (1200px max) used by every section. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-6", className)} {...props} />;
}