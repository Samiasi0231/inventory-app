"use client";
import { FilterMenu, type FilterGroup } from "@/components/common/filter-menu";
import {
  ORDER_STATUS_LABELS,
  ORDER_PAYMENT_LABELS,
  type OrderStatus,
  type OrderPaymentStatus,
} from "../order-types";
import { SalesOrderIcon } from "./sales-order-icon";

export interface OrderFiltersValue {
  status: OrderStatus | "all";
  payment: OrderPaymentStatus | "all";
}

export const EMPTY_ORDER_FILTERS: OrderFiltersValue = {
  status: "all",
  payment: "all",
};

export function OrderFilters({
  value,
  onChange,
}: {
  value: OrderFiltersValue;
  onChange: (value: OrderFiltersValue) => void;
}) {
  const groups: FilterGroup[] = [
    {
      id: "status",
      label: "Order Status",
      value: value.status,
      defaultValue: "all",
      defaultLabel: "All statuses",
      options: Object.entries(ORDER_STATUS_LABELS).map(
        ([id, label]) => ({
          value: id,
          label,
        }),
      ),
      onChange: (status) =>
        onChange({
          ...value,
          status: status as OrderFiltersValue["status"],
        }),
    },
    {
      id: "payment",
      label: "Payment",
      value: value.payment,
      defaultValue: "all",
      defaultLabel: "All payments",
      options: Object.entries(ORDER_PAYMENT_LABELS).map(
        ([id, label]) => ({
          value: id,
          label,
        }),
      ),
      onChange: (payment) =>
        onChange({
          ...value,
          payment: payment as OrderFiltersValue["payment"],
        }),
    },
  ];

  return (
    <FilterMenu
      groups={groups}
      label="Filter"
      icon={<SalesOrderIcon name="filter" className="size-4" />}
      align="right"
      onClear={() => onChange(EMPTY_ORDER_FILTERS)}
      onApply={(next) =>
        onChange({
          status: next.status as OrderFiltersValue["status"],
          payment: next.payment as OrderFiltersValue["payment"],
        })
      }
    />
  );
}
