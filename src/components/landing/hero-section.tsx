import { ButtonLink } from "@/components/landing/button-link";
import { Container } from "@/components/landing/container";
import { Pill } from "@/components/landing/pill";
import { DashboardPreview } from "./dashboard-preview";
import { LandingNavbar } from "./landing-navbar";

/**
 * Hero — fixed 1073px tall on desktop (1440 frame). The dashboard preview is
 * cropped by the bottom edge of the section: no bottom border, and the bottom
 * of the hero fades to white so it melts into the next section.
 */
export function HeroSection() {
    return (
<section
    id="top"
    className="relative overflow-hidden bg-gradient-to-b from-brand-500 via-[#10a35a] to-[#38c97f]"
>
            {/* Faint grid texture */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
            />

            <LandingNavbar />

            <Container className="relative flex flex-col items-center pt-32 text-center sm:pt-40">
                <Pill tone="white">All in one business management</Pill>

                <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.1] text-white sm:text-6xl">
                    Run Your Entire Business <br className="hidden sm:block" />
                    From One Place.
                </h1>

                <p className="mt-5 max-w-xl text-sm text-white/90 sm:text-base">
                    Manage sales, inventory, payments, staff and branches from one simple platform built for Nigerian
                    businesses.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                    <ButtonLink href="#contact" variant="ghost" size="md">
                        Get Demo
                    </ButtonLink>
                    <ButtonLink href="/signup" variant="white" size="md">
                        Start for free
                    </ButtonLink>
                </div>
            </Container>

            {/* The preview scales itself to this width; below lg the section has no fixed height, so crop it here. */}
        <div className="relative mx-auto mt-14 w-full max-w-[1100px] px-4 sm:px-6 lg:mt-20">
    <DashboardPreview />
</div>

            {/* Fade the bottom of the hero (and the preview's cut edge) into the white section below. */}
          <div
    aria-hidden
    className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-white via-white/80 to-transparent sm:h-16"
/>
        </section>
    );
}