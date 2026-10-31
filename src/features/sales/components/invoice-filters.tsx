
"use client";

import { FilterMenu, type FilterGroup } from "@/components/common/filter-menu";
import { SalesOrderIcon } from "./sales-order-icon";

type InvoiceStatus = "paid" | "partially_paid" | "pending";
type InvoiceType = "customer" | "supplier";

export interface InvoiceFiltersValue {
  status: InvoiceStatus | "all";
  type: InvoiceType | "all";
}

export const EMPTY_INVOICE_FILTERS: InvoiceFiltersValue = {
  status: "all",
  type: "all",
};

const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  paid: "Paid",
  partially_paid: "Partially paid",
  pending: "Pending",
};

const INVOICE_TYPE_LABELS: Record<InvoiceType, string> = {
  customer: "Customer",
  supplier: "Supplier",
};

export function InvoiceFilters({
  value,
  onChange,
}: {
  value: InvoiceFiltersValue;
  onChange: (value: InvoiceFiltersValue) => void;
}) {
  const groups: FilterGroup[] = [
    {
      id: "status",
      label: "Invoice Status",
      value: value.status,
      defaultValue: "all",
      defaultLabel: "All statuses",
      options: Object.entries(INVOICE_STATUS_LABELS).map(
        ([id, label]) => ({
          value: id,
          label,
        }),
      ),
      onChange: (status) =>
        onChange({
          ...value,
          status: status as InvoiceFiltersValue["status"],
        }),
    },
    {
      id: "type",
      label: "Invoice Type",
      value: value.type,
      defaultValue: "all",
      defaultLabel: "All types",
      options: Object.entries(INVOICE_TYPE_LABELS).map(
        ([id, label]) => ({
          value: id,
          label,
        }),
      ),
      onChange: (type) =>
        onChange({
          ...value,
          type: type as InvoiceFiltersValue["type"],
        }),
    },
  ];

  return (
    <FilterMenu
      groups={groups}
      label="Filter"
      icon={<SalesOrderIcon name="filter" className="size-4" />}
      align="right"
      className="cursor-pointer"
      onClear={() => onChange(EMPTY_INVOICE_FILTERS)}
      onApply={(next) =>
        onChange({
          status: next.status as InvoiceFiltersValue["status"],
          type: next.type as InvoiceFiltersValue["type"],
        })
      }
    />
  );
}
