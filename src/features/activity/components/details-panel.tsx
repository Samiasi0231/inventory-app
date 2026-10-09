"use client";

import type { ReactNode } from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailsPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  /** Action pill shown above the title, used by the audit log. */
  badge?: ReactNode;
  children: ReactNode;
}

/**
 * Right-hand panel for a selected entry. It sits beside the list on wide
 * screens and slides over it below `xl`, where there is no room for both.
 */
export function DetailsPanel({
  open,
  onClose,
  title,
  subtitle,
  badge,
  children,
}: DetailsPanelProps) {
  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20 xl:hidden"
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-[420px] max-w-[calc(100vw-2rem)] flex-col overflow-y-auto bg-surface p-6 shadow-xl",
          "xl:sticky xl:top-6 xl:z-auto xl:h-fit xl:max-h-[calc(100vh-6rem)] xl:rounded-xl xl:shadow-none",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {badge}
            <h2 className={cn("text-base font-semibold text-ink-1", badge && "mt-2")}>{title}</h2>
            <p className="mt-1 text-xs text-ink-4">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="-m-1 shrink-0 rounded-md p-1 text-ink-3 transition-colors hover:bg-surface-muted hover:text-ink-1"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {children}
      </aside>
    </>
  );
}

/** A titled block inside the panel, e.g. "When and who". */
export function PanelSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="text-sm font-semibold text-ink-1">{title}</h3>
      <dl className="mt-3 flex flex-col gap-2">{children}</dl>
    </section>
  );
}

export function PanelRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[96px_1fr] items-start gap-3 text-xs">
      <dt className="text-ink-3">{label}</dt>
      <dd className="min-w-0 break-words text-ink-1">{value}</dd>
    </div>
  );
}
