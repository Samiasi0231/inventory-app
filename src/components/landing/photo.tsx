"use client";

import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

interface PhotoProps {
  /** An imported image (from src/assets) or a path to a file under /public. */
  src: StaticImageData | string;
  alt?: string;
  className?: string;
  /** Tailwind gradient classes shown until (or instead of) the photo. */
  gradient?: string;
  imgClassName?: string;
  /** Set on above-the-fold photos so they load immediately. */
  priority?: boolean;
}

/**
 * Photo with a gradient fallback: if the image can't be loaded, the gradient
 * stays visible instead of a broken-image icon.
 *
 * It always renders the `src` it is given — never hard-code an image in here,
 * or every Photo on the page shows that same picture.
 */
export function Photo({
  src,
  alt = "",
  className,
  gradient = "from-emerald-700 to-neutral-900",
  imgClassName,
  priority = false,
}: PhotoProps) {
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br", gradient, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 400px, 90vw"
        className={cn("object-cover", imgClassName)}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}