"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ClockIcon,
  DownloadIcon,
  PlusIcon,
  SearchIcon,
  ShoppingCartIcon,
  TriangleAlertIcon,
  WalletIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { FormDialog } from "@/components/common/form-dialog";
import { StatCard, StatCardSkeleton } from "@/components/common/stat-card";
import { Pagination } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { BranchSelector } from "@/layout/branch-selector";
import { TopbarAction } from "@/layout/app-topbar";
import { formatCurrencyCompact, formatNumber } from "@/lib/format";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import type { SortDirection } from "@/types/shared";
import { CreatePurchaseOrderDialog } from "@/features/purchasing/components/create-purchase-order-dialog";
import { PurchaseOrdersTable } from "@/features/purchasing/components/purchase-orders-table";
import { ReceiveProductsDialog } from "@/features/purchasing/components/receive-products-dialog";
import { RecordPaymentDialog } from "@/features/purchasing/components/record-payment-dialog";
import { RecordSupplierInvoiceDialog } from "@/features/purchasing/components/record-supplier-invoice-dialog";
import { ReturnProductsDialog } from "@/features/purchasing/components/return-products-dialog";
import { purchasingService } from "@/features/purchasing/purchasing.service";
import {
  PURCHASE_STATUS_LABELS,
  type PurchaseAction,
  type PurchaseOrder,
  type PurchaseOrderStatus,
} from "@/features/purchasing/types";

const SCOPES: { value: PurchaseOrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending_approval", label: PURCHASE_STATUS_LABELS.pending_approval },
  { value: "partially_received", label: PURCHASE_STATUS_LABELS.partially_received },
  { value: "received", label: PURCHASE_STATUS_LABELS.received },
  { value: "completed", label: PURCHASE_STATUS_LABELS.completed },
  { value: "cancelled", label: PURCHASE_STATUS_LABELS.cancelled },
];

type DialogKind = "receive" | "invoice" | "return" | "payment" | "cancel" | null;

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const { activeBranch } = useBranch();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [status, setStatus] = useState<PurchaseOrderStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [activeOrder, setActiveOrder] = useState<PurchaseOrder | null>(null);
  const [dialog, setDialog] = useState<DialogKind>(null);
  const [dialogKey, setDialogKey] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
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

  const {
    data: resource,
    loading,
    error,
    refetch,
  } = useAsyncResource(
    JSON.stringify(params),
    () =>
      Promise.all([
        purchasingService.listOrders(params),
        purchasingService.getSummary({ branchId: activeBranch.id }),
      ]).then(([list, summary]) => ({ list, summary })),
    "We couldn't load your purchase orders. Please try again.",
  );

  const orders = resource?.list.data ?? [];
  const total = resource?.list.total ?? 0;
  const summary = resource?.summary;
  const hasFilters = Boolean(debouncedSearch) || status !== "all";
  const activeScope = SCOPES.find((scope) => scope.value === status) ?? SCOPES[0];

  function handleSortChange(column: string) {
    setPage(1);
    if (sortBy === column) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  }

  function handleAction(action: PurchaseAction, order: PurchaseOrder) {
    setActiveOrder(order);
    setDialogKey((key) => key + 1);

    if (action === "view") {
      router.push(`/purchasing/orders/${order.id}`);
      return;
    }

    setDialog(
      action === "receive"
        ? "receive"
        : action === "record_invoice"
          ? "invoice"
          : action === "return"
            ? "return"
            : action === "record_payment"
              ? "payment"
              : "cancel",
    );
  }

  async function confirmCancel() {
    if (!activeOrder) return;
    setCancelling(true);
    try {
      await purchasingService.cancelOrder(activeOrder.id);
      toast.add({
        type: "success",
        title: "Order cancelled",
        description: `${activeOrder.purchaseId} has been cancelled.`,
      });
      setDialog(null);
      refetch();
    } catch {
      toast.add({ type: "error", title: "Couldn't cancel order", description: "Please try again." });
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <TopbarAction>
        <PrimaryButton
          onClick={() => setCreateOpen(true)}
          leftIcon={<PlusIcon className="size-5" />}
          className="h-12 px-6 text-base"
        >
          <span className="hidden sm:inline">Add Purchase Order</span>
          <span className="sm:hidden">Add</span>
        </PrimaryButton>
      </TopbarAction>

      <section className="flex flex-col gap-4 rounded-xl bg-surface p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-ink-1">Purchase Order</h1>
          <p className="mt-2 text-base text-ink-1">
            Track and manage your business purchases, suppliers, and incoming stock.
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
        {loading || !summary ? (
          Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
        ) : (
          <>
            <StatCard
              icon={ShoppingCartIcon}
              label="Total Orders"
              value={formatCurrencyCompact(summary.totalOrders)}
              description="This month"
              delta={summary.totalOrdersDelta}
            />
            <StatCard
              icon={ClockIcon}
              label="Pending Orders"
              value={formatNumber(summary.pendingOrders)}
              description="Awaiting approval"
              delta={summary.pendingOrdersDelta}
            />
            <StatCard
              icon={CheckCircle2Icon}
              label="Completed"
              value={formatNumber(summary.completedOrders)}
              description="This month"
              delta={summary.completedOrdersDelta}
            />
            <StatCard
              icon={WalletIcon}
              label="Outstanding Payments"
              value={formatCurrencyCompact(summary.outstandingPayments)}
              description="Amount yet to be paid"
              delta={summary.outstandingPaymentsDelta}
            />
          </>
        )}
      </section>

      <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex h-[42px] w-full items-center gap-2 rounded-lg border border-border px-4 py-2 sm:max-w-[560px]">
            <SearchIcon className="size-5 shrink-0 text-ink-4" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search in Purchase Orders"
              aria-label="Search purchase orders"
              className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
            />
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-8 items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-ink-2 transition-colors hover:bg-surface-muted">
                {activeScope.label}
                <ChevronDownIcon className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {SCOPES.map((scope) => (
                  <DropdownMenuItem
                    key={scope.value}
                    onClick={() => {
                      setStatus(scope.value);
                      setPage(1);
                    }}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        status === scope.value ? "bg-primary" : "bg-transparent",
                      )}
                    />
                    {scope.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              type="button"
              className="flex h-8 items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted"
            >
              Filter
              <ChevronDownIcon className="size-4" />
            </button>
          </div>
        </div>

        {error ? (
          <EmptyState
            icon={TriangleAlertIcon}
            title="We couldn't load your purchase orders"
            description={error}
            action={<SecondaryButton onClick={refetch}>Try again</SecondaryButton>}
          />
        ) : !loading && orders.length === 0 ? (
          <EmptyState
            icon={ShoppingCartIcon}
            title={hasFilters ? "No orders match your filters" : "No purchase orders yet"}
            description={
              hasFilters
                ? "Try a different search term or status."
                : "Raise a purchase order to restock from a supplier."
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
                <PrimaryButton onClick={() => setCreateOpen(true)}>
                  Add Purchase Order
                </PrimaryButton>
              )
            }
          />
        ) : (
          <>
            <PurchaseOrdersTable
              orders={orders}
              loading={loading}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              onAction={handleAction}
            />
            <Pagination page={page} pageSize={15} total={total} onPageChange={setPage} />
          </>
        )}
      </section>

      {activeOrder && (
        <>
          <ReceiveProductsDialog
            key={`receive-${dialogKey}`}
            order={activeOrder}
            open={dialog === "receive"}
            onOpenChange={(open) => setDialog(open ? "receive" : null)}
            onSuccess={refetch}
          />
          <RecordSupplierInvoiceDialog
            key={`invoice-${dialogKey}`}
            order={activeOrder}
            open={dialog === "invoice"}
            onOpenChange={(open) => setDialog(open ? "invoice" : null)}
            onSuccess={refetch}
          />
          <ReturnProductsDialog
            key={`return-${dialogKey}`}
            order={activeOrder}
            open={dialog === "return"}
            onOpenChange={(open) => setDialog(open ? "return" : null)}
            onSuccess={refetch}
          />
          <RecordPaymentDialog
            key={`payment-${dialogKey}`}
            order={activeOrder}
            open={dialog === "payment"}
            onOpenChange={(open) => setDialog(open ? "payment" : null)}
            onSuccess={refetch}
          />
        </>
      )}

      <FormDialog
        open={dialog === "cancel"}
        onOpenChange={(open) => setDialog(open ? "cancel" : null)}
        title="Cancel order"
        description={
          activeOrder ? `${activeOrder.purchaseId} will be marked as cancelled.` : undefined
        }
        className="sm:max-w-[440px]"
        footer={
          <>
            <SecondaryButton onClick={() => setDialog(null)} disabled={cancelling}>
              Keep order
            </SecondaryButton>
            <PrimaryButton
              onClick={confirmCancel}
              loading={cancelling}
              className="bg-destructive hover:bg-destructive/90 active:bg-destructive"
            >
              Cancel order
            </PrimaryButton>
          </>
        }
      >
        <p className="text-sm text-ink-3">
          Cancelling keeps the record for audit. Any payment already made will show as refunded.
        </p>
      </FormDialog>

      <CreatePurchaseOrderDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
