import type { ReactNode } from "react";
import { CenteredLayout } from "@/layout/centered-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <CenteredLayout>{children}</CenteredLayout>;
}
