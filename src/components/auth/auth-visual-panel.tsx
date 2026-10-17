"use client";
 
import { AuthSlideBackdrop } from "@/components/auth/auth-slide-backdrop";
import { AuthSlideCopy } from "@/components/auth/auth-slide-copy";
import { AuthSlideDots } from "@/components/auth/auth-slide-dot";
import { Logo } from "@/components/logo";
import type { AuthSlide } from "@/features/auth/auth-slides";
 
interface AuthVisualPanelProps {
  slides: AuthSlide[];
  active: number;
  /** Optional: makes the dots clickable. Leave out when the page drives the slide. */
  onSelect?: (index: number) => void;
}
 
/** Left-hand marketing panel of the auth layout. Hidden below `lg`. */
export function AuthVisualPanel({ slides, active, onSelect }: AuthVisualPanelProps) {
  return (
    <aside className="relative hidden overflow-hidden rounded-2xl bg-neutral-900 lg:block">
      {slides.map((slide, index) => (
        <AuthSlideBackdrop key={slide.id} slide={slide} active={index === active} />
      ))}
 
      {/* Static block: indicator + logo stay put, only the copy swaps */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-8 xl:p-10">
        <AuthSlideDots count={slides.length} active={active} onSelect={onSelect} />
        <Logo  className="mt-1" />
        <div className="relative mt-3 h-40">
          {slides.map((slide, index) => (
            <AuthSlideCopy key={slide.id} slide={slide} active={index === active} />
          ))}
        </div>
      </div>
    </aside>
  );
}