"use client";

import {
  ArchiveRestoreIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BanIcon,
  ChevronsUpDownIcon,
  EyeIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  Undo2Icon,
  WalletIcon,
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
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SortDirection } from "@/types/shared";
import {
  getPurchaseActions,
  getPurchasePaymentStatus,
  PURCHASE_PAYMENT_LABELS,
  PURCHASE_STATUS_LABELS,
  type PurchaseAction,
  type PurchaseOrder,
  type PurchaseOrderStatus,
  type PurchasePaymentStatus,
} from "../types";

const ACTION_ICONS: Record<PurchaseAction, typeof EyeIcon> = {
  view: EyeIcon,
  receive: ArchiveRestoreIcon,
  record_invoice: FileTextIcon,
  return: Undo2Icon,
  record_payment: WalletIcon,
  cancel: BanIcon,
};

const PAYMENT_VARIANTS: Record<PurchasePaymentStatus, "success" | "danger" | "warning" | "neutral"> =
  {
    paid: "success",
    unpaid: "danger",
    partially_paid: "warning",
    refunded: "neutral",
  };

const STATUS_VARIANTS: Record<PurchaseOrderStatus, "success" | "danger" | "warning" | "neutral"> = {
  completed: "success",
  received: "success",
  partially_received: "warning",
  pending_approval: "neutral",
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
  { id: "purchaseId", label: "Purchase ID", width: "w-[110px]", sortable: true },
  { id: "supplierName", label: "Supplier", sortable: true },
  { id: "items", label: "Items", width: "w-[80px]", sortable: true },
  { id: "totalAmount", label: "Total Amount", width: "w-[130px]", sortable: true },
  { id: "date", label: "Date", width: "w-[115px]", sortable: true },
  { id: "fulfilled", label: "Fulfilled", width: "w-[90px]", sortable: true },
  { id: "payment", label: "Payment", width: "w-[125px]" },
  { id: "status", label: "Status", width: "w-[155px]" },
  { id: "actions", label: "Actions", width: "w-[78px]", align: "center" },
];

interface PurchaseOrdersTableProps {
  orders: PurchaseOrder[];
  loading?: boolean;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  onSortChange: (column: string) => void;
  onAction: (action: PurchaseAction, order: PurchaseOrder) => void;
}

export function PurchaseOrdersTable({
  orders,
  loading = false,
  pageSize = 15,
  sortBy,
  sortDirection,
  onSortChange,
  onAction,
}: PurchaseOrdersTableProps) {
  return (
    <Table className="min-w-[1060px]">
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
                    <Skeleton className="h-4 w-full max-w-[110px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : orders.map((order) => {
              const payment = getPurchasePaymentStatus(order);
              const actions = getPurchaseActions(order);

              return (
                <TableRow key={order.id}>
                  <TableCell className="w-[110px] font-medium whitespace-nowrap">
                    {order.purchaseId}
                  </TableCell>
                  <TableCell className="max-w-0 truncate" title={order.supplierName}>
                    {order.supplierName}
                  </TableCell>
                  <TableCell className="w-[80px]">{formatNumber(order.items)}</TableCell>
                  <TableCell className="w-[130px] whitespace-nowrap">
                    {formatCurrency(order.totalAmount)}
                  </TableCell>
                  <TableCell className="w-[115px] whitespace-nowrap">
                    {formatDate(order.date)}
                  </TableCell>
                  <TableCell className="w-[90px]">{formatNumber(order.fulfilled)}</TableCell>
                  <TableCell className="w-[125px]">
                    <Badge variant={PAYMENT_VARIANTS[payment]} dot>
                      {PURCHASE_PAYMENT_LABELS[payment]}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[155px]">
                    <Badge variant={STATUS_VARIANTS[order.status]} dot>
                      {PURCHASE_STATUS_LABELS[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-[78px] text-center">
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={`Actions for ${order.purchaseId}`}
                          className="flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-muted data-popup-open:bg-surface-muted"
                        >
                          <MoreHorizontalIcon className="size-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {actions.map((entry) => {
                            const Icon = ACTION_ICONS[entry.id];
                            return (
                              <DropdownMenuItem
                                key={entry.id}
                                disabled={entry.disabled}
                                variant={entry.id === "cancel" ? "destructive" : "default"}
                                onClick={() => onAction(entry.id, order)}
                              >
                                <Icon />
                                {entry.label}
                              </DropdownMenuItem>
                            );
                          })}
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
