import { cn } from "@/lib/utils";
import { FeatureIllustration } from "./feature-illustrations";
import type { Feature } from "./landing-content";
 
interface FeatureCardProps {
  feature: Feature;
  className?: string;
}

export function FeatureCard({ feature, className }: FeatureCardProps) {
  const wide = feature.variant === "wide";
 
  const illustration = <FeatureIllustration kind={feature.illustration} image={feature.image} />;
 
  const copy = (
    <div className={cn("px-8", wide ? "py-14" : "pt-6")}>
      <h3 className="text-2xl font-semibold leading-8 text-ink-1">{feature.title}</h3>
      <p className="mt-4 max-w-md text-sm leading-6 text-ink-3">{feature.description}</p>
    </div>
  );
 
  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-surface",
        wide ? "lg:min-h-[389px]" : "lg:min-h-[352px]",
        className,
      )}
    >
      {wide ? (
        <>
          {illustration}
          {copy}
        </>
      ) : (
        <>
          {copy}
          <div className="mt-auto pt-10">{illustration}</div>
        </>
      )}
    </article>
  );
}