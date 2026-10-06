"use client";

import type { ReactNode } from "react";
import { AuthLayout } from "@/layout/auth-layout";
import { signupSlides } from "@/features/auth/auth-slides";

export default function Layout({ children }: { children: ReactNode }) {
  return <AuthLayout slides={signupSlides}>{children}</AuthLayout>;
}
