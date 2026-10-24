"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "./order-status-badge";
import { SalesOrderIcon, type SalesIconName } from "./sales-order-icon";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SortDirection } from "@/types/shared";
import {
  getOrderActions,
  getOrderBalance,
  getOrderPaymentStatus,
  ORDER_PAYMENT_LABELS,
  type OrderAction,
  type OrderPaymentStatus,
  type SalesOrder,
} from "../order-types";

const PAYMENT_VARIANTS: Record<OrderPaymentStatus, "success" | "danger" | "warning" | "neutral"> = {
  paid: "success",
  unpaid: "danger",
  partially_paid: "warning",
  refunded: "neutral",
};

const ACTION_ICONS: Record<OrderAction, SalesIconName> = { view: "view", view_invoice: "invoice", create_invoice: "invoice", view_returns: "returns", view_receipt: "receipt", record_payment: "payment", send_goods: "send", cancel: "cancel" };

interface Column {
  id: string;
  label: string;
  width?: string;
  align?: "center";
  sortable?: boolean;
}

const COLUMNS: Column[] = [
  { id: "orderId", label: "Order ID", width: "w-[125px]", sortable: true },
  { id: "customerName", label: "Customer", sortable: true },
  { id: "orderDate", label: "Order date", width: "w-[112px]", sortable: true },
  { id: "dueDate", label: "Due date", width: "w-[112px]", sortable: true },
  { id: "total", label: "Total", width: "w-[128px]", sortable: true },
  { id: "balance", label: "Balance", width: "w-[118px]", sortable: true },
  { id: "payment", label: "Payment", width: "w-[128px]" },
  { id: "status", label: "Status", width: "w-[150px]" },
  { id: "actions", label: "Actions", width: "w-[78px]", align: "center" },
];

interface OrdersTableProps {
  orders: SalesOrder[];
  loading?: boolean;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  onSortChange: (column: string) => void;
  onAction: (action: OrderAction, order: SalesOrder) => void;
}

export function OrdersTable({
  orders,
  loading = false,
  pageSize = 15,
  sortBy,
  sortDirection,
  onSortChange,
  onAction,
}: OrdersTableProps) {
  return (
    <Table className="min-w-[1096px] table-fixed [&_tbody_tr:last-child_td]:border-b [&_tbody_tr:last-child_td]:border-[#dedede]">
      <colgroup>{[142,110,124,124,152,118,128,122,76].map((width, i) => <col key={i} style={{ width: `${width/1096*100}%` }} />)}</colgroup>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {COLUMNS.map((column) => {
            const isSorted = sortBy === column.id;
            const SortIcon = !isSorted
              ? ChevronsUpDownIcon
              : sortDirection === "desc"
                ? ArrowDownIcon
                : ArrowUpIcon;

            return (
              <TableHead
                key={column.id}
                className={cn("h-10 py-2.5 font-medium", column.width, column.align === "center" && "text-center")}
                aria-sort={
                  isSorted ? (sortDirection === "desc" ? "descending" : "ascending") : undefined
                }
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => onSortChange(column.id)}
                    className="group/sort relative inline-flex items-center gap-1 rounded transition-colors hover:text-primary"
                  >
                    {column.label}
                    <SortIcon
                      className={cn(
                        "absolute -right-4 size-3 transition-opacity",
                        isSorted ? "opacity-100" : "opacity-0 group-hover/sort:opacity-60",
                      )}
                    />
                  </button>
                ) : (
                  column.label
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading
          ? Array.from({ length: pageSize }).map((_, index) => (
              <TableRow key={`skeleton-${index}`} className="hover:bg-transparent">
                {COLUMNS.map((column) => (
                  <TableCell key={column.id} className={cn("h-12 border-b-0 py-2 font-normal", column.width)}>
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : orders.map((order) => {
              const balance = getOrderBalance(order);
              const payment = getOrderPaymentStatus(order);
              const actions = getOrderActions(order.status);

              return (
                <TableRow key={order.id}>
                  <TableCell className="h-12 border-b-0 py-2 font-normal w-[125px] whitespace-nowrap">{order.orderId}</TableCell>
                  <TableCell className="h-12 border-b-0 py-2 font-normal max-w-0 truncate" title={order.customerName}>
                    {order.customerName}
                  </TableCell>
                  <TableCell className="h-12 border-b-0 py-2 font-normal w-[112px] whitespace-nowrap">{formatDate(order.orderDate)}</TableCell>
                  <TableCell className="h-12 border-b-0 py-2 font-normal w-[112px] whitespace-nowrap">{formatDate(order.dueDate)}</TableCell>
                  <TableCell className="h-12 border-b-0 py-2 font-normal w-[128px] whitespace-nowrap">{formatCurrency(order.total)}</TableCell>
                  <TableCell className="h-12 border-b-0 py-2 font-normal w-[118px] whitespace-nowrap">
                    {balance > 0 ? formatCurrency(balance) : "-"}
                  </TableCell>
                  <TableCell className="h-12 border-b-0 py-2 font-normal w-[128px]">
                    <Badge variant={PAYMENT_VARIANTS[payment]} dot className="bg-transparent! px-0 text-xs font-normal">
                      {ORDER_PAYMENT_LABELS[payment]}
                    </Badge>
                  </TableCell>
                  <TableCell className="h-12 border-b-0 py-2 font-normal w-[150px]">
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="h-12 border-b-0 py-2 font-normal w-[78px] text-center">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={`Actions for ${order.orderId}`}
                          className="flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-muted data-popup-open:bg-surface-muted"
                        >
                          <MoreHorizontalIcon className="size-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-72 overflow-hidden rounded-[14px] border-[#dedede] p-0 shadow-[0_1px_2px_rgb(47_47_47/20%)]">
                          {actions.map((entry) => (
                            <DropdownMenuItem
                              key={entry.id}
                              className="min-h-11 rounded-none px-4 py-3 font-normal first:bg-surface-muted data-highlighted:bg-accent"
                              onClick={() => onAction(entry.id, order)}
                            >
                              <SalesOrderIcon name={ACTION_ICONS[entry.id]} />{entry.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
      </TableBody>
    </Table>
  );
}
