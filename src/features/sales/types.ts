import type { ID, ISODateString, ListParams } from "@/types/shared";

export type InvoiceStatus = "pending" | "partially_paid" | "paid" | "cancelled";

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  pending: "Pending",
  partially_paid: "Partially Paid",
  paid: "Paid",
  cancelled: "Cancelled",
};

export interface Customer {
  id: ID;
  name: string;
  phone?: string;
  address?: string;
}

export interface InvoiceLine {
  productId: ID;
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  /** quantity × unitPrice, before tax. */
  amount: number;
}

export interface Invoice {
  id: ID;
  /** Display reference, e.g. "INV-2026-0032". */
  number: string;
  customerId: ID;
  customerName: string;
  issueDate: ISODateString;
  dueDate: ISODateString;
  lines: InvoiceLine[];
  subtotal: number;
  vat: number;
  total: number;
  amountPaid: number;
  branchId: ID;
}

/** Derived so the badge and the figures cannot disagree. */
export function getInvoiceStatus(
  invoice: Pick<Invoice, "total" | "amountPaid"> & { cancelled?: boolean },
): InvoiceStatus {
  if (invoice.cancelled) return "cancelled";
  if (invoice.amountPaid <= 0) return "pending";
  if (invoice.amountPaid >= invoice.total) return "paid";
  return "partially_paid";
}

export function getBalanceDue(invoice: Pick<Invoice, "total" | "amountPaid">) {
  return Math.max(0, invoice.total - invoice.amountPaid);
}

export interface InvoiceSummary {
  totalInvoiced: number;
  totalInvoicedDelta: number;
  totalPaid: number;
  totalPaidDelta: number;
  balanceDue: number;
  balanceDueDelta: number;
  overdueCount: number;
  overdueCountDelta: number;
}

export interface InvoiceListParams extends ListParams {
  branchId?: ID;
  status?: InvoiceStatus | "all";
}

/* -- Point of sale --------------------------------------------------------- */

/** A product as the sale screen lists it, with its sellable stock. */
export interface SellableProduct {
  id: ID;
  name: string;
  sku: string;
  categoryId: ID;
  categoryName: string;
  unit: string;
  price: number;
  /** Null for services, which are not stock-tracked. */
  stock: number | null;
  isService: boolean;
}

export interface CartLine {
  productId: ID;
  name: string;
  sku: string;
  unit: string;
  unitPrice: number;
  quantity: number;
}

export type DiscountMode = "amount" | "percentage";

export type PaymentMethod = "cash" | "card" | "transfer" | "credit";

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "transfer", label: "Transfer" },
  { value: "credit", label: "On credit" },
];

export interface SalePayment {
  method: PaymentMethod;
  amount: number;
}

export interface CreateSalePayload {
  branchId: ID;
  customerId: ID | null;
  lines: CartLine[];
  discountMode: DiscountMode;
  discountValue: number;
  payments: SalePayment[];
}

export interface CreateSaleResult {
  invoiceId: ID;
  invoiceNumber: string;
  receiptNumber: string;
  total: number;
}

/** VAT applied across the application. */
export const VAT_RATE = 0.075;

/**
 * Totals for a cart. Discount is taken off the subtotal before VAT, which is
 * how the sale screen presents it.
 */
export function calculateCartTotals(
  lines: CartLine[],
  discountMode: DiscountMode,
  discountValue: number,
) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  const rawDiscount =
    discountMode === "percentage" ? (subtotal * discountValue) / 100 : discountValue;
  const discount = Math.min(Math.max(0, rawDiscount), subtotal);

  const taxable = subtotal - discount;
  const vat = taxable * VAT_RATE;

  return { subtotal, discount, vat, total: taxable + vat };
}
