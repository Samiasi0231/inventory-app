"use client";

import type { ReactNode } from "react";
import { AuthLayout } from "@/layout/auth-layout";
import { verifySlides } from "@/features/auth/auth-slides";

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout slides={verifySlides}>{children}</AuthLayout>;
}
