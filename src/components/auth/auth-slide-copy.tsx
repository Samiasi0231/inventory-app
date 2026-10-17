import type { AuthSlide } from "@/features/auth/auth-slides";
import { cn } from "@/lib/utils";
 
interface AuthSlideCopyProps {
  slide: AuthSlide;
  active: boolean;
}
 
/**
 * Title + subtitle of one slide.
 * Outgoing copy fades out fast (300ms); incoming copy waits 300ms, then fades in
 * (500ms) — so two texts never overlap while the image cross-fades behind them.
 */
export function AuthSlideCopy({ slide, active }: AuthSlideCopyProps) {
  return (
    <div
      aria-hidden={!active}
      className={cn(
        "absolute inset-0 transition-opacity ease-in-out",
        active ? "opacity-100 delay-300 duration-500" : "pointer-events-none opacity-0 duration-300",
      )}
    >
      <h2 className="max-w-md text-3xl font-semibold leading-tight text-white xl:text-4xl">{slide.title}</h2>
      <p className="mt-3 max-w-md text-base text-white/85">{slide.subtitle}</p>
    </div>
  );
}