import type { LucideIcon } from "lucide-react";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPercentDelta } from "@/lib/format";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
   value: string;
  description: string;
  /** Percentage change for the previous period. */
  delta?: number;
  /** Emphasis for the figure, e.g. red for an overdue amount. */
  valueClassName?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  description,
  delta,
  valueClassName,
  className,
}: StatCardProps) {
  const isPositive = (delta ?? 0) >= 0;
  const TrendIcon = isPositive ? TrendingUpIcon : TrendingDownIcon;

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col justify-center gap-4 rounded-lg bg-surface p-5",
        className,
      )}
    >
      <div className="flex items-center gap-1">
        <Icon className="size-5 shrink-0 text-ink-3" />
        <p className="truncate text-sm font-medium tracking-[0.14px] text-ink-3">{label}</p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <p className={cn("truncate text-2xl font-semibold text-ink-1", valueClassName)}>{value}</p>
          {delta !== undefined && (
            <span
              className={cn(
                "flex shrink-0 items-center gap-0.5 rounded-full p-1 text-[10px] font-medium tracking-[0.2px]",
                isPositive ? "bg-success-bg text-success-fg" : "bg-danger-bg text-danger-fg",
              )}
            >
              <TrendIcon className="size-3" />
              {formatPercentDelta(delta)}
            </span>
          )}
        </div>
        <p className="text-xs tracking-[0.18px] text-ink-1">{description}</p>
      </div>
    </div>
  );
}

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col justify-center gap-4 rounded-lg bg-surface p-5", className)}>
      <Skeleton className="h-5 w-32" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}
