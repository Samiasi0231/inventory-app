"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BanknoteIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  PlusIcon,
  ReceiptIcon,
  SearchIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { StatCard, StatCardSkeleton } from "@/components/common/stat-card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { formatCurrency, formatCurrencyCompact, formatDate, formatNumber } from "@/lib/format";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { ReceiptDialog } from "@/features/sales/components/receipt-dialog";
import {
  receiptsService,
  type Receipt,
} from "@/features/sales/receipts.service";
import { PAYMENT_METHODS } from "@/features/sales/types";

const COLUMNS = [
  { id: "number", label: "Receipt No", width: "w-[130px]" },
  { id: "issuedAt", label: "Date", width: "w-[130px]" },
  { id: "invoiceNumber", label: "Invoice No", width: "w-[150px]" },
  { id: "customerName", label: "Customer" },
  { id: "method", label: "Method", width: "w-[110px]" },
  { id: "receivedBy", label: "Received by", width: "w-[150px]" },
  { id: "amount", label: "Amount", width: "w-[140px]" },
  { id: "actions", label: "Actions", width: "w-[78px]" },
];

export default function SalesReceiptsPage() {
  const router = useRouter();
  const { activeBranch } = useBranch();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [page, setPage] = useState(1);

  const [activeReceipt, setActiveReceipt] = useState<Receipt | null>(null);

  const params = useMemo(
    () => ({
      page,
      pageSize: 15,
      search: debouncedSearch || undefined,
      branchId: activeBranch.id,
    }),
    [page, debouncedSearch, activeBranch.id],
  );

  const {
    data: resource,
    loading,
    error,
    refetch,
  } = useAsyncResource(
    JSON.stringify(params),
    () =>
      Promise.all([
        receiptsService.listReceipts(params),
        receiptsService.getSummary({ branchId: activeBranch.id }),
      ]).then(([list, summary]) => ({ list, summary })),
    "We couldn't load your receipts. Please try again.",
  );


  const receipts = resource?.list.data ?? [];
  const total = resource?.list.total ?? 0;
  const summary = resource?.summary;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <TopbarAction>
        <PrimaryButton
          onClick={() => router.push("/sales/new")}
          leftIcon={<PlusIcon className="size-5" />}
          className="h-12 px-6 text-base"
        >
          <span className="hidden sm:inline">Add New Sales</span>
          <span className="sm:hidden">New</span>
        </PrimaryButton>
      </TopbarAction>

      <section className="flex flex-col gap-4 rounded-xl bg-surface p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-ink-1">Receipts</h1>
          <p className="mt-2 text-base text-ink-1">
            Every sale in your organization, including cancelled and pending ones.
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

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {loading || !summary ? (
          Array.from({ length: 3 }).map((_, index) => <StatCardSkeleton key={index} />)
        ) : (
          <>
            <StatCard
              icon={BanknoteIcon}
              label="Collected"
              value={formatCurrencyCompact(summary.collected)}
              description="Across all receipts"
              delta={summary.collectedDelta}
            />
            <StatCard
              icon={ReceiptIcon}
              label="Receipts"
              value={formatNumber(summary.receiptCount)}
              description="Issued to customers"
            />
            <StatCard
              icon={FileTextIcon}
              label="Invoices"
              value={formatNumber(summary.invoices)}
              description="Settled by these receipts"
            />
          </>
        )}
      </section>

      <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
        <div className="flex h-[42px] w-full items-center gap-2 rounded-lg border border-border px-4 py-2 lg:max-w-[460px]">
          <SearchIcon className="size-5 shrink-0 text-ink-4" />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search receipts, invoices or customers"
            aria-label="Search receipts"
            className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
          />
        </div>

        {error ? (
          <EmptyState
            icon={TriangleAlertIcon}
            title="We couldn't load your receipts"
            description={error}
            action={<SecondaryButton onClick={refetch}>Try again</SecondaryButton>}
          />
        ) : !loading && receipts.length === 0 ? (
          <EmptyState
            icon={ReceiptIcon}
            title={search ? "No receipts match your search" : "No receipts yet"}
            description={
              search
                ? "Try a different reference or customer name."
                : "Receipts appear here once you take payment on a sale."
            }
          />
        ) : (
          <>
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  {COLUMNS.map((column) => (
                    <TableHead
                      key={column.id}
                      className={column.id === "actions" ? `${column.width} text-center` : column.width}
                    >
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
                            <Skeleton className="h-4 w-full max-w-[120px]" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  : receipts.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell className="w-[130px] font-medium">{receipt.number}</TableCell>
                        <TableCell className="w-[130px]">{formatDate(receipt.issuedAt)}</TableCell>
                        <TableCell className="w-[150px]">{receipt.invoiceNumber}</TableCell>
                        <TableCell className="max-w-0 truncate" title={receipt.customerName}>
                          {receipt.customerName}
                        </TableCell>
                        <TableCell className="w-[110px]">
                          {PAYMENT_METHODS.find((entry) => entry.value === receipt.method)?.label ??
                            receipt.method}
                        </TableCell>
                        <TableCell className="w-[150px]">{receipt.receivedBy}</TableCell>
                        <TableCell className="w-[140px]">{formatCurrency(receipt.amount)}</TableCell>
                        <TableCell className="w-[78px] text-center">
                          <div className="flex justify-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                aria-label={`Actions for ${receipt.number}`}
                                className="flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-muted data-popup-open:bg-surface-muted"
                              >
                                <MoreHorizontalIcon className="size-5" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setActiveReceipt(receipt)}>
                                  <EyeIcon />
                                  View Details
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            <Pagination page={page} pageSize={15} total={total} onPageChange={setPage} />
          </>
        )}
      </section>

      <ReceiptDialog
        receipt={activeReceipt}
        open={Boolean(activeReceipt)}
        onOpenChange={(open) => !open && setActiveReceipt(null)}
        onViewSale={() => router.push("/sales/invoices")}
      />
    </div>
  );
}
