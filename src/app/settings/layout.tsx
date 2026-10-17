"use client";

import type { ReactNode } from "react";
import { ToastProvider, Toaster } from "@/components/ui/toast";
import { BranchProvider } from "@/context/branch-context";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <BranchProvider>
        <div className="min-h-dvh bg-surface-muted">{children}</div>
        <Toaster />
      </BranchProvider>
    </ToastProvider>
  );
}
