import { formatPercentDelta } from "@/lib/format";

/** The compact summary treatment used by the inventory reference. */
export function InventoryStatCard({ label, value, description, delta }: {
  label: string; value: string; description: string; delta: number;
}) {
  return (
    <div className="@container flex h-[130px] min-w-0 flex-col justify-between rounded-lg bg-surface p-5">
      <div className="flex items-center gap-1 text-ink-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5 shrink-0 text-primary" aria-hidden="true"><path d="M20 10V7a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" /><circle cx="17" cy="16" r="4" /><path d="m20 19 3 3" /></svg>
        <p className="truncate text-sm tracking-[0.14px]">{label}</p>
      </div>
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="whitespace-nowrap text-[clamp(16px,10.6cqw,24px)] font-semibold leading-7 tracking-[-0.4px] text-ink-1">{value}</p>
          <span className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-1.5 py-1 text-[10px] leading-3 ${delta >= 0 ? "bg-success-bg text-success-fg" : "bg-danger-bg text-danger-fg"}`}>
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" className="size-2" aria-hidden="true"><path d={delta >= 0 ? "m1 8 3-3 3 2 4-5M8 2h3v3" : "m1 3 3 3 3-2 4 5M8 9h3V6"} /></svg>
            {formatPercentDelta(delta)}
          </span>
        </div>
        <p className="mt-2 text-xs tracking-[0.18px] text-ink-1">{description}</p>
      </div>
    </div>
  );
}
