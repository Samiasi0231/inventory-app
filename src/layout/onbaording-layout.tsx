import type { ReactNode } from "react";
import { Logo } from "@/components/logo";

export function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center px-6 pt-6">
        <Logo />
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12 sm:py-16">{children}</main>
    </div>
  );
}