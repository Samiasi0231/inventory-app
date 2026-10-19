import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SettingsCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("settings-card rounded-xl bg-surface p-5", className)}>{children}</section>
  );
}
