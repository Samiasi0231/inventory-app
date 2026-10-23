"use client"
 
import { useRef, useState } from "react";
import { CarouselControls } from "@/components/landing/carousel-controls";
import { Container } from "@/components/landing/container";
import { SectionHeading } from "@/components/landing/section-heading";
import { AudienceCard } from "./audience-card";
import { audiences } from "./landing-content";
 
const PAGES = 3;
 
export function AudienceSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
 
  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.75, behavior: "smooth" });
  };
 
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setActive(max <= 0 ? 0 : Math.round((track.scrollLeft / max) * (PAGES - 1)));
  };
 
  return (
    <section id="solutions" aria-labelledby="audience-title" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="audience-title"
          pill="Who it's for"
          title="One platform. Infinite possibilities."
          description="Experience the depth of our industry-specific dashboards, tailored to the unique rhythms of African commerce."
        />
 
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {audiences.map((audience) => (
            <AudienceCard key={audience.id} audience={audience} />
          ))}
        </div>
 
        <CarouselControls
          className="mt-8"
          count={PAGES}
          active={active}
          onPrev={() => scrollByPage(-1)}
          onNext={() => scrollByPage(1)}
        />
      </Container>
    </section>
  );
}