import { Container } from "@/components/landing/container";
import { SignupPreviewCard } from "./signup-preview-card";
import { steps } from "./landing-content";
 
export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 id="how-title" className="text-3xl font-bold text-neutral-900 sm:text-4xl">
              How does it work?
            </h2>
 
            <ol className="mt-10">
              {steps.map((step, index) => (
                <li key={step.title} className="border-b border-neutral-200 py-5 first:pt-0 last:border-b-0">
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-bold text-brand-600">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="text-base font-bold text-neutral-900">{step.title}</h3>
                  </div>
                  <p className="mt-2 pl-8 text-sm leading-relaxed text-neutral-600">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
 
          <div className="rounded-3xl bg-brand-50 p-6 sm:p-12">
            <SignupPreviewCard />
          </div>
        </div>
      </Container>
    </section>
  );
}