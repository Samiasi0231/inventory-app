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
import { formatCurrency, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SortDirection } from "@/types/shared";
import { getStockStatus, type InventoryItem } from "../types";
import { ProductRowActions, type RowAction } from "./product-row-actions";
import { StockStatusBadge } from "./stock-status-badge";

type SortableColumn = keyof Pick<
  InventoryItem,
  "itemCode" | "name" | "categoryName" | "totalStock" | "costPrice" | "sellingPrice"
>;

interface Column {
  id: SortableColumn | "status" | "actions";
  label: string;
  /** Flexible columns leave this undefined. */
  width?: string;
  align?: "left" | "center";
  sortable?: boolean;
}

const COLUMNS: Column[] = [
  { id: "itemCode", label: "Item Code", width: "w-[92px]", sortable: true },
  { id: "name", label: "Product Name", sortable: true },
  { id: "categoryName", label: "Category", sortable: true },
  { id: "totalStock", label: "Total Stock", width: "w-[98px]", sortable: true },
  { id: "status", label: "Status", width: "w-[114px]" },
  { id: "costPrice", label: "Cost Price", width: "w-[140px]", sortable: true },
  { id: "sellingPrice", label: "Selling Price", width: "w-[140px]", sortable: true },
  { id: "actions", label: "Actions", width: "w-[78px]", align: "center" },
];

interface ProductsTableProps {
  items: InventoryItem[];
  loading?: boolean;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
  onSortChange: (column: SortableColumn) => void;
  onAction: (action: RowAction, item: InventoryItem) => void;
}

export function ProductsTable({
  items,
  loading = false,
  pageSize = 15,
  sortBy,
  sortDirection,
  onSortChange,
  onAction,
}: ProductsTableProps) {
  return (
    // Below ~900px the columns squash, so the table scrolls horizontally.
    <Table className="min-w-[900px]">
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
                    onClick={() => onSortChange(column.id as SortableColumn)}
                    className="group/sort inline-flex items-center gap-1 rounded transition-colors hover:text-primary"
                  >
                    {column.label}
                    <SortIcon
                      className={cn(
                        "size-3 transition-opacity",
                        isSorted
                          ? "opacity-100"
                          : "opacity-0 group-hover/sort:opacity-60",
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
          : items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="w-[92px]">{item.itemCode}</TableCell>
                <TableCell className="max-w-0 truncate" title={item.name}>
                  {item.name}
                </TableCell>
                <TableCell className="max-w-0 truncate" title={item.categoryName}>
                  {item.categoryName}
                </TableCell>
                <TableCell className="w-[98px]">{formatNumber(item.totalStock)}</TableCell>
                <TableCell className="w-[114px]">
                  <StockStatusBadge status={getStockStatus(item)} />
                </TableCell>
                <TableCell className="w-[140px]">{formatCurrency(item.costPrice)}</TableCell>
                <TableCell className="w-[140px]">{formatCurrency(item.sellingPrice)}</TableCell>
                <TableCell className="w-[78px] text-center">
                  <div className="flex justify-center">
                    <ProductRowActions item={item} onAction={onAction} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
