

import type { Metadata } from "next";
import { AudienceSection } from "@/components/landing/audience-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { TestimonialsSection } from "@/components/landing/testimonial-section";
import { VisibilitySection } from "@/components/landing/visibility-section";
 
export const metadata: Metadata = {
  title: "RIINOX — Run your entire business from one place",
  description:
    "Manage sales, inventory, payments, staff and branches from one simple platform built for Nigerian businesses.",
  openGraph: {
    title: "RIINOX — Run your entire business from one place",
    description:
      "Manage sales, inventory, payments, staff and branches from one simple platform built for Nigerian businesses.",
    type: "website",
  },
};
 
export default function LandingPage() {
  return (
    <div className="bg-white">
      <main>
        <HeroSection />
        <VisibilitySection />
        <FeaturesSection />
        <AudienceSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}