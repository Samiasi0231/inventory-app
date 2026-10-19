import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex items-center gap-2 text-sm text-ink-2">
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
        {label} :
      </dt>
      <dd className="text-right text-sm font-medium text-ink-1">{value}</dd>
    </div>
  );
}

export function TotalRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={strong ? "font-semibold text-ink-1" : "text-ink-3"}>{label}</dt>
      <dd className={strong ? "font-semibold text-ink-1" : "text-ink-1"}>{value}</dd>
    </div>
  );
}

export function TabPanel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink-1">{title}</h2>
          <p className="mt-1 text-sm text-ink-3">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function DetailTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: readonly { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
}) {
  return (
    <nav className="flex gap-2 overflow-x-auto rounded-xl bg-surface p-2" aria-label="Order sections">
      {tabs.map((entry) => (
        <button
          key={entry.id}
          type="button"
          aria-current={active === entry.id ? "page" : undefined}
          onClick={() => onChange(entry.id)}
          className={cn(
            "shrink-0 rounded-lg px-4 py-2 text-sm transition-colors",
            active === entry.id
              ? "bg-accent font-semibold text-accent-foreground"
              : "text-ink-2 hover:bg-surface-muted",
          )}
        >
          {entry.label}
        </button>
      ))}
    </nav>
  );
}
