import Image from "next/image";
import type { AuthSlide } from "@/features/auth/auth-slides";
import { cn } from "@/lib/utils";

interface AuthSlideBackdropProps {
  slide: AuthSlide;
  active: boolean;
}

/** Image, gradient and floating chips/icons of one slide. Cross-fades (700ms). */
export function AuthSlideBackdrop({ slide, active }: AuthSlideBackdropProps) {
  return (
    <div
      aria-hidden
      className={cn("absolute inset-0 transition-opacity duration-700 ease-in-out", active ? "opacity-100" : "opacity-0")}
    >
      {/* Gradient shows while the photo loads */}
      <div className={cn("absolute inset-0 bg-gradient-to-br", slide.gradient)} />

      {/* priority: every slide is preloaded so the cross-fade never waits on a download */}
      <Image src={slide.image} alt="" fill priority sizes="(min-width: 1024px) 50vw, 0px" className="object-cover" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      {slide.floaters?.map((floater, i) => (
        <div
          key={i}
          className={cn(
            "absolute grid size-12 place-items-center rounded-xl bg-white/90 shadow-md backdrop-blur",
            floater.className,
          )}
        >
          <floater.icon className={cn("size-5 text-neutral-700", floater.iconClassName)} />
        </div>
      ))}

      {slide.chips?.map((chip) => (
        <span
          key={chip.label}
          className={cn("absolute rounded-full px-3 py-1 text-[11px] font-medium shadow-sm", chip.className)}
        >
          {chip.label}
        </span>
      ))}
    </div>
  );
}