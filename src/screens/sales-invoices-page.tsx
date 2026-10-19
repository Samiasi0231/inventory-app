"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarDaysIcon,
  XIcon,
  FileTextIcon,
  HandCoinsIcon,
  ListFilterIcon,
  ReceiptTextIcon,
  PlusIcon,
  SearchIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { FormDialog } from "@/components/common/form-dialog";
import { StatCard, StatCardSkeleton } from "@/components/common/stat-card";
import { Pagination } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { BranchSelector } from "@/layout/branch-selector";
import { TopbarAction } from "@/layout/app-topbar";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { SortDirection } from "@/types/shared";
import { InvoicePreviewDialog } from "@/features/sales/components/invoice-preview-dialog";
import type { InvoiceAction } from "@/features/sales/components/invoice-row-actions";
import { InvoicesTable } from "@/features/sales/components/invoices-table";
import { RecordPaymentDialog } from "@/features/sales/components/record-payment-dialog";
import { salesService } from "@/features/sales/sales.service";
import type { Invoice, InvoiceStatus } from "@/features/sales/types";
import { useInvoiceList, useInvoiceSummary } from "@/features/sales/use-sales";

export default function SalesInvoicesPage() {
  const router = useRouter();
  const { activeBranch } = useBranch();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [status, setStatus] = useState<InvoiceStatus | "all">("all");
  const [draftStatus, setDraftStatus] = useState<InvoiceStatus | "all">("all");
  const [invoiceType, setInvoiceType] = useState<"all" | "customer_supplier">("all");
  const [dateIssued, setDateIssued] = useState("");
  const [dateDue, setDateDue] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
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

    if (action === "remind") {
      toast.add({ type: "success", title: "Payment reminder queued", description: invoice.number });
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
              icon={ReceiptTextIcon}
              label="Invoiced"
              value={formatCurrencyCompact(650_400_000)}
              description="31 Invoices"
            />
            <StatCard
              icon={HandCoinsIcon}
              label="Paid"
              value={formatCurrencyCompact(840_600_000)}
              description=""
            />
            <StatCard
              icon={HandCoinsIcon}
              label="Outstanding"
              value={formatCurrencyCompact(190_200_000)}
              description=""
            />
            <StatCard
              icon={FileTextIcon}
              label="Overdue"
              value={formatCurrency(500)}
              description="4 invoices"
              valueClassName="text-danger-fg"
            />
          </>
        )}
      </section>

      <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex h-[42px] w-full items-center gap-2 rounded-lg border border-border px-4 py-2 lg:max-w-[633px]">
            <SearchIcon className="size-5 shrink-0 text-ink-4" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search in Items"
              aria-label="Search invoices"
              className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
            />
          </div>

          <Popover
            open={filterOpen}
            onOpenChange={(open) => {
              if (open) setDraftStatus(status);
              setFilterOpen(open);
            }}
          >
            <PopoverTrigger className="flex h-8 items-center gap-2 rounded-lg border border-border bg-white px-3 text-sm font-semibold text-primary">
              <ListFilterIcon className="size-4" /> Filter
              <ChevronDownIcon className={`size-4 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-[min(420px,calc(100vw-1rem))] gap-0 overflow-hidden rounded-xl border border-border bg-white p-0 shadow-lg"
            >
              <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-border px-4 sm:h-16 sm:px-5">
                <h2 className="text-xl font-semibold text-ink-1">Filter</h2>
                <button type="button" onClick={() => setFilterOpen(false)} aria-label="Close filter" className="flex size-9 items-center justify-center rounded-lg hover:bg-surface-muted">
                  <XIcon className="size-5" />
                </button>
              </div>

              <div className="max-h-[246px] overflow-y-auto p-4 sm:max-h-[450px] sm:p-5">
                <p className="mb-5 text-sm text-ink-2">Filter invoice by...</p>
                <FilterChoice
                  label="Status"
                  value={draftStatus}
                  options={[["paid", "Paid"], ["partially_paid", "Partially paid"], ["pending", "Pending"]]}
                  onChange={(value) => setDraftStatus(value as InvoiceStatus)}
                />
                <FilterChoice
                  label="Type"
                  value={invoiceType}
                  options={[["all", "Customer or Supplier"], ["customer_supplier", "Customer or Supplier"]]}
                  onChange={(value) => setInvoiceType(value as typeof invoiceType)}
                  className="mt-7"
                />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <DateFilter label="Date Issued" value={dateIssued} onChange={setDateIssued} />
                  <DateFilter label="Date Due" value={dateDue} onChange={setDateDue} />
                </div>
              </div>

              <div className="flex min-h-[60px] shrink-0 items-center justify-end border-t border-border px-4 py-2 sm:min-h-16 sm:px-5">
                <PrimaryButton
                  className="h-12 min-w-[78px]"
                  onClick={() => {
                    setStatus(draftStatus);
                    setPage(1);
                    setFilterOpen(false);
                  }}
                >
                  Add
                </PrimaryButton>
              </div>
            </PopoverContent>
          </Popover>
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
        title="Delete Invoice"
        footer={
          <>
            <SecondaryButton onClick={() => setDialog(null)} disabled={cancelling}>
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={confirmCancel}
              loading={cancelling}
              className="bg-destructive hover:bg-destructive/90 active:bg-destructive"
            >
              Delete Invoice
            </PrimaryButton>
          </>
        }
      >
        <p className="py-8 text-center text-2xl font-semibold text-ink-2">
          Are you sure you want to delete “{activeInvoice?.number}”
        </p>
      </FormDialog>
    </div>
  );
}

function FilterChoice({ label, value, options, onChange, className = "" }: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="mb-3 text-sm font-medium text-ink-1">{label}</legend>
      <div className="overflow-hidden rounded-lg border border-border bg-white">
        {options.map(([optionValue, optionLabel], index) => (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={`flex h-[50px] w-full items-center justify-between border-b border-border px-4 text-left text-base last:border-b-0 ${value === optionValue ? "bg-surface-muted text-ink-2" : "text-ink-3 hover:bg-surface-muted/60"}`}
          >
            {optionLabel}
            {index === 0 && <ChevronUpIcon className="size-5 text-ink-3" />}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function DateFilter({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="min-w-0 text-sm font-medium text-ink-1">
      {label}
      <span className="relative mt-3 block">
        <input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="h-[50px] w-full rounded-lg border border-border bg-white px-4 pr-12 text-base text-ink-3 outline-none focus:border-primary focus:ring-3 focus:ring-primary/15 [&::-webkit-calendar-picker-indicator]:opacity-0" />
        <CalendarDaysIcon className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 bg-white text-ink-4" />
      </span>
    </label>
  );
}
