"use client";
 
import { cn } from "@/lib/utils";
import Image from "next/image";
import rearImage from "@/assets/images/Rear-paper.png"; 
 
interface OverlayImageProps {
  src: string;
  className?: string;
}
 
/**
 * Image that fills its (relative) parent. Hides itself when the file is
 * missing, revealing whatever is drawn underneath.
 */
export function OverlayImage({ src, className }: OverlayImageProps) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <Image
        src={rearImage }
        alt=""
        className={cn("absolute inset-0 size-full", className)}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </>
  );
}