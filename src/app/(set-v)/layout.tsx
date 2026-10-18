import type { ReactNode } from "react";
import SettingsLayout from "@/components/settings/settings-layout";

export default function SettingsRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <SettingsLayout>{children}</SettingsLayout>;
}