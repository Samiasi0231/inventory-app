import type { ReactNode } from "react";
 
/** Page background and centered container for all onboarding steps. */
export function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4 py-8 sm:px-6">
      <div className="w-full max-w-[1000px]">{children}</div>
    </main>
  );
}
