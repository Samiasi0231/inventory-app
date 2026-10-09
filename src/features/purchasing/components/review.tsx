import type { ReactNode } from "react";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/** The bordered card each section of a wizard's Review step sits in. */
export function ReviewCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-border/70 p-5 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
      <h3 className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-ink-1">
        <span aria-hidden className="size-1 rounded-full bg-ink-1" />
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Label on the left, value on the right. */
export function ReviewRow({ label, value, wrap }: { label: string; value: string; wrap?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-6 py-1.5 text-[13px]">
      <dt className="shrink-0 text-ink-3">{label}</dt>
      <dd className={cn("text-right text-ink-2", wrap && "max-w-[260px]")}>{value}</dd>
    </div>
  );
}

export function GrandTotalBar({ amount }: { amount: number }) {
  return (
    <div className="mt-4 flex items-center justify-between rounded-lg bg-accent px-4 py-3 text-accent-foreground">
      <span className="text-xs font-semibold">Grand Total</span>
      <span className="text-sm font-semibold">₦{formatNumber(amount)}</span>
    </div>
  );
}

const reviewDateFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** "04 Oct 2026", or the fallback when nothing was entered. */
export function formatReviewDate(value: string | undefined, fallback = "—") {
  if (!value) return fallback;
  return reviewDateFormatter.format(new Date(value));
}
