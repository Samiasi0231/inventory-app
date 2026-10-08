"use client";

import { useState, type ReactNode } from "react";
import { XIcon } from "lucide-react";
import { AppSidebar } from "@/layout/app-sidebar";
import { AppTopbar } from "@/layout/app-topbar";
import { BranchProvider } from "@/context/branch-context";
import { ToastProvider, Toaster } from "@/components/ui/toast";

/**
 * Application chrome: sidebar, topbar, branch context and toasts. Nav structure
 * lives in `nav-config.ts`.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ToastProvider>
      <BranchProvider>
        <div className="flex min-h-screen bg-surface-muted">
          <AppSidebar className="sticky top-0 hidden h-screen lg:flex" />

          {mobileNavOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileNavOpen(false)}
                className="absolute inset-0 bg-black/30"
              />
              <div className="absolute inset-y-0 left-0 flex">
                <AppSidebar className="h-screen" />
                <button
                  type="button"
                  aria-label="Close navigation"
                  onClick={() => setMobileNavOpen(false)}
                  className="m-2 h-9 rounded-lg bg-surface p-2 text-ink-2 shadow-sm"
                >
                  <XIcon className="size-5" />
                </button>
              </div>
            </div>
          )}

          <div className="flex min-w-0 flex-1 flex-col">
            <AppTopbar onOpenSidebar={() => setMobileNavOpen(true)} />
            <main className="min-w-0 flex-1 p-4 lg:p-8">{children}</main>
          </div>
        </div>
        <Toaster />
      </BranchProvider>
    </ToastProvider>
  );
}
