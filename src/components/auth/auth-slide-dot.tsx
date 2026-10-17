"use client";
 
import { cn } from "@/lib/utils";
 
interface AuthSlideDotsProps {
  count: number;
  active: number;
  /** Omit for a display-only indicator (the slide follows the page). */
  onSelect?: (index: number) => void;
  className?: string;
}
 
function dotClass(isActive: boolean, interactive: boolean) {
  return cn(
    "block size-1.5 rounded-full transition-colors duration-300",
    isActive ? "bg-white" : cn("bg-white/40", interactive && "group-hover:bg-white/70"),
  );
}
 
/** Slide indicator: small dots, the active one solid white. */
export function AuthSlideDots({ count, active, onSelect, className }: AuthSlideDotsProps) {
  if (count < 2) return null;
 
  if (!onSelect) {
    return (
      <div
        className={cn("flex items-center gap-1.5", className)}
        role="img"
        aria-label={`Slide ${active + 1} of ${count}`}
      >
        {Array.from({ length: count }).map((_, index) => (
          <span key={index} className={dotClass(index === active, false)} />
        ))}
      </div>
    );
  }
 
  return (
    <div className={cn("flex items-center", className)} role="tablist" aria-label="Slides">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={index === active}
          aria-label={`Show slide ${index + 1}`}
          onClick={() => onSelect(index)}
          className="group p-1 first:pl-0"
        >
          <span className={dotClass(index === active, true)} />
        </button>
      ))}
    </div>
  );
}