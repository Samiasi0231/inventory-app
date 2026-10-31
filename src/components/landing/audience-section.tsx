"use client"
 
import { useEffect, useRef, useState } from "react";
import { CarouselControls } from "@/components/landing/carousel-controls";
import { Container } from "@/components/landing/container";
import { SectionHeading } from "@/components/landing/section-heading";
import { AudienceCard } from "./audience-card";
import { audiences } from "./landing-content";
 
const PAGES = 3;
 
export function AudienceSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const manual = useRef(false);
  const [active, setActive] = useState(0);
 
  const scrollByPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    manual.current = true;
    track.scrollBy({ left: direction * track.clientWidth * 0.75, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
 
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let current = -1;
    let lastTime = 0;
    const update = (time: number) => {
      frame = 0;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!media.matches || !section || !track || manual.current) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - (section.firstElementChild as HTMLElement).offsetHeight - 192);
      const progress = Math.max(0, Math.min(1, (96 - rect.top) / distance));
      const target = progress * (track.scrollWidth - track.clientWidth);
      const dt = lastTime ? Math.min(64, time - lastTime) : 16;
      lastTime = time;
      if (current < 0) current = track.scrollLeft;
      current += (target - current) * (1 - Math.exp(-dt / 130));
      if (Math.abs(target - current) < .1) current = target;
      track.scrollLeft = current;
      if (current !== target) frame = requestAnimationFrame(update);
    };
    const schedule = () => {
      // Manual carousel use yields only until the next vertical page scroll.
      manual.current = false;
      if (!frame) { current = trackRef.current?.scrollLeft ?? 0; lastTime = 0; frame = requestAnimationFrame(update); }
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, []);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setActive(max <= 0 ? 0 : Math.round((track.scrollLeft / max) * (PAGES - 1)));
  };
 
  return (
    <section ref={sectionRef} id="solutions" aria-labelledby="audience-title" className="scroll-mt-24 bg-white py-16 sm:py-24">
      <Container className="audience-pin">
        <div>
          <SectionHeading
            id="audience-title"
            pill="Who it's for"
            title="One platform. Infinite possibilities."
            description="Experience the depth of our industry-specific dashboards, tailored to the unique rhythms of African commerce."
          />
        </div>
 
        <div
          data-motion-reveal
          data-reveal-direction="side"
          ref={trackRef}
          onScroll={onScroll}
          onWheel={(event) => {
            if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) manual.current = true;
          }}
          className="audience-track mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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