"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DownloadIcon,
  PencilIcon,
  PlusIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAwaitingDesign } from "@/hooks/use-awaiting-design";
import { useBranch } from "@/context/branch-context";
import { TopbarAction, TopbarBreadcrumb } from "@/layout/app-topbar";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { cn } from "@/lib/utils";
import { ReceiveProductsDialog } from "@/features/purchasing/components/receive-products-dialog";
import { RecordPaymentDialog } from "@/features/purchasing/components/record-payment-dialog";
import { RecordSupplierInvoiceDialog } from "@/features/purchasing/components/record-supplier-invoice-dialog";
import { ReturnProductsDialog } from "@/features/purchasing/components/return-products-dialog";
import { purchasingService } from "@/features/purchasing/purchasing.service";
import {
  getPurchaseBalance,
  getPurchasePaymentStatus,
  PURCHASE_PAYMENT_LABELS,
  PURCHASE_STATUS_LABELS,
  type PurchaseOrderStatus,
} from "@/features/purchasing/types";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "received", label: "Received Goods" },
  { id: "payments", label: "Payments" },
  { id: "returns", label: "Returns" },
  { id: "invoice", label: "Supplier Invoice" },
  { id: "activity", label: "Stock Activity" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STATUS_VARIANTS: Record<PurchaseOrderStatus, "success" | "danger" | "warning" | "neutral"> = {
  completed: "success",
  received: "success",
  partially_received: "warning",
  pending_approval: "neutral",
  cancelled: "danger",
};

export default function PurchaseOrderDetailPage({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { branches } = useBranch();
  const awaitingDesign = useAwaitingDesign();

  const [tab, setTab] = useState<TabId>("overview");
  const [dialog, setDialog] = useState<"receive" | "payment" | "return" | "invoice" | null>(null);
  const [dialogKey, setDialogKey] = useState(0);

  const {
    data: order,
    loading,
    error,
    refetch,
  } = useAsyncResource(
    orderId,
    () => purchasingService.getOrder(orderId),
    "We couldn't load this purchase order.",
  );

  function openDialog(next: typeof dialog) {
    setDialogKey((key) => key + 1);
    setDialog(next);
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-xl bg-surface p-5">
        <EmptyState
          icon={TriangleAlertIcon}
          title="We couldn't load this purchase order"
          description={error ?? "It may have been removed."}
          action={
            <div className="flex gap-2">
              <SecondaryButton onClick={refetch}>Try again</SecondaryButton>
              <PrimaryButton onClick={() => router.push("/purchasing/orders")}>
                Back to orders
              </PrimaryButton>
            </div>
          }
        />
      </div>
    );
  }

  const payment = getPurchasePaymentStatus(order);
  const balance = getPurchaseBalance(order);
  const branchName = branches.find((branch) => branch.id === order.branchId)?.name ?? "—";
  const subtotal = order.lines.reduce((sum, line) => sum + line.ordered * line.unitCost, 0);
  const otherCosts = Math.max(0, order.totalAmount - subtotal);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <TopbarBreadcrumb section="Purchase Orders" page={`Order #${order.purchaseId}`} />

      <TopbarAction>
        <PrimaryButton
          onClick={() => openDialog("receive")}
          leftIcon={<PlusIcon className="size-5" />}
          className="h-12 px-6 text-base"
        >
          <span className="hidden sm:inline">Receive Product</span>
          <span className="sm:hidden">Receive</span>
        </PrimaryButton>
      </TopbarAction>

      <section className="flex flex-col gap-4 rounded-xl bg-surface p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-ink-1">#{order.purchaseId}</h1>
            <Badge variant={STATUS_VARIANTS[order.status]} dot>
              {PURCHASE_STATUS_LABELS[order.status]}
            </Badge>
          </div>
          <p className="mt-2 text-xs text-ink-3">Date Created: {formatDate(order.date)}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted"
          >
            <DownloadIcon className="size-4" />
            Export
          </button>
          <SecondaryButton
            className="h-10"
            leftIcon={<PencilIcon className="size-4" />}
            onClick={() => awaitingDesign("Editing a purchase order")}
          >
            Edit Order
          </SecondaryButton>
        </div>
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
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl bg-surface p-5">
              <h2 className="text-base font-semibold text-ink-1">Order Information</h2>
              <dl className="mt-4 flex flex-col gap-3">
                <DetailRow label="Supplier" value={order.supplierName} />
                <DetailRow label="Expected Delivery Date" value={formatDate(order.date)} />
                <DetailRow label="Branch" value={branchName} />
                <DetailRow label="Created by" value="Inventory Manager" />
              </dl>

              <h3 className="mt-6 text-sm font-semibold text-ink-1">Delivery and Logistics</h3>
              <dl className="mt-3 flex flex-col gap-3">
                <DetailRow label="Delivery Method" value="Supplier Delivery" />
                <DetailRow label="Delivery Cost" value={formatCurrency(0)} />
              </dl>
            </section>

            <section className="rounded-xl bg-surface p-5">
              <h2 className="text-base font-semibold text-ink-1">Payments &amp; Totals</h2>

              <dl className="mt-4 flex flex-col gap-2 rounded-lg bg-surface-muted p-4 text-sm">
                <TotalRow label="Subtotal" value={formatCurrency(subtotal)} />
                <TotalRow label="Discounts" value={formatCurrency(0)} />
                <TotalRow label="Other Costs" value={formatCurrency(otherCosts)} />
                <div className="mt-1 border-t border-border/60 pt-2">
                  <TotalRow label="Total" value={formatCurrency(order.totalAmount)} strong />
                </div>
              </dl>

              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-ink-3">Payment Status</dt>
                  <dd>
                    <Badge variant={payment === "paid" ? "success" : "danger"}>
                      {PURCHASE_PAYMENT_LABELS[payment]}
                    </Badge>
                  </dd>
                </div>
                <TotalRow label="Amount Paid" value={formatCurrency(order.amountPaid)} />
                <TotalRow label="Balance Due" value={formatCurrency(balance)} />
                <TotalRow label="Payment Method" value="Cash" />
              </dl>
            </section>
          </div>

          <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
            <h2 className="text-base font-semibold text-ink-1">Order Items</h2>
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Items</TableHead>
                  <TableHead className="w-[110px]">Unit</TableHead>
                  <TableHead className="w-[100px]">Ordered</TableHead>
                  <TableHead className="w-[100px]">Received</TableHead>
                  <TableHead className="w-[130px]">Unit Cost</TableHead>
                  <TableHead className="w-[110px]">Discount</TableHead>
                  <TableHead className="w-[140px]">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.lines.map((line) => (
                  <TableRow key={`${line.productId}-${line.variant}`}>
                    <TableCell className="max-w-0 truncate">
                      {line.productName}
                      <span className="text-ink-4"> · {line.variant}</span>
                    </TableCell>
                    <TableCell className="w-[110px]">{line.unit}</TableCell>
                    <TableCell className="w-[100px]">{formatNumber(line.ordered)}</TableCell>
                    <TableCell className="w-[100px]">{formatNumber(line.received)}</TableCell>
                    <TableCell className="w-[130px] whitespace-nowrap">
                      {formatCurrency(line.unitCost)}
                    </TableCell>
                    <TableCell className="w-[110px]">{formatCurrency(0)}</TableCell>
                    <TableCell className="w-[140px] whitespace-nowrap">
                      {formatCurrency(line.ordered * line.unitCost)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </>
      )}

      {tab === "received" && (
        <TabPanel
          title="Received Goods"
          description="Quantities booked in against this order."
          action={<PrimaryButton onClick={() => openDialog("receive")}>Receive Products</PrimaryButton>}
        >
          <Table className="min-w-[620px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Item</TableHead>
                <TableHead className="w-[140px]">Variant</TableHead>
                <TableHead className="w-[110px]">Ordered</TableHead>
                <TableHead className="w-[110px]">Received</TableHead>
                <TableHead className="w-[150px]">Batch No.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.lines.map((line) => (
                <TableRow key={`${line.productId}-${line.variant}`}>
                  <TableCell className="max-w-0 truncate">{line.productName}</TableCell>
                  <TableCell className="w-[140px]">{line.variant}</TableCell>
                  <TableCell className="w-[110px]">{formatNumber(line.ordered)}</TableCell>
                  <TableCell className="w-[110px]">{formatNumber(line.received)}</TableCell>
                  <TableCell className="w-[150px]">{line.batchNumber || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabPanel>
      )}

      {tab === "payments" && (
        <TabPanel
          title="Payments"
          description={`${formatCurrency(order.amountPaid)} paid of ${formatCurrency(order.totalAmount)}.`}
          action={
            <PrimaryButton disabled={balance <= 0} onClick={() => openDialog("payment")}>
              Record Payment
            </PrimaryButton>
          }
        >
          {order.amountPaid <= 0 ? (
            <EmptyState title="No payments yet" description="Record a payment to see it here." />
          ) : (
            <dl className="flex flex-col gap-3 text-sm">
              <TotalRow label="Amount Paid" value={formatCurrency(order.amountPaid)} />
              <TotalRow label="Balance Due" value={formatCurrency(balance)} />
            </dl>
          )}
        </TabPanel>
      )}

      {tab === "returns" && (
        <TabPanel
          title="Returns"
          description="Goods sent back to the supplier."
          action={
            <PrimaryButton disabled={order.fulfilled <= 0} onClick={() => openDialog("return")}>
              Return Products
            </PrimaryButton>
          }
        >
          <EmptyState
            title="No returns raised"
            description="Returns against this order will be listed here."
          />
        </TabPanel>
      )}

      {tab === "invoice" && (
        <TabPanel
          title="Supplier Invoice"
          description="Invoices recorded against this order."
          action={
            <PrimaryButton onClick={() => openDialog("invoice")}>
              Record Supplier Invoice
            </PrimaryButton>
          }
        >
          <EmptyState
            title="No supplier invoice recorded"
            description="Record one to reconcile this order against the supplier's bill."
          />
        </TabPanel>
      )}

      {tab === "activity" && (
        <TabPanel
          title="Stock Activity"
          description="Movements this order has caused."
        >
          <EmptyState
            title="No stock activity yet"
            description="Receiving goods against this order will show up here."
          />
        </TabPanel>
      )}

      <ReceiveProductsDialog
        key={`receive-${dialogKey}`}
        order={order}
        open={dialog === "receive"}
        onOpenChange={(open) => setDialog(open ? "receive" : null)}
        onSuccess={refetch}
      />
      <RecordPaymentDialog
        key={`payment-${dialogKey}`}
        order={order}
        open={dialog === "payment"}
        onOpenChange={(open) => setDialog(open ? "payment" : null)}
        onSuccess={refetch}
      />
      <ReturnProductsDialog
        key={`return-${dialogKey}`}
        order={order}
        open={dialog === "return"}
        onOpenChange={(open) => setDialog(open ? "return" : null)}
        onSuccess={refetch}
      />
      <RecordSupplierInvoiceDialog
        key={`invoice-${dialogKey}`}
        order={order}
        open={dialog === "invoice"}
        onOpenChange={(open) => setDialog(open ? "invoice" : null)}
        onSuccess={refetch}
      />
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
