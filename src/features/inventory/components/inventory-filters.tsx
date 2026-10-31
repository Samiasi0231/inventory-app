"use client";

import { FilterMenu, type FilterOption } from "@/components/common/filter-menu";
import { MOCK_CATEGORIES } from "../mock-data";
import { STOCK_STATUS_LABELS, type StockStatus } from "../types";

export interface InventoryFilterState {
  status: StockStatus | "all";
  categoryId: string;
}

export const DEFAULT_FILTERS: InventoryFilterState = { status: "all", categoryId: "all" };

// No "All …" entries: the menu leaves the default out and "Clear filters" returns to it.
const STATUS_OPTIONS: FilterOption[] = [
  { value: "in_stock", label: STOCK_STATUS_LABELS.in_stock },
  { value: "low_stock", label: STOCK_STATUS_LABELS.low_stock },
  { value: "out_of_stock", label: STOCK_STATUS_LABELS.out_of_stock },
];

const CATEGORY_OPTIONS: FilterOption[] = MOCK_CATEGORIES.map((category) => ({
  value: category.id,
  label: category.name,
}));

interface InventoryFiltersProps {
  value: InventoryFilterState;
  onChange: (value: InventoryFilterState) => void;
}

/** Same props and exports as before, so the products page doesn't change. */
export function InventoryFilters({ value, onChange }: InventoryFiltersProps) {
  return (
    <FilterMenu
      groups={[
        {
          id: "status",
          label: "Status",
          value: value.status,
          options: STATUS_OPTIONS,
          defaultValue: DEFAULT_FILTERS.status,
          onChange: (status) => onChange({ ...value, status: status as StockStatus | "all" }),
        },
        {
          id: "category",
          label: "Category",
          value: value.categoryId,
          options: CATEGORY_OPTIONS,
          defaultValue: DEFAULT_FILTERS.categoryId,
          onChange: (categoryId) => onChange({ ...value, categoryId }),
        },
      ]}
      onClear={() => onChange(DEFAULT_FILTERS)}
    />
  );
}