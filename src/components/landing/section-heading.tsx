import type { ReactNode } from "react";
import { Pill } from "@/components/landing/pill";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    title: ReactNode;
    description?: ReactNode;
    pill?: string;
    align?: "center" | "left";
    /** Heading level id, so sections can label themselves for screen readers. */
    id?: string;
    className?: string;
}

/** Optional pill + title + description. Used at the top of most sections. */
export function SectionHeading({ title, description, pill, align = "center", id, className }: SectionHeadingProps) {
    return (
        <div className={cn(align === "center" ? "mx-auto text-center" : "text-left", "max-w-2xl", className)}>
            {pill && <Pill className="mb-4">{pill}</Pill>}
            <h2 id={id} className="text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl">
                {title}
            </h2>
            {description && <p className="mt-3 text-sm text-neutral-600 sm:text-base">{description}</p>}
        </div>
    );
}