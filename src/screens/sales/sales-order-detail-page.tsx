"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DownloadIcon, EllipsisVerticalIcon, TriangleAlertIcon } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { DetailRow, DetailTabs, TabPanel, TotalRow } from "@/components/common/order-detail";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAwaitingDesign } from "@/hooks/use-awaiting-design";
import { useBranch } from "@/context/branch-context";
import { TopbarAction, TopbarBreadcrumb } from "@/layout/app-topbar";
import { formatCurrency, formatDate } from "@/lib/format";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { OrderPaymentBadge, OrderStatusBadge } from "@/features/sales/components/order-status-badge";
import { ordersService } from "@/features/sales/orders.service";
import {
  getOrderBalance,
  getOrderPaymentStatus,
} from "@/features/sales/order-types";

const TABS = [
  { id: "overview", label: "Order Items" },
  { id: "sent", label: "Sent Goods" },
  { id: "invoice", label: "Invoice" },
  { id: "payments", label: "Payments" },
  { id: "returns", label: "Returns" },
  { id: "activity", label: "Activity" },
] as const;

type TabId = (typeof TABS)[number]["id"];


interface SalesOrderDetailPageProps {
  orderId: string;
  initialTab?: string;
}

export default function SalesOrderDetailPage({
  orderId,
  initialTab,
}: SalesOrderDetailPageProps) {
  const router = useRouter();
  const { branches } = useBranch();
  const awaitingDesign = useAwaitingDesign();

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
            <OrderStatusBadge status={order.status} />
            <OrderPaymentBadge status={payment} />
          </div>
          <dl className="mt-4 grid gap-x-10 gap-y-2 text-sm sm:grid-cols-2">
            <DetailRow label="Customer" value={order.customerName} />
            <DetailRow label="Source PO" value={order.sourcePurchaseId ?? "--"} />
            <DetailRow label="Order Date" value={formatDate(order.orderDate)} />
            <DetailRow label="Total" value={formatCurrency(order.total)} />
            <DetailRow label="Due Date" value={formatDate(order.dueDate)} />
            <DetailRow label="Branch" value={branchName} />
          </dl>
        </div>

        <button
          type="button"
          className="flex h-8 shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted"
          >
          <DownloadIcon className="size-4" />
          Export
        </button>
      </section>

      <DetailTabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === "overview" && (
        <div className="flex flex-col gap-6">
          <section className="min-w-0 rounded-xl bg-surface p-5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="bg-surface-muted text-left text-xs font-semibold text-ink-1">
                    <th scope="col" className="rounded-l-lg px-4 py-3">Product</th>
                    <th scope="col" className="px-4 py-3">Variant</th>
                    <th scope="col" className="px-4 py-3">Qty</th>
                    <th scope="col" className="px-4 py-3">Unit Cost</th>
                    <th scope="col" className="px-4 py-3">Total</th>
                    <th scope="col" className="px-4 py-3">Date</th>
                    <th scope="col" className="rounded-r-lg px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lines.map((line) => (
                    <tr key={line.productId} className="border-b border-border/50 text-ink-2">
                      <td className="px-4 py-3 text-ink-1">{line.productName}</td>
                      <td className="px-4 py-3">{line.variant}</td>
                      <td className="px-4 py-3">{line.quantity}</td>
                      <td className="px-4 py-3">{formatCurrency(line.unitCost)}</td>
                      <td className="px-4 py-3">{formatCurrency(line.unitCost * line.quantity)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{formatDate(order.orderDate)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          aria-label={`Actions for ${line.productName}`}
                          onClick={() => awaitingDesign("Line item actions")}
                          className="rounded-md px-2 py-1 text-ink-3 transition-colors hover:bg-surface-muted"
                        >
                          <EllipsisVerticalIcon className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-xl bg-surface p-5">
            <h2 className="text-base font-semibold text-ink-1">Quick Links</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <PrimaryButton onClick={() => awaitingDesign("Accepting a sales order")}>
                Accept Order
              </PrimaryButton>
              <SecondaryButton onClick={() => awaitingDesign("Proposing changes to a sales order")}>
                Propose Changes
              </SecondaryButton>
              <SecondaryButton onClick={() => awaitingDesign("Rejecting a sales order")}>
                Reject Order
              </SecondaryButton>
            </div>
          </section>
        </div>
      )}

      {tab === "sent" && (
        <TabPanel
          title="Sent Goods"
          description="What has been dispatched to the customer so far."
        >
          {order.lines.every((line) => line.sent === 0) ? (
            <EmptyState
              title="Nothing sent yet"
              description="Dispatched items and their batches will be listed here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="bg-surface-muted text-left text-xs font-semibold text-ink-1">
                    <th scope="col" className="rounded-l-lg px-4 py-3">Product</th>
                    <th scope="col" className="px-4 py-3">Variant</th>
                    <th scope="col" className="px-4 py-3">Ordered</th>
                    <th scope="col" className="px-4 py-3">Sent</th>
                    <th scope="col" className="px-4 py-3">Unit</th>
                    <th scope="col" className="px-4 py-3">Batch</th>
                    <th scope="col" className="rounded-r-lg px-4 py-3">Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {order.lines.map((line) => (
                    <tr key={line.productId} className="border-b border-border/50 text-ink-2">
                      <td className="px-4 py-3 text-ink-1">{line.productName}</td>
                      <td className="px-4 py-3">{line.variant}</td>
                      <td className="px-4 py-3">{line.quantity}</td>
                      <td className="px-4 py-3">{line.sent}</td>
                      <td className="px-4 py-3">{line.unit}</td>
                      <td className="px-4 py-3">{line.batchNumber ?? "--"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {line.expiryDate ? formatDate(line.expiryDate) : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabPanel>
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
              onClick={() => awaitingDesign("Recording a payment on a sales order")}
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

      {tab === "activity" && (
        <TabPanel title="Activity" description="Everything that has happened on this order.">
          <EmptyState
            title="No activity recorded"
            description="Status changes, dispatches and payments will appear here."
          />
        </TabPanel>
      )}
    </div>
  );
}
