import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-xl border border-gray-100 bg-white p-5",
        className,
      )}
      {...props}
    />
  );
}
