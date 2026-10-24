"use client";

import { useState, useRef, type ReactNode, type FormEvent } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, SelectInput, TextInput } from "@/components/form/app-fields";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { useAsyncResource } from "@/hooks/use-async-resource";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { exportCsv } from "@/lib/utils";
import { ordersService } from "../orders.service";
import { getOrderBalance, type SalesOrder, type OrderPayment, type OrderReturn } from "../order-types";
import { SalesOrderIcon } from "./sales-order-icon";
import { OrderDecisionDialog } from "./order-decision-dialog";
import { OrderStatusBadge } from "./order-status-badge";

export type OrderDetailTab = "overview" | "payments" | "returns" | "invoice";
const TABS: { id: OrderDetailTab; label: string }[] = [{ id: "overview", label: "Overview" }, { id: "payments", label: "Payments" }, { id: "returns", label: "Returns" }, { id: "invoice", label: "Customer Invoice" }];
function Panel({ title, children }: { title: string; children: ReactNode }) { return <section className="sales-detail-panel"><h2>{title}</h2>{children}</section>; }
function DetailRow({ label, children }: { label: string; children: ReactNode }) { return <div className="sales-detail-row"><dt>{label}</dt><dd>{children}</dd></div>; }
function DetailTable({ headers, rows, widths }: { headers: string[]; rows: ReactNode[][]; widths?: number[] }) {
  return <div className={`sales-detail-table ${headers[0] === "Payment ID" ? "sales-transactions-table" : ""}`}><table><colgroup>{headers.map((h, i) => <col key={h} style={widths ? { width: `${widths[i]}%` } : undefined} />)}</colgroup><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table>{!rows.length && <p className="p-8 text-center text-sm text-ink-4">No records yet.</p>}</div>;
}
const transactionDate = (date: string) => `${formatDate(date).replace("Sept", "Sep")}, ${new Intl.DateTimeFormat("en-NG", { timeZone: "Africa/Lagos", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date(date)).replace(/\s+(am|pm)$/i, "$1").toLowerCase()}`;
function ordinalDate(value: string) {
  const date = formatDate(value);
  const day = Number(date.split(" ")[0]);
  const suffix = day % 100 >= 11 && day % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[day % 10] ?? "th");
  return date.replace(/^\d+/, `${day}${suffix}`);
}
function RecordMenu({ label, onClick }: { label: string; onClick: () => void }) { return <DropdownMenu><DropdownMenuTrigger aria-label={label} className="flex size-8 items-center justify-center rounded-lg hover:bg-surface-muted"><span className="text-lg leading-none" aria-hidden>•••</span></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem onClick={onClick}><SalesOrderIcon name="view" />View details</DropdownMenuItem></DropdownMenuContent></DropdownMenu>; }

export function OrderDetailsDialog({ orderId, initialTab = "overview", initialAction, onClose, onSuccess }: { orderId: string; initialTab?: OrderDetailTab; initialAction?: "payment" | "invoice"; onClose: () => void; onSuccess: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<OrderDetailTab>(initialTab);
  const [action, setAction] = useState<"payment" | "return" | "reject" | "changes" | "invoice" | null>(initialAction === "payment" ? "payment" : null);
  const [record, setRecord] = useState<OrderPayment | OrderReturn | null>(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const { branches } = useBranch();
  const toast = useToast();
  const { data: order, loading, error, refetch } = useAsyncResource(orderId, () => ordersService.getOrder(orderId), "We couldn't load this order.");
  function changed() { refetch(); onSuccess(); }
  async function accept() {
    setBusy(true);
    try { await ordersService.acceptOrder(orderId); changed(); toast.add({ type: "success", title: "Order accepted" }); } catch { toast.add({ type: "error", title: "Couldn't accept order" }); } finally { setBusy(false); }
  }
  async function createInvoice() {
    setBusy(true);
    try { await ordersService.createInvoice(orderId); changed(); setTab("invoice"); toast.add({ type: "success", title: "Invoice created" }); } catch { toast.add({ type: "error", title: "Couldn't create invoice" }); } finally { setBusy(false); }
  }
  async function submitAction(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!order) return;
    const data = new FormData(event.currentTarget);
    setBusy(true); setFormError("");
    try {
      if (action === "payment") await ordersService.recordPayment(orderId, { date: `${data.get("date")}T${new Date().toISOString().split("T")[1]}`, amount: Number(data.get("amount")), method: String(data.get("method")), reference: String(data.get("reference")), receivedBy: "Sales Staff" });
      if (action === "return") await ordersService.createReturn(orderId, { date: `${data.get("date")}T${new Date().toISOString().split("T")[1]}`, items: Number(data.get("items")), reason: String(data.get("reason")), amount: Number(data.get("amount")), recordedBy: "Sales Staff" });
      changed(); setAction(null); toast.add({ type: "success", title: action === "payment" ? "Payment recorded" : action === "return" ? "Return created" : action === "reject" ? "Order rejected" : "Changes proposed" });
    } catch (error) { setFormError(error instanceof Error ? error.message : "Please try again."); } finally { setBusy(false); }
  }
  const balance = order ? getOrderBalance(order) : 0;
  const actionTitle = action === "payment" ? "Record Payment" : action === "return" ? "Create Return" : action === "reject" ? "Reject Order" : "Propose Changes";
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return <>
    <Dialog open onOpenChange={open => { if (!open && !busy) onClose(); }}>
      <DialogContent ref={dialogRef} initialFocus={dialogRef} showCloseButton={false} aria-describedby={undefined} className={`sales-order-dialog ${tab === "overview" ? "sales-order-overview" : ""}`}>
        <DialogTitle className="sr-only">Sales order {order?.orderId ?? orderId}</DialogTitle>
        <button type="button" className="sr-only focus:not-sr-only focus:absolute focus:right-2 focus:top-2" onClick={onClose}>Close order details</button>
        {loading ? <div className="space-y-6"><Skeleton className="h-24" /><Skeleton className="h-14" /><Skeleton className="h-80" /></div> : error || !order ? <div className="p-8"><h2>Couldn&apos;t load this order</h2><p className="my-4">{error ?? "Order not found."}</p><SecondaryButton onClick={refetch}>Try again</SecondaryButton><SecondaryButton onClick={onClose}>Close</SecondaryButton></div> : <>
          <header className="sales-detail-header">
            <div><div className="flex flex-wrap items-center gap-3"><h1>#{order.orderId}</h1><OrderStatusBadge status={order.status} detail /></div><p>Date Received: {ordinalDate(order.orderDate)}</p></div>
            <div className="flex flex-wrap items-center gap-2">
              {order.status === "pending" && tab === "overview" && <><button className="sales-reject" disabled={busy} onClick={() => { setFormError(""); setAction("reject"); }}><SalesOrderIcon name="reject" />Reject Order</button><SecondaryButton onClick={() => { setFormError(""); setAction("changes"); }} leftIcon={<SalesOrderIcon name="changes" />}>Propose Changes</SecondaryButton><PrimaryButton onClick={accept} disabled={busy} leftIcon={<SalesOrderIcon name="accept" />}>Accept Order</PrimaryButton></>}
              {tab === "payments" && order.status !== "cancelled" && <PrimaryButton disabled={balance <= 0} title={balance <= 0 ? "This order is fully paid" : undefined} onClick={() => { setFormError(""); setAction("payment"); }} leftIcon={<SalesOrderIcon name="payment" />}>Record Payment</PrimaryButton>}
              {tab === "returns" && order.status !== "cancelled" && <PrimaryButton onClick={() => { setFormError(""); setAction("return"); }} leftIcon={<SalesOrderIcon name="refresh" />}>Create Return</PrimaryButton>}
              {tab === "invoice" && <PrimaryButton disabled={busy} onClick={order.invoiceNumber ? () => exportInvoice(order) : createInvoice} leftIcon={<SalesOrderIcon name="invoice" />}>{order.invoiceNumber ? "Export Invoice" : "Create Invoice"}</PrimaryButton>}
            </div>
          </header>
          <nav className="sales-detail-tabs" aria-label="Order sections">{TABS.map(entry => <button key={entry.id} aria-current={tab === entry.id ? "page" : undefined} onClick={() => setTab(entry.id)}>{entry.label}</button>)}</nav>
          {tab === "overview" && <>
            <Panel title="Order Information"><dl className="sales-order-information"><DetailRow label="Customer">{order.customerName}</DetailRow><DetailRow label="Expected Delivery Date">{ordinalDate(order.dueDate)}</DetailRow><DetailRow label="Branch">{branches.find(branch => branch.id === order.branchId)?.name ?? "—"}</DetailRow></dl><div className="sales-delivery"><h2>Delivery and Logistics</h2><dl><DetailRow label="Delivery Method">{order.deliveryMethod ?? "Supplier delivery"}</DetailRow><DetailRow label="Delivery Cost">₦{formatNumber(order.deliveryCost ?? 0)}</DetailRow></dl></div></Panel>
            <Panel title="Order Items"><OrderItems order={order} /></Panel>
            <Panel title="Summary"><dl className="sales-order-summary"><DetailRow label="Subtotal">{formatCurrency(order.total + (order.discount ?? 0) - (order.vat ?? 0) - (order.deliveryCost ?? 0))}</DetailRow><DetailRow label="Discount">−{formatCurrency(order.discount ?? 0)}</DetailRow><DetailRow label="VAT">{formatCurrency(order.vat ?? 0)}</DetailRow><div className="sales-summary-total"><dt>Total</dt><dd>{formatCurrency(order.total)}</dd></div><DetailRow label="Paid">{formatCurrency(order.amountPaid)}</DetailRow><div className="font-semibold"><DetailRow label="Balance">{formatCurrency(balance)}</DetailRow></div></dl></Panel>
          </>}
          {tab === "payments" && <Panel title="Payments"><DetailTable headers={["Payment ID", "Date", "Method", "Reference", "Amount (₦)", "Status", "Received by", "Action"]} widths={[11.4, 15, 12.4, 15, 12.4, 12, 15, 6.8]} rows={(order.payments ?? []).map(payment => [payment.id, transactionDate(payment.date), payment.method, payment.reference, formatNumber(payment.amount), <TransactionStatus key="status" status="Completed" />, payment.receivedBy, <RecordMenu key="action" label={`Actions for ${payment.id}`} onClick={() => setRecord(payment)} />])} /></Panel>}
          {tab === "returns" && <Panel title="Returns"><DetailTable headers={["Payment ID", "Date", "Items Returned", "Reasons", "Amount (₦)", "Status", "Recorded by", "Action"]} widths={[11.4, 15, 12.4, 15, 12.4, 12, 15, 6.8]} rows={(order.returns ?? []).map(entry => [entry.id, transactionDate(entry.date), entry.items, entry.reason, formatNumber(entry.amount), <TransactionStatus key="status" status={entry.status} />, entry.recordedBy, <RecordMenu key="action" label={`Actions for ${entry.id}`} onClick={() => setRecord(entry)} />])} /></Panel>}
          {tab === "invoice" && (order.invoiceNumber ? <Panel title="Customer Invoice"><div className="mb-6 flex justify-between text-sm"><div><h3 className="text-xl font-semibold">{order.invoiceNumber}</h3><p className="mt-2">{order.customerName}</p></div><div className="text-right"><p>Issued: {formatDate(order.orderDate)}</p><p>Due: {formatDate(order.dueDate)}</p></div></div><OrderItems order={order} /><dl className="mt-6"><DetailRow label="Total">{formatCurrency(order.total)}</DetailRow><DetailRow label="Paid">{formatCurrency(order.amountPaid)}</DetailRow><DetailRow label="Balance">{formatCurrency(balance)}</DetailRow></dl></Panel> : <Panel title="Customer Invoice"><p className="py-10 text-center text-sm text-ink-4">No invoice has been created for this order.</p></Panel>)}
          {(order.proposal || order.proposedPrice !== undefined) && tab === "overview" && <Panel title="Proposed Changes">{order.proposedPrice !== undefined && <p className="mb-2 text-sm">New Price: {formatCurrency(order.proposedPrice)}</p>}<p className="whitespace-pre-wrap text-sm">{order.proposal}</p></Panel>}
          {order.rejectionNote && tab === "overview" && <Panel title="Rejection Note"><p className="whitespace-pre-wrap text-sm">{order.rejectionNote}</p></Panel>}
        </>}
      </DialogContent>
    </Dialog>
    {order && (action === "reject" || action === "changes") && <OrderDecisionDialog key={action} order={order} kind={action} onClose={() => setAction(null)} onSuccess={changed} />}
    <FormDialog open={action === "payment" || action === "return"} onOpenChange={open => { if (!open && !busy) { setAction(null); setFormError(""); } }} title={actionTitle} className="sales-action-dialog" footer={<><SecondaryButton disabled={busy} onClick={() => setAction(null)}>Cancel</SecondaryButton><PrimaryButton type="submit" form="sales-order-action-form" disabled={busy}>{busy ? "Saving…" : actionTitle}</PrimaryButton></>}>
      <form id="sales-order-action-form" onSubmit={submitAction} className="flex flex-col gap-5">
        {action === "payment" && <><p className="rounded-lg bg-accent p-4 text-sm">Balance due: <strong>{formatCurrency(balance)}</strong></p><Field label="Amount (₦)" htmlFor="order-payment-amount" required><TextInput id="order-payment-amount" name="amount" type="number" min="0.01" max={balance} step="0.01" required /></Field><Field label="Payment Method" htmlFor="order-payment-method"><SelectInput id="order-payment-method" name="method"><option>Bank Transfer</option><option>Cash</option><option>Card</option><option>Cheque</option></SelectInput></Field><Field label="Reference" htmlFor="order-payment-reference"><TextInput id="order-payment-reference" name="reference" /></Field></>}
        {action === "return" && <><Field label="Items Returned" htmlFor="order-return-items" required><TextInput id="order-return-items" name="items" type="number" min={1} required /></Field><Field label="Reason" htmlFor="order-return-reason"><SelectInput id="order-return-reason" name="reason"><option>Damaged Goods</option><option>Expired Products</option><option>Wrong Items</option><option>Customer Return</option></SelectInput></Field><Field label="Amount (₦)" htmlFor="order-return-amount" required><TextInput id="order-return-amount" name="amount" type="number" min={0} max={order?.total} step="0.01" required /></Field></>}
        {(action === "payment" || action === "return") && <Field label="Date" htmlFor="order-action-date" required><TextInput id="order-action-date" name="date" type="date" defaultValue={today} required /></Field>}
        {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
      </form>
    </FormDialog>
    <FormDialog open={record !== null} onOpenChange={open => { if (!open) setRecord(null); }} title={record && "method" in record ? "Payment Details" : "Return Details"} className="sales-action-dialog" footer={<SecondaryButton onClick={() => setRecord(null)}>Close</SecondaryButton>}>
      {record && <dl className="space-y-4 text-sm">{Object.entries(record).map(([label, value]) => <DetailRow key={label} label={label === "receivedBy" ? "Received by" : label === "recordedBy" ? "Recorded by" : label[0].toUpperCase() + label.slice(1)}>{label === "amount" ? formatCurrency(Number(value)) : label === "date" ? transactionDate(String(value)) : String(value)}</DetailRow>)}</dl>}
    </FormDialog>
  </>;
}
function OrderItems({ order }: { order: SalesOrder }) { return <DetailTable headers={["Product", "Variant", "Unit", "Quantity", "Unit Cost (₦)", "Total (₦)"]} rows={order.lines.map(line => [line.productName, line.variant, line.unit, line.quantity, formatNumber(line.unitCost), formatNumber(line.quantity * line.unitCost)])} />; }
function TransactionStatus({ status }: { status: string }) { return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs whitespace-nowrap ${status === "Rejected" ? "bg-danger-bg text-danger-fg" : "bg-success-bg text-success-fg"}`}><span className="size-1 rounded-full bg-current" />{status}</span>; }
function exportInvoice(order: SalesOrder) {
  const headers = ["Invoice", "Customer", "Product", "Variant", "Unit", "Quantity", "Unit Cost", "Total"];
  const rows = order.lines.map(line => [order.invoiceNumber ?? "", order.customerName, line.productName, line.variant, line.unit, line.quantity, line.unitCost, line.quantity * line.unitCost]);
  exportCsv(rows, headers.map((header, index) => ({ header, value: (row: (string | number)[]) => row[index] })), `${order.invoiceNumber}.csv`);
}
