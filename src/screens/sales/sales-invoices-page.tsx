"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadIcon,
  FileTextIcon,
  PlusIcon,
  SearchIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { FormDialog } from "@/components/common/form-dialog";
import { StatCard, StatCardSkeleton } from "@/components/common/stat-card";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { BranchSelector } from "@/layout/branch-selector";
import { TopbarAction } from "@/layout/app-topbar";
import { formatCurrency, formatCurrencyCompact, formatNumber } from "@/lib/format";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { SortDirection } from "@/types/shared";
import { InvoicePreviewDialog } from "@/features/sales/components/invoice-preview-dialog";
import type { InvoiceAction } from "@/features/sales/components/invoice-row-actions";
import { InvoicesTable } from "@/features/sales/components/invoices-table";
import { RecordPaymentDialog } from "@/features/sales/components/record-payment-dialog";
import { salesService } from "@/features/sales/sales.service";
import { INVOICE_STATUS_LABELS, type Invoice, type InvoiceStatus } from "@/features/sales/types";
import { useInvoiceList, useInvoiceSummary } from "@/features/sales/use-sales";

const STATUS_FILTERS: (InvoiceStatus | "all")[] = [
  "all",
  "pending",
  "partially_paid",
  "paid",
  "cancelled",
];

export default function SalesInvoicesPage() {
  const router = useRouter();
  const { activeBranch } = useBranch();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [status, setStatus] = useState<InvoiceStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [dialog, setDialog] = useState<"preview" | "payment" | "cancel" | null>(null);
  const [dialogKey, setDialogKey] = useState(0);
  const [cancelling, setCancelling] = useState(false);

  const params = useMemo(
    () => ({
      page,
      pageSize: 15,
      search: debouncedSearch || undefined,
      branchId: activeBranch.id,
      status,
      sortBy,
      sortDirection,
    }),
    [page, debouncedSearch, activeBranch.id, status, sortBy, sortDirection],
  );

  const list = useInvoiceList(params);
  const summary = useInvoiceSummary(activeBranch.id);

  const invoices = list.data?.data ?? [];
  const total = list.data?.total ?? 0;
  const hasFilters = Boolean(debouncedSearch) || status !== "all";

  function handleSortChange(column: string) {
    setPage(1);
    if (sortBy === column) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  }

  async function handleAction(action: InvoiceAction, invoice: Invoice) {
    setActiveInvoice(invoice);
    setDialogKey((key) => key + 1);

    if (action === "share") {
      const summaryText = `${invoice.number} — ${formatCurrency(invoice.total)} for ${invoice.customerName}`;
      try {
        await navigator.clipboard.writeText(summaryText);
        toast.add({ type: "success", title: "Copied to clipboard", description: summaryText });
      } catch {
        toast.add({
          type: "error",
          title: "Couldn't copy",
          description: "Your browser blocked clipboard access.",
        });
      }
      return;
    }

    setDialog(action === "view" ? "preview" : action === "payment" ? "payment" : "cancel");
  }

  async function confirmCancel() {
    if (!activeInvoice) return;
    setCancelling(true);
    try {
      await salesService.cancelInvoice(activeInvoice.id);
      toast.add({
        type: "success",
        title: "Invoice cancelled",
        description: `${activeInvoice.number} can no longer be paid. Issue a corrected invoice in its place.`,
      });
      setDialog(null);
      list.refetch();
      summary.refetch();
    } catch {
      toast.add({ type: "error", title: "Couldn't cancel invoice", description: "Please try again." });
    } finally {
      setCancelling(false);
    }
  }

  function handleMutationSuccess() {
    list.refetch();
    summary.refetch();
  }

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
          <h1 className="text-xl font-semibold text-ink-1">Invoices</h1>
          <p className="mt-2 text-base text-ink-1">
            Invoices are locked once confirmed. To fix one, cancel it and issue a corrected invoice.
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

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {summary.loading || !summary.data ? (
          Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
        ) : (
          <>
            <StatCard
              icon={FileTextIcon}
              label="Total Invoiced"
              value={formatCurrencyCompact(summary.data.totalInvoiced)}
              description="Across all invoices"
              delta={summary.data.totalInvoicedDelta}
            />
            <StatCard
              icon={FileTextIcon}
              label="Total Paid"
              value={formatCurrencyCompact(summary.data.totalPaid)}
              description="Settled by customers"
              delta={summary.data.totalPaidDelta}
            />
            <StatCard
              icon={FileTextIcon}
              label="Balance Due"
              value={formatCurrencyCompact(summary.data.balanceDue)}
              description="Still outstanding"
              delta={summary.data.balanceDueDelta}
            />
            <StatCard
              icon={FileTextIcon}
              label="Overdue Invoices"
              value={formatNumber(summary.data.overdueCount)}
              description="Past their due date"
              delta={summary.data.overdueCountDelta}
            />
          </>
        )}
      </section>

      <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex h-[42px] w-full items-center gap-2 rounded-lg border border-border px-4 py-2 lg:max-w-[460px]">
            <SearchIcon className="size-5 shrink-0 text-ink-4" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search invoices or customers"
              aria-label="Search invoices"
              className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((entry) => (
              <button
                key={entry}
                type="button"
                aria-pressed={status === entry}
                onClick={() => {
                  setStatus(entry);
                  setPage(1);
                }}
                className={
                  status === entry
                    ? "rounded-full border border-primary bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground"
                    : "rounded-full border border-border px-3 py-1.5 text-xs font-medium text-ink-2 transition-colors hover:bg-surface-muted"
                }
              >
                {entry === "all" ? "All" : INVOICE_STATUS_LABELS[entry]}
              </button>
            ))}
          </div>
        </div>

        {list.error ? (
          <EmptyState
            icon={TriangleAlertIcon}
            title="We couldn't load your invoices"
            description={list.error}
            action={<SecondaryButton onClick={list.refetch}>Try again</SecondaryButton>}
          />
        ) : !list.loading && invoices.length === 0 ? (
          <EmptyState
            icon={FileTextIcon}
            title={hasFilters ? "No invoices match your filters" : "No invoices yet"}
            description={
              hasFilters
                ? "Try a different search term or status."
                : "Invoices appear here once you confirm a sale."
            }
            action={
              hasFilters ? (
                <SecondaryButton
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                    setPage(1);
                  }}
                >
                  Clear filters
                </SecondaryButton>
              ) : (
                <PrimaryButton onClick={() => router.push("/sales/new")}>New sale</PrimaryButton>
              )
            }
          />
        ) : (
          <>
            <InvoicesTable
              invoices={invoices}
              loading={list.loading}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              onAction={handleAction}
            />
            <Pagination page={page} pageSize={15} total={total} onPageChange={setPage} />
          </>
        )}
      </section>

      <InvoicePreviewDialog
        invoice={activeInvoice}
        open={dialog === "preview"}
        onOpenChange={(open) => setDialog(open ? "preview" : null)}
      />

      {activeInvoice && (
        <RecordPaymentDialog
          key={`payment-${dialogKey}`}
          invoice={activeInvoice}
          open={dialog === "payment"}
          onOpenChange={(open) => setDialog(open ? "payment" : null)}
          onSuccess={handleMutationSuccess}
        />
      )}

      <FormDialog
        open={dialog === "cancel"}
        onOpenChange={(open) => setDialog(open ? "cancel" : null)}
        title="Cancel invoice"
        description={
          activeInvoice
            ? `${activeInvoice.number} will be voided and can no longer be paid.`
            : undefined
        }
        className="sm:max-w-[440px]"
        footer={
          <>
            <SecondaryButton onClick={() => setDialog(null)} disabled={cancelling}>
              Keep invoice
            </SecondaryButton>
            <PrimaryButton
              onClick={confirmCancel}
              loading={cancelling}
              className="bg-destructive hover:bg-destructive/90 active:bg-destructive"
            >
              Cancel invoice
            </PrimaryButton>
          </>
        }
      >
        <p className="text-sm text-ink-3">
          Cancelling keeps the record for audit. To correct a mistake, cancel this invoice and issue
          a new one in its place.
        </p>
      </FormDialog>
    </div>
  );
}
