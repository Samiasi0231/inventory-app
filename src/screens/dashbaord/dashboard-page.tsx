"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DownloadIcon, FolderSearchIcon, TrendingUpIcon, TriangleAlertIcon } from "lucide-react";
import { SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { StatCard, StatCardSkeleton } from "@/components/common/stat-card";
import { useBranch } from "@/context/branch-context";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { BranchSelector } from "@/layout/branch-selector";
import { TopbarAction } from "@/layout/app-topbar";
import { formatCurrencyCompact } from "@/lib/format";
import { AddProductDialog } from "@/features/inventory/components/add-product/add-product-dialog";
import { dashboardService } from "@/lib/dashboard.service";
import { PeriodSelector } from "@/features/dashboard/period-selector";
import { QuickAddMenu } from "@/features/dashboard/quick-add-menu";
import { SalesOverviewChart } from "@/features/dashboard/sales-overview-chart";
import {
  RecentActivityPanel,
  SmartAlertsPanel,
  TopProductsPanel,
} from "@/features/dashboard/dashboard-panel";
import { RecentTransactions } from "@/features/dashboard/recent-transactions";
import type { DashboardPeriod, DashboardTransaction } from "@/types/dashboard";

const NEW_SALE_ROUTE = "/sales/new";
const NEW_PURCHASE_ORDER_ROUTE = "/purchasing/orders/new";

function csvCell(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function downloadTransactionsCsv(transactions: DashboardTransaction[], branchName: string) {
  const header = ["Reference", "Type", "Amount", "Status", "Branch", "Date"];
  const rows = transactions.map((transaction) => [
    transaction.reference,
    transaction.type,
    transaction.amount,
    transaction.status,
    transaction.branch,
    transaction.occurredAt,
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `dashboard-transactions-${branchName.toLowerCase().replace(/\s+/g, "-")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function DeltaBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={
        positive
          ? "inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700"
          : "inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-destructive"
      }
    >
      <TrendingUpIcon className={positive ? "size-3" : "size-3 -scale-y-100"} />
      {positive ? "+" : ""}
      {value}%
    </span>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { activeBranch } = useBranch();

  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const [addProductOpen, setAddProductOpen] = useState(false);

  const { data, loading, error, refetch } = useAsyncResource(
    `${activeBranch.id}:${period}`,
    () => dashboardService.getDashboard({ branchId: activeBranch.id, period }),
    "We couldn't load your dashboard. Please try again.",
  );

  const overview = data?.overview;
  const showSkeleton = loading || !data;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <TopbarAction>
        <QuickAddMenu
          onAddProduct={() => setAddProductOpen(true)}
          onAddSalesOrder={() => router.push(NEW_SALE_ROUTE)}
          onAddPurchaseOrder={() => router.push(NEW_PURCHASE_ORDER_ROUTE)}
        />
      </TopbarAction>

      <section className="flex flex-col gap-4 rounded-xl bg-surface p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-ink-1">Overview</h1>
          <p className="mt-2 text-base text-ink-1">Here&apos;s what&apos;s happening across your business.</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <BranchSelector />
          <PeriodSelector value={period} onChange={setPeriod} />
          <button
            type="button"
            disabled={!data}
            onClick={() => data && downloadTransactionsCsv(data.transactions.data, activeBranch.name)}
            className="flex h-8 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted disabled:pointer-events-none disabled:opacity-50"
          >
            <DownloadIcon className="size-4" />
            Export
          </button>
        </div>
      </section>

      {error ? (
        <section className="rounded-xl bg-surface p-5">
          <EmptyState
            icon={TriangleAlertIcon}
            title="We couldn't load your dashboard"
            description={error}
            action={<SecondaryButton onClick={refetch}>Try again</SecondaryButton>}
          />
        </section>
      ) : (
        <>
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {showSkeleton || !overview ? (
              Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
            ) : (
              <>
                <StatCard
                  icon={FolderSearchIcon}
                  label="Sales"
                  value={formatCurrencyCompact(overview.sales)}
                  description="Total sales made"
                  delta={overview.salesDelta}
                />
                <StatCard
                  icon={FolderSearchIcon}
                  label="Expenses"
                  value={formatCurrencyCompact(overview.expenses)}
                  description="Total money spent"
                  delta={overview.expensesDelta}
                />
                <StatCard
                  icon={FolderSearchIcon}
                  label="Net Profit"
                  value={formatCurrencyCompact(overview.netProfit)}
                  description="After expenses and refunds"
                  delta={overview.netProfitDelta}
                />
                <StatCard
                  icon={FolderSearchIcon}
                  label="Refunds"
                  value={formatCurrencyCompact(overview.refunds)}
                  description="Returned to customers"
                  delta={overview.refundsDelta}
                />
              </>
            )}
          </section>

          <div className="grid min-w-0 gap-6 xl:grid-cols-5">
            <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5 xl:col-span-3">
              <div>
                <h2 className="text-sm text-ink-3">Sales Overview</h2>
                {data && (
                  <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-ink-1">
                    {formatCurrencyCompact(data.salesOverview.total)}
                    <DeltaBadge value={data.salesOverview.delta} />
                  </p>
                )}
              </div>
              {data ? (
                <SalesOverviewChart points={data.salesOverview.points} />
              ) : (
                <div className="h-56 animate-pulse rounded-lg bg-surface-muted" />
              )}
            </section>

            <div className="min-w-0 xl:col-span-2">
              {data ? (
                <SmartAlertsPanel alerts={data.alerts} />
              ) : (
                <div className="h-full min-h-56 animate-pulse rounded-xl bg-surface" />
              )}
            </div>
          </div>

          <div className="grid min-w-0 gap-6 lg:grid-cols-2">
            {data ? (
              <>
                <RecentActivityPanel items={data.activity} />
                <TopProductsPanel products={data.topProducts} />
              </>
            ) : (
              <>
                <div className="h-56 animate-pulse rounded-xl bg-surface" />
                <div className="h-56 animate-pulse rounded-xl bg-surface" />
              </>
            )}
          </div>

          {data ? (
            <RecentTransactions transactions={data.transactions.data} total={data.transactions.total} />
          ) : (
            <div className="h-64 animate-pulse rounded-xl bg-surface" />
          )}
        </>
      )}

      <AddProductDialog open={addProductOpen} onOpenChange={setAddProductOpen} onSuccess={refetch} />
    </div>
  );
}