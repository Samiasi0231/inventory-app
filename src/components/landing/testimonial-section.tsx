"use client";
 
import { useState } from "react";
import { CarouselControls } from "@/components/landing/carousel-controls";
import { Container } from "@/components/landing/container";
import { SectionHeading } from "@/components/landing/section-heading";
import { useMediaQuery } from "@/hooks/use-media-query";
import { testimonials } from "./landing-content";
import { TestimonialCard } from "./testimonial-card";
 
export function TestimonialsSection() {
  const [active, setActive] = useState(1);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
 
  // Desktop: 3 cards visible, the active one centered. Mobile: 1 card.
  const shift = isDesktop ? (1 - active) * (100 / 3) : -active * 100;
 
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-24 overflow-hidden bg-white py-16 sm:py-24">
      <Container>
        <SectionHeading
          id="reviews-title"
          title="Trusted by 10,000+ businesses"
          description="What our clients say"
        />
 
        <div className="mt-12 overflow-hidden py-4" aria-roledescription="carousel" aria-label="Customer testimonials">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${shift}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="basis-full shrink-0 px-3 lg:basis-1/3">
                <TestimonialCard testimonial={testimonial} active={index === active} />
              </div>
            ))}
          </div>
        </div>
 
        <CarouselControls
          className="mt-6"
          count={testimonials.length}
          active={active}
          onPrev={() => setActive((current) => Math.max(0, current - 1))}
          onNext={() => setActive((current) => Math.min(testimonials.length - 1, current + 1))}
        />
      </Container>
    </section>
  );
}