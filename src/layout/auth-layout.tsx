"use client";

import type { ReactNode } from "react";
import { AuthVisualPanel } from "@/components/auth";
import { Logo } from "@/components/logo";
import type { AuthSlide } from "@/features/auth/auth-slides";
import { useSlideRotation } from "@/hooks/use-slide-rotation";

interface AuthLayoutProps {
  slides: AuthSlide[];
  /** Milliseconds between slides. */
  interval?: number;
  children: ReactNode;
}

export function AuthLayout({ slides, interval = 5000, children }: AuthLayoutProps) {
  const { active, setActive } = useSlideRotation(slides.length, interval);

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1440px] gap-6 sm:min-h-[calc(100vh-2rem)] lg:grid-cols-2">
        <AuthVisualPanel slides={slides} active={active} onSelect={setActive} />

        <main className="flex items-center justify-center px-2 py-8 sm:px-6">
          <div className="w-full max-w-[420px]">
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}