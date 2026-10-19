import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "./landing-content";
 
interface TestimonialCardProps {
  testimonial: Testimonial;
  /** The centered, emphasised card. */
  active: boolean;
}
 
function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
 
export function TestimonialCard({ testimonial, active }: TestimonialCardProps) {
  return (
    <figure
      aria-hidden={!active}
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-500",
        active
          ? "scale-100 border-brand-200 bg-white shadow-lg"
          : "scale-95 border-brand-100 bg-brand-50/60 opacity-60",
      )}
    >
      <div className="flex-1 p-6">
        <Quote className="size-5 text-brand-500" aria-hidden />
        <blockquote className="mt-4 text-sm leading-relaxed text-neutral-700">{testimonial.quote}</blockquote>
      </div>
 
      <figcaption className="flex items-center gap-3 bg-brand-50 px-6 py-4">
        <span className="grid size-9 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">
          {initials(testimonial.name)}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-xs font-semibold text-neutral-900">{testimonial.name}</span>
          <span className="block truncate text-[11px] text-neutral-500">{testimonial.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
