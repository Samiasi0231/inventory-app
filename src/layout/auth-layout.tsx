"use client";
 
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthVisualPanel } from "@/components/auth";
import { Logo } from "@/components/logo";
import { getAuthSlideIndex, type AuthSlide } from "@/features/auth/auth-slides";
 
interface AuthLayoutProps {
  slides: AuthSlide[];
  children: ReactNode;
}
 
/**
 * Split-screen auth layout. The slide on the left follows the current page
 * (see `authSlideByRoute`). Keep every auth page inside ONE layout instance
 * (one route group) so the slide cross-fades instead of remounting.
 */
export function AuthLayout({ slides, children }: AuthLayoutProps) {
  const pathname = usePathname();
  const active = getAuthSlideIndex(pathname, slides);
 
  return (
    <div className="min-h-screen bg-background p-3 sm:p-4">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1440px] gap-6 sm:min-h-[calc(100vh-2rem)] lg:grid-cols-2">
        <AuthVisualPanel slides={slides} active={active} />
 
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