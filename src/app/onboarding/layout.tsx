import type { ReactNode } from "react";
import { OnboardingLayout } from "@/layout/onbaording-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <OnboardingLayout>{children}</OnboardingLayout>;
}
