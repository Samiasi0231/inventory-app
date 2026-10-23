import type { CSSProperties } from "react";
import type { StaticImageData } from "next/image";
import { Container } from "@/components/landing/container";
import { OverlayImage } from "@/components/landing/overlay-image";
import { Photo } from "@/components/landing/photo";

// Photos live in src/assets/images and are imported, so Next.js bundles them.
import marketSales from "@/assets/images/market-sales.png";
import backPhoto from "@/assets/images/Rear-paper.png"; // ← replace with the photo that peeks out of the middle frame

/** Speckled paper texture of the polaroid frames (inline SVG noise, no asset needed). */
const paperSvg =
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'>" +
  "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
  "<feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.55 0'/></filter>" +
  "<rect width='100%' height='100%' filter='url(#n)' opacity='0.28'/></svg>";

const paper: CSSProperties = {
  backgroundColor: "#f6f6f4",
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(paperSvg)}")`,
};

interface PolaroidStackProps {
  /** Photo in the front frame (imported from src/assets, or a path under /public). */
  src: StaticImageData | string;
  alt: string;
  /** Photo peeking out of the middle frame. */
  backSrc: StaticImageData | string;
  caption: string;
  /**
   * Optional: the whole stack exported from Figma as a transparent PNG, cropped
   * to the outer edges of the three frames (e.g. "/landing/visibility-stack.png").
   * Drawn over the coded stack when the file exists.
   */
  exportedImage?: string;
}

/**
 * Three stacked frames: a dark card at the back, a paper card with a second
 * photo in the middle, and the main polaroid with its caption in front.
 * Everything is positioned in % of the stack (410 × 490 at full size), so it
 * scales down as one piece.
 */
function PolaroidStack({ src, alt, backSrc, caption, exportedImage }: PolaroidStackProps) {
  return (
    <div className="relative mx-auto aspect-[41/49] w-[300px] sm:w-[410px]">
      {/* Back: dark card, only its left and top edges show */}
      <div
        aria-hidden
        className="absolute left-0 top-0 h-[89.2%] w-[88.5%] rounded-[3px] bg-[#0d1421] shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
      />

      {/* Middle: paper card, only the top of its photo shows */}
      <div
        aria-hidden
        style={paper}
        className="absolute left-[4.1%] top-[3.3%] h-[88.2%] w-[91.2%] rounded-[3px] p-[3.2%] shadow-[0_6px_18px_rgba(0,0,0,0.2)]"
      >
        <Photo src={backSrc} gradient="from-amber-700 to-neutral-900" className="aspect-[9/8] w-full" />
      </div>

      {/* Front: main polaroid */}
      <figure
        style={paper}
        className="absolute left-[12.7%] top-[12.7%] flex h-[87.5%] w-[87.3%] flex-col rounded-[3px] p-[3.2%] shadow-[0_10px_30px_-6px_rgba(0,0,0,0.3)]"
      >
        <Photo src={src} alt={alt} gradient="from-emerald-700 to-emerald-950" className="aspect-[9/8] w-full" />
        <figcaption className="flex flex-1 items-center justify-center px-6 text-center">
          <span className="max-w-[16rem] text-base font-medium leading-snug text-ink-1 sm:text-xl">{caption}</span>
        </figcaption>
      </figure>

      {exportedImage && <OverlayImage src={exportedImage} className="object-contain" />}
    </div>
  );
}

export function VisibilitySection() {
  return (
    <section aria-labelledby="visibility-title" className="bg-white py-16 sm:py-20">
      <Container>
        <div className="grid items-center gap-12 rounded-3xl bg-brand-50/60 px-6 py-12 sm:px-12 lg:grid-cols-[1.15fr_1fr] lg:px-16 lg:py-10">
          <div>
            <h2
              id="visibility-title"
              className="max-w-[28rem] text-4xl font-bold leading-[1.15] text-ink-1 lg:text-[44px]"
            >
              You can&apos;t be <br className="hidden sm:block" />
              everywhere at once.
            </h2>
            <p className="mt-7 text-sm text-ink-2">
              But you should always know what&apos;s happening in your business.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-2">
              Whether you&apos;re making sales, restocking products, or managing multiple branches, RIINOX helps you
              keep everything connected in one place.
            </p>
          </div>

          <PolaroidStack
            src={marketSales}
            alt="A smiling cashier in a green apron taking a card payment at the counter"
            backSrc={backPhoto}
            caption="Your business, always in view."
          />
        </div>
      </Container>
    </section>
  );
}