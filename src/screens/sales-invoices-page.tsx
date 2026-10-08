"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadIcon,
  FileTextIcon,
  HourglassIcon,
  PlusIcon,
  SearchIcon,
  TriangleAlertIcon,
  WalletIcon,
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
import { formatCurrencyCompact, formatNumber } from "@/lib/format";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { SortDirection } from "@/types/shared";
import { InvoicePreviewDialog } from "@/features/sales/components/invoice-preview-dialog";
import type { InvoiceAction } from "@/features/sales/components/invoice-row-actions";
import { InvoicesTable } from "@/features/sales/components/invoices-table";
import { salesService } from "@/features/sales/sales.service";
import {
  DEFAULT_INVOICE_FILTERS,
  InvoiceFilters,
  type InvoiceFilterState,
} from "@/features/sales/components/invoice-filters";
import type { Invoice } from "@/features/sales/types";
import { useInvoiceList, useInvoiceSummary } from "@/features/sales/use-sales";

export default function SalesInvoicesPage() {
  const router = useRouter();
  const { activeBranch } = useBranch();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [filters, setFilters] = useState<InvoiceFilterState>(DEFAULT_INVOICE_FILTERS);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [dialog, setDialog] = useState<"preview" | "archive" | null>(null);
  const [archiving, setArchiving] = useState(false);

  const params = useMemo(
    () => ({
      page,
      pageSize: 15,
      search: debouncedSearch || undefined,
      branchId: activeBranch.id,
      status: filters.status,
      partyType: filters.partyType,
      issuedFrom: filters.issuedFrom || undefined,
      dueBefore: filters.dueBefore || undefined,
      sortBy,
      sortDirection,
    }),
    [page, debouncedSearch, activeBranch.id, filters, sortBy, sortDirection],
  );

  const list = useInvoiceList(params);
  const summary = useInvoiceSummary(activeBranch.id);

  const invoices = list.data?.data ?? [];
  const total = list.data?.total ?? 0;
  const hasFilters = Boolean(debouncedSearch) || filters !== DEFAULT_INVOICE_FILTERS;

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

    if (action === "remind") {
      try {
        await salesService.sendPaymentReminder(invoice.id);
        toast.add({
          type: "success",
          title: "Reminder sent",
          description: `${invoice.customerName} has been reminded about ${invoice.number}.`,
        });
      } catch {
        toast.add({ type: "error", title: "Couldn't send reminder", description: "Please try again." });
      }
      return;
    }

    setDialog(action === "view" ? "preview" : "archive");
  }

  async function confirmArchive() {
    if (!activeInvoice) return;
    setArchiving(true);
    try {
      await salesService.archiveInvoice(activeInvoice.id);
      toast.add({
        type: "success",
        title: "Invoice archived",
        description: `${activeInvoice.number} has been archived. Issue a corrected invoice in its place.`,
      });
      setDialog(null);
      list.refetch();
      summary.refetch();
    } catch {
      toast.add({ type: "error", title: "Couldn't archive invoice", description: "Please try again." });
    } finally {
      setArchiving(false);
    }
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
              label="Invoiced"
              value={formatCurrencyCompact(summary.data.invoiced)}
              description={`${formatNumber(summary.data.invoicedCount)} invoices`}
              delta={summary.data.invoicedDelta}
            />
            <StatCard
              icon={WalletIcon}
              label="Paid"
              value={formatCurrencyCompact(summary.data.paid)}
              description="Settled by customers"
              delta={summary.data.paidDelta}
            />
            <StatCard
              icon={HourglassIcon}
              label="Outstanding"
              value={formatCurrencyCompact(summary.data.outstanding)}
              description="Still to be collected"
              delta={summary.data.outstandingDelta}
            />
            <StatCard
              icon={TriangleAlertIcon}
              label="Overdue"
              value={formatCurrencyCompact(summary.data.overdue)}
              description={`${formatNumber(summary.data.overdueCount)} invoices`}
              delta={summary.data.overdueDelta}
              valueClassName="text-destructive"
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

          <InvoiceFilters
            value={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(1);
            }}
          />
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
                    setFilters(DEFAULT_INVOICE_FILTERS);
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

      <FormDialog
        open={dialog === "archive"}
        onOpenChange={(open) => setDialog(open ? "archive" : null)}
        title="Archive invoice"
        description={
          activeInvoice
            ? `${activeInvoice.number} will be moved out of the active list.`
            : undefined
        }
        className="sm:max-w-[440px]"
        footer={
          <>
            <SecondaryButton onClick={() => setDialog(null)} disabled={archiving}>
              Keep invoice
            </SecondaryButton>
            <PrimaryButton
              onClick={confirmArchive}
              loading={archiving}
              className="bg-destructive hover:bg-destructive/90 active:bg-destructive"
            >
              Archive invoice
            </PrimaryButton>
          </>
        }
      >
        <p className="text-sm text-ink-3">
          Archiving keeps the record for audit. To correct a mistake, archive this invoice and issue
          a new one in its place.
        </p>
      </FormDialog>
    </div>
  );
}
