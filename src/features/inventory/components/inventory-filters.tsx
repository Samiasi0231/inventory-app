"use client";

import { useState } from "react";
import { ChevronDownIcon, ListFilterIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { MOCK_CATEGORIES } from "../mock-data";
import { STOCK_STATUS_LABELS, type StockStatus } from "../types";

export interface InventoryFilterState {
  status: StockStatus | "all";
  categoryId: string;
}

export const DEFAULT_FILTERS: InventoryFilterState = { status: "all", categoryId: "all" };

const STATUS_OPTIONS: { value: StockStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "in_stock", label: STOCK_STATUS_LABELS.in_stock },
  { value: "low_stock", label: STOCK_STATUS_LABELS.low_stock },
  { value: "out_of_stock", label: STOCK_STATUS_LABELS.out_of_stock },
];

interface InventoryFiltersProps {
  value: InventoryFilterState;
  onChange: (value: InventoryFilterState) => void;
}

export function InventoryFilters({ value, onChange }: InventoryFiltersProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  const activeCount =
    (value.status !== "all" ? 1 : 0) + (value.categoryId !== "all" ? 1 : 0);

  function openChange(nextOpen: boolean) {
    // Re-sync the draft each time the popover opens so a cancelled edit is dropped.
    if (nextOpen) setDraft(value);
    setOpen(nextOpen);
  }

  return (
    <Popover open={open} onOpenChange={openChange}>
      <PopoverTrigger className="flex h-8 shrink-0 items-center justify-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted">
        <ListFilterIcon className="size-4" />
        Filter
        {activeCount > 0 && (
          <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {activeCount}
          </span>
        )}
        <ChevronDownIcon className="size-4" />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[260px] p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-status" className="text-xs font-medium text-ink-2">
              Status
            </label>
            <select
              id="filter-status"
              value={draft.status}
              onChange={(event) =>
                setDraft({ ...draft, status: event.target.value as StockStatus | "all" })
              }
              className="h-9 w-full rounded-md border border-border bg-surface px-2 text-sm text-ink-1 outline-none focus-visible:border-primary"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="filter-category" className="text-xs font-medium text-ink-2">
              Category
            </label>
            <select
              id="filter-category"
              value={draft.categoryId}
              onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}
              className="h-9 w-full rounded-md border border-border bg-surface px-2 text-sm text-ink-1 outline-none focus-visible:border-primary"
            >
              <option value="all">All categories</option>
              {MOCK_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SecondaryButton
              fullWidth
              className="h-9"
              onClick={() => {
                setDraft(DEFAULT_FILTERS);
                onChange(DEFAULT_FILTERS);
                setOpen(false);
              }}
            >
              Clear
            </SecondaryButton>
            <PrimaryButton
              fullWidth
              className="h-9"
              onClick={() => {
                onChange(draft);
                setOpen(false);
              }}
            >
              Apply
            </PrimaryButton>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
