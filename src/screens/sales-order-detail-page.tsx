"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DownloadIcon, TriangleAlertIcon } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { TopbarAction, TopbarBreadcrumb } from "@/layout/app-topbar";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { cn } from "@/lib/utils";
import { ordersService } from "@/features/sales/orders.service";
import {
  getOrderBalance,
  getOrderPaymentStatus,
  ORDER_PAYMENT_LABELS,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/features/sales/order-types";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "invoice", label: "Invoice" },
  { id: "payments", label: "Payments" },
  { id: "returns", label: "Returns" },
  { id: "receipt", label: "Receipt" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STATUS_VARIANTS: Record<OrderStatus, "success" | "danger" | "warning" | "neutral"> = {
  completed: "success",
  fulfilled: "success",
  confirmed: "success",
  partially_received: "warning",
  pending: "neutral",
  cancelled: "danger",
};

interface SalesOrderDetailPageProps {
  orderId: string;
  /** Lets a row action deep-link straight to the relevant tab. */
  initialTab?: string;
}

export default function SalesOrderDetailPage({
  orderId,
  initialTab,
}: SalesOrderDetailPageProps) {
  const router = useRouter();
  const { branches } = useBranch();
  const toast = useToast();

  const [tab, setTab] = useState<TabId>(
    TABS.some((entry) => entry.id === initialTab) ? (initialTab as TabId) : "overview",
  );

  const {
    data: order,
    loading,
    error,
    refetch,
  } = useAsyncResource(
    orderId,
    () => ordersService.getOrder(orderId),
    "We couldn't load this sales order.",
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-xl bg-surface p-5">
        <EmptyState
          icon={TriangleAlertIcon}
          title="We couldn't load this sales order"
          description={error ?? "It may have been removed."}
          action={
            <div className="flex gap-2">
              <SecondaryButton onClick={refetch}>Try again</SecondaryButton>
              <PrimaryButton onClick={() => router.push("/sales/orders")}>
                Back to orders
              </PrimaryButton>
            </div>
          }
        />
      </div>
    );
  }

  const payment = getOrderPaymentStatus(order);
  const balance = getOrderBalance(order);
  const branchName = branches.find((branch) => branch.id === order.branchId)?.name ?? "—";

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <TopbarBreadcrumb section="Sales Orders" page={`Order #${order.orderId}`} />

      <TopbarAction>
        <PrimaryButton
          onClick={() => router.push("/sales/invoices")}
          className="h-12 px-6 text-base"
        >
          View invoices
        </PrimaryButton>
      </TopbarAction>

      <section className="flex flex-col gap-4 rounded-xl bg-surface p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold text-ink-1">#{order.orderId}</h1>
            <Badge variant={STATUS_VARIANTS[order.status]} dot>
              {ORDER_STATUS_LABELS[order.status]}
            </Badge>
            <Badge variant={payment === "paid" ? "success" : "danger"} dot>
              {ORDER_PAYMENT_LABELS[payment]}
            </Badge>
          </div>
          <p className="mt-2 text-xs text-ink-3">Date Created: {formatDate(order.orderDate)}</p>
        </div>

        <button
          type="button"
          className="flex h-8 shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted"
        >
          <DownloadIcon className="size-4" />
          Export
        </button>
      </section>

      <nav className="flex gap-2 overflow-x-auto rounded-xl bg-surface p-2" aria-label="Order sections">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-current={tab === entry.id ? "page" : undefined}
            onClick={() => setTab(entry.id)}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm transition-colors",
              tab === entry.id
                ? "bg-accent font-semibold text-accent-foreground"
                : "text-ink-2 hover:bg-surface-muted",
            )}
          >
            {entry.label}
          </button>
        ))}
      </nav>

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl bg-surface p-5">
            <h2 className="text-base font-semibold text-ink-1">Order Information</h2>
            <dl className="mt-4 flex flex-col gap-3">
              <DetailRow label="Customer" value={order.customerName} />
              <DetailRow label="Order Date" value={formatDate(order.orderDate)} />
              <DetailRow label="Due Date" value={formatDate(order.dueDate)} />
              <DetailRow label="Branch" value={branchName} />
            </dl>
          </section>

          <section className="rounded-xl bg-surface p-5">
            <h2 className="text-base font-semibold text-ink-1">Payments &amp; Totals</h2>
            <dl className="mt-4 flex flex-col gap-2 rounded-lg bg-surface-muted p-4 text-sm">
              <TotalRow label="Total" value={formatCurrency(order.total)} strong />
            </dl>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <TotalRow label="Amount Paid" value={formatCurrency(order.amountPaid)} />
              <TotalRow label="Balance Due" value={formatCurrency(balance)} />
            </dl>
          </section>
        </div>
      )}

      {tab === "invoice" && (
        <TabPanel
          title="Invoice"
          description="Invoices raised from this order."
          action={
            <PrimaryButton onClick={() => router.push("/sales/invoices")}>
              Go to invoices
            </PrimaryButton>
          }
        >
          <EmptyState
            title="Invoice list"
            description="Invoices for this order are managed on the Invoices screen."
          />
        </TabPanel>
      )}

      {tab === "payments" && (
        <TabPanel
          title="Payments"
          description={`${formatCurrency(order.amountPaid)} collected of ${formatCurrency(order.total)}.`}
          action={
            <PrimaryButton
              disabled={balance <= 0}
              onClick={() =>
                toast.add({
                  type: "info",
                  title: "Record payment",
                  description: "Payments against a sales order are recorded on its invoice.",
                })
              }
            >
              Record payment
            </PrimaryButton>
          }
        >
          {order.amountPaid <= 0 ? (
            <EmptyState title="No payments yet" description="Payments will be listed here." />
          ) : (
            <dl className="flex flex-col gap-3 text-sm">
              <TotalRow label="Amount Paid" value={formatCurrency(order.amountPaid)} />
              <TotalRow label="Balance Due" value={formatCurrency(balance)} />
            </dl>
          )}
        </TabPanel>
      )}

      {tab === "returns" && (
        <TabPanel title="Returns" description="Goods returned against this order.">
          <EmptyState
            title="No returns raised"
            description="Returns against this order will be listed here."
          />
        </TabPanel>
      )}

      {tab === "receipt" && (
        <TabPanel
          title="Receipt"
          description="Receipts issued for this order."
          action={
            <PrimaryButton onClick={() => router.push("/sales/receipts")}>
              Go to receipts
            </PrimaryButton>
          }
        >
          <EmptyState
            title="Receipt list"
            description="Receipts for this order are managed on the Receipts screen."
          />
        </TabPanel>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex items-center gap-2 text-sm text-ink-2">
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
        {label} :
      </dt>
      <dd className="text-right text-sm font-medium text-ink-1">{value}</dd>
    </div>
  );
}

function TotalRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className={strong ? "font-semibold text-ink-1" : "text-ink-3"}>{label}</dt>
      <dd className={strong ? "font-semibold text-ink-1" : "text-ink-1"}>{value}</dd>
    </div>
  );
}

function TabPanel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink-1">{title}</h2>
          <p className="mt-1 text-sm text-ink-3">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
