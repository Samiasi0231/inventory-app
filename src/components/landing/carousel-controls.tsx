"use client";
 
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
 
interface CarouselControlsProps {
  count: number;
  active: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}
 
/** Prev / progress dashes / Next — shared by every carousel. */
export function CarouselControls({ count, active, onPrev, onNext, className }: CarouselControlsProps) {
  const buttonClass =
    "grid size-8 place-items-center rounded-md border border-neutral-200 bg-white text-neutral-600 transition-colors " +
    "hover:border-brand-500 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-200 disabled:hover:text-neutral-600";
 
  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <button type="button" onClick={onPrev} disabled={active <= 0} aria-label="Previous" className={buttonClass}>
        <ChevronLeft className="size-4" aria-hidden />
      </button>
 
      <div className="flex items-center gap-1.5" aria-hidden>
        {Array.from({ length: count }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-0.5 rounded-full transition-all duration-300",
              index === active ? "w-6 bg-brand-500" : "w-3 bg-neutral-300",
            )}
          />
        ))}
      </div>
 
      <button type="button" onClick={onNext} disabled={active >= count - 1} aria-label="Next" className={buttonClass}>
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </div>
  );
}