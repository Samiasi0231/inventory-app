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
  ORDER_STATUS_LABELS,
  type OrderAction,
  type OrderPaymentStatus,
  type OrderStatus,
  type SalesOrder,
} from "../order-types";

const PAYMENT_VARIANTS: Record<OrderPaymentStatus, "success" | "danger" | "warning" | "neutral"> = {
  paid: "success",
  unpaid: "danger",
  partially_paid: "warning",
  refunded: "neutral",
};

const STATUS_VARIANTS: Record<OrderStatus, "success" | "danger" | "warning" | "neutral"> = {
  completed: "success",
  fulfilled: "success",
  confirmed: "success",
  partially_received: "warning",
  pending: "neutral",
  cancelled: "danger",
};

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
    <Table className="min-w-[1040px]">
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
                className={cn(column.width, column.align === "center" && "text-center")}
                aria-sort={
                  isSorted ? (sortDirection === "desc" ? "descending" : "ascending") : undefined
                }
              >
                {column.sortable ? (
                  <button
                    type="button"
                    onClick={() => onSortChange(column.id)}
                    className="group/sort inline-flex items-center gap-1 rounded transition-colors hover:text-primary"
                  >
                    {column.label}
                    <SortIcon
                      className={cn(
                        "size-3 transition-opacity",
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
                  <TableCell key={column.id} className={column.width}>
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
                  <TableCell className="w-[125px] font-medium whitespace-nowrap">{order.orderId}</TableCell>
                  <TableCell className="max-w-0 truncate" title={order.customerName}>
                    {order.customerName}
                  </TableCell>
                  <TableCell className="w-[112px] whitespace-nowrap">{formatDate(order.orderDate)}</TableCell>
                  <TableCell className="w-[112px] whitespace-nowrap">{formatDate(order.dueDate)}</TableCell>
                  <TableCell className="w-[128px] whitespace-nowrap">{formatCurrency(order.total)}</TableCell>
                  <TableCell className="w-[118px] whitespace-nowrap">
                    {balance > 0 ? formatCurrency(balance) : "-"}
                  </TableCell>
                  <TableCell className="w-[128px]">
                    <Badge variant={PAYMENT_VARIANTS[payment]} dot>
                      {ORDER_PAYMENT_LABELS[payment]}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[150px]">
                    <Badge variant={STATUS_VARIANTS[order.status]} dot>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[78px] text-center">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={`Actions for ${order.orderId}`}
                          className="flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-muted data-popup-open:bg-surface-muted"
                        >
                          <MoreHorizontalIcon className="size-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {actions.map((entry) => (
                            <DropdownMenuItem
                              key={entry.id}
                              variant={entry.id === "cancel" ? "destructive" : "default"}
                              onClick={() => onAction(entry.id, order)}
                            >
                              {entry.label}
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
