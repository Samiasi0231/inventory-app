import { ButtonLink } from "@/components/landing/button-link";
import { Container } from "@/components/landing/container";
 
export function CtaSection() {
  return (
    <section aria-labelledby="cta-title" className="bg-white py-16 sm:py-20">
      <Container>
        <div className="rounded-3xl bg-gradient-to-b from-brand-100 via-brand-50 to-brand-100 px-6 py-16 text-center sm:py-20">
          <h2 id="cta-title" className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Ready to scale your business?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-neutral-600">
            Join thousands of Nigerian entrepreneurs who are running their businesses smarter with RIINOX.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/signin" variant="outline" size="md">
              Sign in
            </ButtonLink>
            <ButtonLink href="/signup" variant="primary" size="md">
              Start for free
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}