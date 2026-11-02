import type { Metadata } from "next";
import "@fontsource-variable/karla";
import "./globals.css";
import { OnboardingProvider } from "@/context/onboarding-context";
import { ToastProvider, Toaster } from "@/components/ui/toast";
import { QueryProvider } from "@/providers/providers";

export const metadata: Metadata = {
  title: "Riinox",
  description: "Inventory and business management for your business.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ToastProvider>
          <QueryProvider>
          <OnboardingProvider>{children}</OnboardingProvider>
          </QueryProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
