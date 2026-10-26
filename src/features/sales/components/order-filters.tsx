"use client";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Field, SelectInput } from "@/components/form/app-fields";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { ORDER_STATUS_LABELS, ORDER_PAYMENT_LABELS, type OrderStatus, type OrderPaymentStatus } from "../order-types";
import { SalesOrderIcon } from "./sales-order-icon";
export interface OrderFiltersValue { status: OrderStatus | "all"; payment: OrderPaymentStatus | "all" }
export const EMPTY_ORDER_FILTERS: OrderFiltersValue = { status: "all", payment: "all" };
export function OrderFilters({ value, onChange }: { value: OrderFiltersValue; onChange: (value: OrderFiltersValue) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const count = Number(value.status !== "all") + Number(value.payment !== "all");
  return <Popover open={open} onOpenChange={open => { if (open) setDraft(value); setOpen(open); }}><PopoverTrigger className="flex h-8 items-center gap-2 rounded-lg border border-border px-3 text-sm font-semibold tracking-[0.14px] text-primary hover:bg-accent"><SalesOrderIcon name="filter" className="size-4" />Filter{count > 0 && <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">{count}</span>}<SalesOrderIcon name="chevron" className="size-4" /></PopoverTrigger><PopoverContent align="end" className="w-[280px] space-y-4 p-4"><Field label="Order Status" htmlFor="sales-filter-status"><SelectInput id="sales-filter-status" value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value as OrderFiltersValue["status"] })}><option value="all">All statuses</option>{Object.entries(ORDER_STATUS_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</SelectInput></Field><Field label="Payment" htmlFor="sales-filter-payment"><SelectInput id="sales-filter-payment" value={draft.payment} onChange={event => setDraft({ ...draft, payment: event.target.value as OrderFiltersValue["payment"] })}><option value="all">All payments</option>{Object.entries(ORDER_PAYMENT_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</SelectInput></Field><div className="flex gap-2"><SecondaryButton fullWidth onClick={() => { onChange(EMPTY_ORDER_FILTERS); setOpen(false); }}>Clear</SecondaryButton><PrimaryButton fullWidth onClick={() => { onChange(draft); setOpen(false); }}>Apply</PrimaryButton></div></PopoverContent></Popover>;
}
