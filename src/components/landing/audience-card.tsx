import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/landing/photo";
import type { Audience } from "./landing-content";
 
export function AudienceCard({ audience }: { audience: Audience }) {
  return (
    <Link
      href="/signup"
      className="group relative block h-[360px] w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-[300px]"
    >
      <Photo
        src={audience.image}
        alt=""
        gradient={audience.gradient}
        className="absolute inset-0"
        imgClassName="transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
 
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-lg font-bold text-white">{audience.title}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-white/80">{audience.description}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-200 group-hover:underline">
          Explore {audience.mode} Mode
          <ArrowRight className="size-3" aria-hidden />
        </span>
      </div>
    </Link>
  );
}