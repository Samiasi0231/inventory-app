import { Container } from "@/components/landing/container";
import { SectionHeading } from "@/components/landing/section-heading";
import { FeatureCard } from "./feature-card";
import { features } from "./landing-content";
 
export function FeaturesSection() {
  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="features-title"
          pill="Why RIINOX?"
          title="Everything you need to scale."
          description="Powerful tools designed specifically for the Nigerian market. No more struggling with generic software."
        />
 
        {/* 20px gaps, 2 wide cards on top, 3 compact cards below */}
        <div className="mt-14 grid gap-5 lg:grid-cols-6">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              className={feature.variant === "wide" ? "lg:col-span-3" : "lg:col-span-2"}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}