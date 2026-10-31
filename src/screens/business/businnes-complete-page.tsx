"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { PrimaryButton } from "@/components/button";
import { SummaryCard, type SummaryItem } from "@/components/onboarding";
import { useOnboarding } from "@/context/onboarding-context";
import { businessTypes } from "@/features/onboarding/bussiness-types";

/** "F.C.T (Abuja)" + "Nigeria" → "F.C.T Nigeria" (matches the design). */
function formatLocation(city: string, country: string) {
  const shortCity = city.replace(/\s*\(.*?\)\s*/g, " ").trim();
  return `${shortCity} ${country}`;
}

export default function OnboardingCompletePage() {
  const router = useRouter();
  const { businessType, businessProfile, fullName } = useOnboarding();

  // The summary needs the saved profile — send people back if it's missing.
  useEffect(() => {
    if (!businessProfile) router.replace("/onboarding/business-type");
  }, [businessProfile, router]);

  if (!businessProfile) return null;

  const typeTitle = businessTypes.find((t) => t.id === businessType)?.title ?? "";
  const typeName = typeTitle.replace(/\s*\/\s*/g, "/"); // "Retail /Shopping" → "Retail/Shopping"
  const typeSentence = typeName.replace("/", " / "); // → "Retail / Shopping"

  const items: SummaryItem[] = [
    { label: "Business Type", value: typeName },
    { label: "Business Name", value: businessProfile.businessName },
    ...(fullName ? [{ label: "Name", value: fullName }] : []),
    { label: "Location", value: formatLocation(businessProfile.city, businessProfile.country) },
  ];

  return (
    <div className="mx-auto w-full max-w-[560px]">
      {/* Tight card padding: the mint summary box sits close to the card edges */}
      <section className="rounded-2xl border border-neutral-200/70 bg-white p-2 shadow-sm">
        <div className="px-4 pb-6 pt-6 text-center sm:px-6">
          <BadgeCheck className="mx-auto size-9 text-brand-500" strokeWidth={1.75} aria-hidden />
          <h1 className="mt-3 text-2xl font-bold text-neutral-900">You&apos;re all Set!</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-700">
            Welcome to RIINOX, {businessProfile.businessName}. Your {typeSentence} workspace is ready for launch.
          </p>
        </div>
        <SummaryCard items={items} />
      </section>

      <PrimaryButton
        fullWidth
        onClick={() => router.push("/dashboard")}
        rightIcon={<ArrowRight className="size-4" aria-hidden />}
        className="mt-5"
      >
        Get started
      </PrimaryButton>
    </div>
  );
}