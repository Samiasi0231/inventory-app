"use client";

import { useMemo, useState } from "react";
import {
  ChevronDownIcon,
  DownloadIcon,
  HistoryIcon,
  ListFilterIcon,
  PlusIcon,
  SearchIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBranch } from "@/context/branch-context";
import { BranchSelector } from "@/layout/branch-selector";
import { TopbarAction } from "@/layout/app-topbar";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useAwaitingDesign } from "@/hooks/use-awaiting-design";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatNumber } from "@/lib/format";
import {
  STOCK_MOVEMENT_LABELS,
  stockHistoryService,
  type StockMovement,
  type StockMovementType,
} from "@/features/inventory/stock-history.service";

const TYPE_VARIANTS: Record<
  StockMovementType,
  "purple" | "success" | "danger" | "warning"
> = {
  purchase: "purple",
  sale: "success",
  refund: "danger",
  adjustment: "warning",
};

const COLUMNS = [
  { id: "reference", label: "Ref No", width: "w-[110px]" },
  { id: "occurredAt", label: "Date and Time", width: "w-[170px]" },
  { id: "itemName", label: "Item" },
  { id: "type", label: "Type", width: "w-[130px]" },
  { id: "quantity", label: "Quantity", width: "w-[100px]" },
  { id: "staff", label: "Staff", width: "w-[170px]" },
  { id: "notes", label: "Notes", width: "w-[230px]" },
];

const dayFormatter = new Intl.DateTimeFormat("en-NG", {
  day: "2-digit",
  month: "short",
});
const timeFormatter = new Intl.DateTimeFormat("en-NG", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** "Today, 10:42 am", "Yesterday, 5:42 am" or "07 Oct, 10:42 am". */
function formatMovementTime(value: string) {
  const date = new Date(value);
  const now = new Date();
  const startOfDay = (input: Date) =>
    new Date(input.getFullYear(), input.getMonth(), input.getDate()).getTime();
  const daysAgo = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);

  const day =
    daysAgo === 0
      ? "Today"
      : daysAgo === 1
        ? "Yesterday"
        : dayFormatter.format(date);
  return `${day}, ${timeFormatter.format(date).toLowerCase()}`;
}

/** Refunds show a plain figure; every other movement is signed. */
function formatQuantity(movement: StockMovement) {
  if (movement.type === "refund")
    return formatNumber(Math.abs(movement.quantity));
  const sign = movement.quantity > 0 ? "+" : "-";
  return `${sign}${formatNumber(Math.abs(movement.quantity))}`;
}

const TYPE_OPTIONS: (StockMovementType | "all")[] = [
  "all",
  "purchase",
  "sale",
  "refund",
  "adjustment",
];

export default function StockHistoryPage() {
  const { activeBranch } = useBranch();
  const awaitingDesign = useAwaitingDesign();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [type, setType] = useState<StockMovementType | "all">("all");
  const [draftType, setDraftType] = useState<StockMovementType | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({
      page,
      pageSize: 15,
      search: debouncedSearch || undefined,
      branchId: activeBranch.id,
      type,
    }),
    [page, debouncedSearch, activeBranch.id, type],
  );

  const { data, loading, error, refetch } = useAsyncResource(
    JSON.stringify(params),
    () => stockHistoryService.listMovements(params),
    "We couldn't load the stock history. Please try again.",
  );

  const movements = data?.data ?? [];
  const total = data?.total ?? 0;
  const hasFilters = Boolean(debouncedSearch) || type !== "all";

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <TopbarAction>
        <PrimaryButton
          onClick={() => awaitingDesign("Adding stock")}
          leftIcon={<PlusIcon className="size-5" />}
          className="h-12 px-6 text-base"
        >
          <span className="hidden sm:inline">Add Stock</span>
          <span className="sm:hidden">Add</span>
        </PrimaryButton>
      </TopbarAction>

      <section className="flex flex-col gap-4 rounded-xl bg-surface p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-ink-1">Stock History</h1>
          <p className="mt-2 text-base text-ink-1">
            Every stock movement across your branches.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <BranchSelector />
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted"
          >
            <DownloadIcon className="size-4" />
            Export
          </button>
        </div>
      </section>

      <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex h-[42px] w-full items-center gap-2 rounded-lg border border-border px-4 py-2 sm:max-w-[633px]">
            <SearchIcon className="size-5 shrink-0 text-ink-4" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search in Items"
              aria-label="Search stock history"
              className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
            />
          </div>

          <div className="self-start sm:self-auto">
            <Popover
              open={filterOpen}
              onOpenChange={(next) => {
                // Re-sync the draft each time it opens so a cancelled edit is dropped.
                if (next) setDraftType(type);
                setFilterOpen(next);
              }}
            >
              <PopoverTrigger className="flex h-8 items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted">
                <ListFilterIcon className="size-4" />
                Filter
                {type !== "all" && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    1
                  </span>
                )}
                <ChevronDownIcon className="size-4" />
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[260px] p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="movement-type"
                      className="text-xs font-medium text-ink-2"
                    >
                      Type
                    </label>
                    <select
                      id="movement-type"
                      value={draftType}
                      onChange={(event) =>
                        setDraftType(
                          event.target.value as StockMovementType | "all",
                        )
                      }
                      className="h-9 w-full rounded-md border border-border bg-surface px-2 text-sm text-ink-1 outline-none focus-visible:border-primary"
                    >
                      {TYPE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option === "all"
                            ? "All types"
                            : STOCK_MOVEMENT_LABELS[option]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <SecondaryButton
                      fullWidth
                      className="h-9"
                      onClick={() => {
                        setType("all");
                        setPage(1);
                        setFilterOpen(false);
                      }}
                    >
                      Clear
                    </SecondaryButton>
                    <PrimaryButton
                      fullWidth
                      className="h-9"
                      onClick={() => {
                        setType(draftType);
                        setPage(1);
                        setFilterOpen(false);
                      }}
                    >
                      Apply
                    </PrimaryButton>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {error ? (
          <EmptyState
            icon={TriangleAlertIcon}
            title="We couldn't load the stock history"
            description={error}
            action={
              <SecondaryButton onClick={refetch}>Try again</SecondaryButton>
            }
          />
        ) : !loading && movements.length === 0 ? (
          <EmptyState
            icon={HistoryIcon}
            title={
              hasFilters
                ? "No movements match your filters"
                : "No stock movements yet"
            }
            description={
              hasFilters
                ? "Try a different search term or type."
                : "Purchases, sales, refunds and adjustments will be listed here."
            }
            action={
              hasFilters ? (
                <SecondaryButton
                  onClick={() => {
                    setSearch("");
                    setType("all");
                    setPage(1);
                  }}
                >
                  Clear filters
                </SecondaryButton>
              ) : undefined
            }
          />
        ) : (
          <>
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {COLUMNS.map((column) => (
                    <TableHead key={column.id} className={column.width}>
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading
                  ? Array.from({ length: 15 }).map((_, index) => (
                      <TableRow key={index} className="hover:bg-transparent">
                        {COLUMNS.map((column) => (
                          <TableCell key={column.id} className={column.width}>
                            <Skeleton className="h-4 w-full max-w-[110px]" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : movements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell className="w-[110px] whitespace-nowrap">
                          {movement.reference}
                        </TableCell>
                        <TableCell className="w-[170px] whitespace-nowrap">
                          {formatMovementTime(movement.occurredAt)}
                        </TableCell>
                        <TableCell
                          className="max-w-0 truncate"
                          title={movement.itemName}
                        >
                          {movement.itemName}
                        </TableCell>
                        <TableCell className="w-[130px]">
                          <Badge variant={TYPE_VARIANTS[movement.type]}>
                            {STOCK_MOVEMENT_LABELS[movement.type]}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-[100px] whitespace-nowrap">
                          {formatQuantity(movement)}
                        </TableCell>
                        <TableCell className="w-[170px]">
                          {movement.staff}
                        </TableCell>
                        <TableCell
                          className="w-[230px] max-w-[230px] truncate"
                          title={movement.notes || undefined}
                        >
                          {movement.notes || "--"}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            <Pagination
              page={page}
              pageSize={15}
              total={total}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
