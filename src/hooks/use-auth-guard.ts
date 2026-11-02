"use client";
// Keeps each kind of user on the right side of the app:
//   useAuthGuard("onboarding")  business-type and business-details pages
//   useAuthGuard("any")         the "You're all set" page (just needs a logged-in user)
//   useAuthGuard("app")         the dashboard layout
//
// - not logged in                              -> sign in
// - "onboarding" + onboarding already finished -> dashboard (older users never see onboarding)
// - "app" + onboarding not finished            -> business type

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authSession, tokenStorage } from "@/lib/api/index";
import { ROUTES } from "@/lib/routes";

export function useAuthGuard(area: "onboarding" | "app" | "any") {
  const router = useRouter();

  useEffect(() => {
    // Read straight from storage: a hook value is still null on the first client render.
    if (!tokenStorage.hasSession()) {
      router.replace(ROUTES.signIn);
      return;
    }

    const session = authSession.get();
    if (!session) return;

    if (area === "onboarding" && session.registrationComplete) {
      router.replace(ROUTES.dashboard);
    } else if (area === "app" && !session.registrationComplete) {
      router.replace(ROUTES.businessType);
    }
  }, [area, router]);
}