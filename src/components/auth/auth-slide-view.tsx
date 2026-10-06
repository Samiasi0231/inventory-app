"use client";

import { useEffect, useState } from "react";
import type { StaticImageData } from "next/image";
import { Logo } from "@/components/logo";
import type { AuthSlide } from "@/features/auth/auth-slides";
import { cn } from "@/lib/utils";
import images1 from "@/assets/images/sale-gurl.png";
import images2 from "@/assets/images/ladyatbookshop.jpg";
import images3 from "@/assets/images/secretary.png";
import images4 from "@/assets/images/secretary.png";

interface AuthSlideViewProps {
  slide: AuthSlide;
  active: boolean;
}

const images: StaticImageData[] = [images1, images2, images3, images4];

/** One cross-fading slide of the auth visual panel. */
export function AuthSlideView({ slide, active }: AuthSlideViewProps) {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setImageIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [active]);

  return (
    <div
      aria-hidden={!active}
      className={cn(
        "absolute inset-0 transition-opacity duration-700",
        active ? "opacity-100" : "opacity-0",
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", slide.gradient)} />

      {images.map((image, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={index}
          src={image.src}
          alt=""
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            index === imageIndex ? "opacity-100" : "opacity-0",
          )}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ))}

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
          className={cn(
            "absolute rounded-full px-3 py-1 text-[11px] font-medium shadow-sm",
            chip.className,
          )}
        >
          {chip.label}
        </span>
      ))}

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-8 xl:p-10">
        <Logo />
        <h2 className="max-w-md text-3xl font-semibold leading-tight text-white xl:text-4xl">
          {slide.title}
        </h2>
        <p className="max-w-md text-base text-white/85">{slide.subtitle}</p>
      </div>
    </div>
  );
}