"use client";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PERIOD_LABELS, type DashboardPeriod } from "@/types/dashboard";

const PERIODS = Object.keys(PERIOD_LABELS) as DashboardPeriod[];

interface PeriodSelectorProps {
  value: DashboardPeriod;
  onChange: (value: DashboardPeriod) => void;
  className?: string;
}

/** Styled to match `BranchSelector` so the two sit together as a pair. */
export function PeriodSelector({ value, onChange, className }: PeriodSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex h-8 shrink-0 items-center justify-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 shadow-[0_1px_2px_rgba(47,47,47,0.04)]",
          "text-sm font-bold tracking-[0.14px] text-ink-2 transition-colors hover:bg-surface-muted",
          className,
        )}
      >
        {PERIOD_LABELS[value]}
        <ChevronDownIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {PERIODS.map((period) => (
          <DropdownMenuItem key={period} onClick={() => onChange(period)}>
            <CheckIcon className={cn("size-4", period === value ? "opacity-100" : "opacity-0")} />
            {PERIOD_LABELS[period]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}