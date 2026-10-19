"use client";

import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SortDirection } from "@/types/shared";
import { getBalanceDue, getInvoiceStatus, INVOICE_STATUS_LABELS, type Invoice } from "../types";
import { InvoiceRowActions, type InvoiceAction } from "./invoice-row-actions";

interface Column {
  id: string;
  label: string;
  width?: string;
  align?: "left" | "center";
  sortable?: boolean;
}

const COLUMNS: Column[] = [
  { id: "number", label: "Invoices", width: "w-[150px]", sortable: true },
  { id: "issueDate", label: "Issued", width: "w-[130px]", sortable: true },
  { id: "dueDate", label: "Due", width: "w-[130px]", sortable: true },
  { id: "customerName", label: "Type", sortable: true },
  { id: "total", label: "Total", width: "w-[140px]", sortable: true },
  { id: "balanceDue", label: "Balance", width: "w-[140px]", sortable: true },
  { id: "status", label: "Status", width: "w-[140px]" },
  { id: "actions", label: "Actions", width: "w-[78px]", align: "center" },
];

interface InvoicesTableProps {
  invoices: (Invoice & { cancelled?: boolean })[];
  loading?: boolean;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  onSortChange: (column: string) => void;
  onAction: (action: InvoiceAction, invoice: Invoice) => void;
}

export function InvoicesTable({
  invoices,
  loading = false,
  pageSize = 15,
  sortBy,
  sortDirection,
  onSortChange,
  onAction,
}: InvoicesTableProps) {
  return (
    <Table className="min-w-[1000px] [&_tbody_td]:h-10 [&_tbody_td]:border-b-0 [&_tbody_td]:py-1">
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
          : invoices.map((invoice) => {
              const balance = getBalanceDue(invoice);
              return (
                <TableRow key={invoice.id}>
                  <TableCell className="w-[150px] font-medium">{invoice.number}</TableCell>
                  <TableCell className="w-[130px]">{formatDate(invoice.issueDate)}</TableCell>
                  <TableCell className="w-[130px]">{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell className="max-w-0 truncate" title={invoice.customerName}>
                    Customer
                  </TableCell>
                  <TableCell className="w-[140px]">{formatCurrency(invoice.total)}</TableCell>
                  <TableCell className="w-[140px]">
                    {balance > 0 ? formatCurrency(balance) : "-"}
                  </TableCell>
                  <TableCell className="w-[140px]">
                    <InvoiceStatusText status={getInvoiceStatus(invoice)} />
                  </TableCell>
                  <TableCell className="w-[78px] text-center">
                    <div className="flex justify-center">
                      <InvoiceRowActions invoice={invoice} onAction={onAction} />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
      </TableBody>
    </Table>
  );
}

function InvoiceStatusText({ status }: { status: ReturnType<typeof getInvoiceStatus> }) {
  const color = status === "paid" || status === "completed"
    ? "text-success-fg"
    : status === "partially_paid"
      ? "text-amber-500"
      : status === "cancelled"
        ? "text-ink-3"
        : "text-destructive";
  return <span className={cn("text-xs font-medium", color)}>• {INVOICE_STATUS_LABELS[status]}</span>;
}
