import type { ReactNode } from "react";

export function CenteredLayout({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-12">
      <div className="w-full max-w-[520px]">{children}</div>
    </main>
  );
}