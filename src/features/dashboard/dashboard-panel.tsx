import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ActivityItem, AlertSeverity, SmartAlert, TopProduct } from "@/types/dashboard";

const SEVERITY_STYLES: Record<AlertSeverity, { label: string; className: string }> = {
  urgent: { label: "Urgent", className: "border-red-200 bg-red-50 text-destructive" },
  warning: { label: "Warning", className: "border-amber-200 bg-amber-50 text-amber-700" },
  info: { label: "Info", className: "border-blue-200 bg-blue-50 text-blue-700" },
};

function PanelHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-base font-semibold text-ink-1">{title}</h2>
      {href && (
        <Link href={href} className="text-xs font-semibold text-primary hover:underline">
          View All
        </Link>
      )}
    </div>
  );
}

export function SmartAlertsPanel({ alerts }: { alerts: SmartAlert[] }) {
  return (
    <section className="flex h-full min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
      <PanelHeader title="Smart Alerts" href="/notifications" />
      {alerts.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-3">You&apos;re all caught up. No alerts right now.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {alerts.map((alert) => {
            const severity = SEVERITY_STYLES[alert.severity];
            const itemClasses =
              "flex items-end justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-[0_1px_2px_rgba(47,47,47,0.04)]";
            const content = (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink-1">{alert.title}</p>
                  <p className="mt-1 text-xs text-ink-3">{alert.message}</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                    severity.className,
                  )}
                >
                  {severity.label}
                </span>
              </>
            );

            return (
              <li key={alert.id}>
                {alert.href ? (
                  <Link href={alert.href} className={cn(itemClasses, "transition-colors hover:bg-surface-muted")}>
                    {content}
                  </Link>
                ) : (
                  <div className={itemClasses}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export function RecentActivityPanel({ items }: { items: ActivityItem[] }) {
  return (
    <section className="flex min-w-0 flex-col gap-2 rounded-xl bg-surface p-5">
      <PanelHeader title="Recent activity" href="/activity" />
      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-3">Activity from your team will show up here.</p>
      ) : (
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.id} className="border-b border-border py-4 last:border-b-0 last:pb-0">
              <p className="text-sm font-medium text-ink-1">{item.message}</p>
              <p className="mt-1.5 text-xs text-ink-3">{item.timeAgo}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function TopProductsPanel({ products }: { products: TopProduct[] }) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
      <PanelHeader title="Top Performing Products" />
      {products.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-3">Sales rankings appear once you record sales.</p>
      ) : (
        <ul className="flex flex-col gap-6">
          {products.map((product) => {
            const percent = product.target > 0 ? Math.min(100, (product.sold / product.target) * 100) : 0;
            return (
              <li key={product.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate font-medium text-ink-1">{product.name}</span>
                  <span className="shrink-0 font-semibold text-ink-1">
                    {product.sold}/{product.target}
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${product.name} sales`}
                  aria-valuemin={0}
                  aria-valuemax={product.target}
                  aria-valuenow={product.sold}
                  className="h-3 w-full overflow-hidden rounded-full bg-accent"
                >
                  <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}