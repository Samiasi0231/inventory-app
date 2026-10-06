import { AuthSlideDots } from "@/components/auth/auth-slide-dot";
import { AuthSlideView } from "@/components/auth/auth-slide-view";
import type { AuthSlide } from "@/features/auth/auth-slides";
 
interface AuthVisualPanelProps {
  slides: AuthSlide[];
  active: number;
  onSelect: (index: number) => void;
}
 
/** Left-hand marketing panel of the auth layout. Hidden below `lg`. */
export function AuthVisualPanel({ slides, active, onSelect }: AuthVisualPanelProps) {
  return (
    <aside className="relative hidden overflow-hidden rounded-2xl bg-neutral-900 lg:block">
      {slides.map((slide, index) => (
        <AuthSlideView key={slide.id} slide={slide} active={index === active} />
      ))}
      <AuthSlideDots
        count={slides.length}
        active={active}
        onSelect={onSelect}
        className="absolute right-6 top-6"
      />
    </aside>
  );
}