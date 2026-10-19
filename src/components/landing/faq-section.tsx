"use client";
import { useState } from "react";
import { Container } from "@/components/landing/container";
import { FaqItem } from "./faq-item";
import { faqs } from "./landing-content";
 
export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(3);
 
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 bg-neutral-100 py-16 sm:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="faq-title" className="max-w-xs text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-xs text-neutral-500">Quick answers to your questions</p>
          </div>
 
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FaqItem
                key={faq.question}
                id={`faq-${index}`}
                question={faq.question}
                answer={faq.answer}
                open={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}