"use client";

import { OrderDetailsDialog, type OrderDetailTab } from "@/features/sales/components/order-details-dialog";
import { OrderFilters, EMPTY_ORDER_FILTERS, type OrderFiltersValue } from "@/features/sales/components/order-filters";
import { SalesOrderIcon, type SalesIconName } from "@/features/sales/components/sales-order-icon";
import { exportCsv } from "@/lib/utils";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadIcon,
  PlusIcon,
  SearchIcon,
  ShoppingCartIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { FormDialog } from "@/components/common/form-dialog";
import { StatCardSkeleton } from "@/components/common/stat-card";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { BranchSelector } from "@/layout/branch-selector";
import { TopbarAction } from "@/layout/app-topbar";
import { formatCurrencyCompact, formatNumber } from "@/lib/format";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { SortDirection } from "@/types/shared";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { OrdersTable } from "@/features/sales/components/orders-table";
import { ordersService } from "@/features/sales/orders.service";
import {
  type OrderAction,
  type SalesOrder,
} from "@/features/sales/order-types";

export default function SalesOrdersPage() {
  const router = useRouter();
  const { activeBranch } = useBranch();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [filters, setFilters] = useState<OrderFiltersValue>(EMPTY_ORDER_FILTERS);
  const [detail, setDetail] = useState<{ id: string; tab: OrderDetailTab; payment?: boolean } | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [activeOrder, setActiveOrder] = useState<SalesOrder | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const params = useMemo(
    () => ({
      page,
      pageSize: 15,
      search: debouncedSearch || undefined,
      branchId: activeBranch.id,
      ...filters,
      sortBy,
      sortDirection,
    }),
    [page, debouncedSearch, activeBranch.id, filters, sortBy, sortDirection],
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
        ordersService.listOrders(params),
        ordersService.getSummary({ branchId: activeBranch.id }),
      ]).then(([list, summary]) => ({ list, summary })),
    "We couldn't load your sales orders. Please try again.",
  );

  const orders = resource?.list.data ?? [];
  const total = resource?.list.total ?? 0;
  const summary = resource?.summary;
  const hasFilters = Boolean(debouncedSearch) || filters.status !== "all" || filters.payment !== "all";

  function handleSortChange(column: string) {
    setPage(1);
    if (sortBy === column) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  }

  async function handleAction(action: OrderAction, order: SalesOrder) {
    setActiveOrder(order);

    if (action === "cancel") {
      setCancelOpen(true);
      return;
    }

    if (action === "view") {
      setDetail({ id: order.id, tab: "overview" });
      return;
    }

    if (action === "view_returns") {
      setDetail({ id: order.id, tab: "returns" });
      return;
    }

    if (action === "record_payment") {
      setDetail({ id: order.id, tab: "payments", payment: true });
      return;
    }

    if (action === "view_invoice" || action === "create_invoice") {
      if (action === "create_invoice") {
        try { await ordersService.createInvoice(order.id); refetch(); }
        catch { toast.add({ type: "error", title: "Couldn't create invoice" }); return; }
      }
      setDetail({ id: order.id, tab: "invoice" });
      return;
    }

    if (action === "view_receipt") {
      setDetail({ id: order.id, tab: "payments" });
      return;
    }

    if (action === "send_goods") {
      try {
        await ordersService.markGoodsSent(order.id);
        toast.add({
          type: "success",
          title: "Goods sent",
          description: `${order.orderId} is now marked as fulfilled.`,
        });
        refetch();
      } catch {
        toast.add({ type: "error", title: "Couldn't update order", description: "Please try again." });
      }
      return;
    }

    setDetail({ id: order.id, tab: "overview" });
  }

  async function confirmCancel() {
    if (!activeOrder) return;
    setCancelling(true);
    try {
      await ordersService.cancelOrder(activeOrder.id);
      toast.add({
        type: "success",
        title: "Order cancelled",
        description: `${activeOrder.orderId} has been cancelled.`,
      });
      setCancelOpen(false);
      refetch();
    } catch {
      toast.add({ type: "error", title: "Couldn't cancel order", description: "Please try again." });
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="sales-orders-page flex min-w-0 flex-col gap-6">
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
          <h1 className="text-xl font-semibold text-ink-1">Sales Orders</h1>
          <p className="mt-2 text-base text-ink-1">
            Every sale in your organization, including cancelled and pending ones.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <BranchSelector />
          <button
            type="button"
            onClick={async () => {
              try { const result = await ordersService.listOrders({ ...params, page: 1, pageSize: total || 1 }); exportCsv(result.data.map(order => [order.orderId, order.customerName, order.orderDate, order.dueDate, order.total, order.amountPaid, order.status]), ["Order ID", "Customer", "Order date", "Due date", "Total", "Paid", "Status"].map((header, index) => ({ header, value: (row: (string | number)[]) => row[index] })), "sales-orders.csv"); }
              catch { toast.add({ type: "error", title: "Couldn't export orders" }); }
            }}
            className="flex h-8 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted"
          >
            <DownloadIcon className="size-4" />
            Export
          </button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-[repeat(5,minmax(180px,1fr))] lg:overflow-x-auto">
        {loading || !summary ? (
          Array.from({ length: 5 }).map((_, index) => <StatCardSkeleton key={index} />)
        ) : (
          <>
            {([
              ["sales", "Total Sales", formatCurrencyCompact(summary.totalSales), `Generated from ${formatNumber(summary.invoiceCount)} Invoices`],
              ["collected", "Collected", formatCurrencyCompact(summary.collected), ""],
              ["outstanding", "Outstanding", formatCurrencyCompact(summary.outstanding), ""],
              ["profit", "Gross profit", formatCurrencyCompact(summary.grossProfit), ""],
              ["invoices", "Invoices", formatNumber(summary.invoices), ""],
            ] as [SalesIconName, string, string, string][]).map(([icon, label, value, description]) => <div key={label} className="@container h-[130px] min-w-0 rounded-lg bg-surface p-5"><div className="flex items-center gap-1 text-sm tracking-[0.14px] text-ink-3"><SalesOrderIcon name={icon} className="size-5 shrink-0 text-primary" />{label}</div><p className="mt-4 whitespace-nowrap text-[clamp(17px,14.3cqw,24px)] font-semibold leading-7 tracking-[-0.4px]">{value}</p>{description && <p className="mt-2 text-xs tracking-[0.18px]">{description}</p>}</div>)}
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
              aria-label="Search sales orders"
              className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <OrderFilters value={filters} onChange={next => { setFilters(next); setPage(1); }} />
          </div>
        </div>

        {error ? (
          <EmptyState
            icon={TriangleAlertIcon}
            title="We couldn't load your sales orders"
            description={error}
            action={<SecondaryButton onClick={refetch}>Try again</SecondaryButton>}
          />
        ) : !loading && orders.length === 0 ? (
          <EmptyState
            icon={ShoppingCartIcon}
            title={hasFilters ? "No orders match your filters" : "No sales orders yet"}
            description={
              hasFilters
                ? "Try a different search term or status."
                : "Orders appear here once customers place them."
            }
            action={
              hasFilters ? (
                <SecondaryButton
                  onClick={() => {
                    setSearch("");
                    setFilters(EMPTY_ORDER_FILTERS);
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
            <OrdersTable
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

      {detail && <OrderDetailsDialog key={`${detail.id}-${detail.tab}-${detail.payment}`} orderId={detail.id} initialTab={detail.tab} initialAction={detail.payment ? "payment" : undefined} onClose={() => setDetail(null)} onSuccess={refetch} />}
      <FormDialog
        className="sales-action-dialog"
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        title="Cancel order"
        description={
          activeOrder ? `${activeOrder.orderId} will be marked as cancelled.` : undefined
        }
        footer={
          <>
            <SecondaryButton onClick={() => setCancelOpen(false)} disabled={cancelling}>
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
          Cancelling keeps the record for audit. Any payment already taken will show as refunded.
        </p>
      </FormDialog>
    </div>
  );
}
