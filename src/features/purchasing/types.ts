import type { ID, ISODateString, ListParams } from "@/types/shared";

export type PurchasePaymentStatus = "unpaid" | "partially_paid" | "paid" | "refunded";

export const PURCHASE_PAYMENT_LABELS: Record<PurchasePaymentStatus, string> = {
  unpaid: "Unpaid",
  partially_paid: "Partially Paid",
  paid: "Paid",
  refunded: "Refunded",
};

export type PurchaseOrderStatus =
  | "pending_approval"
  | "received"
  | "partially_received"
  | "completed"
  | "cancelled";

export const PURCHASE_STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  pending_approval: "Pending Approval",
  received: "Received",
  partially_received: "Partially Received",
  completed: "Completed",
  cancelled: "Cancelled",
};

export interface PurchaseOrderLine {
  productId: ID;
  productName: string;
  variant: string;
  ordered: number;
  received: number;
  unit: string;
  batchNumber: string;
  expiryDate?: ISODateString;
  unitCost: number;
}

export interface PurchaseOrder {
  id: ID;
  /** Display reference, e.g. "P-001". */
  purchaseId: string;
  supplierId: ID;
  supplierName: string;
  items: number;
  totalAmount: number;
  amountPaid: number;
  date: ISODateString;
  /** Units booked in so far, against `items`. */
  fulfilled: number;
  status: PurchaseOrderStatus;
  branchId: ID;
  lines: PurchaseOrderLine[];
}

export function getPurchaseBalance(order: Pick<PurchaseOrder, "totalAmount" | "amountPaid">) {
  return Math.max(0, order.totalAmount - order.amountPaid);
}

export function getPurchasePaymentStatus(order: PurchaseOrder): PurchasePaymentStatus {
  if (order.status === "cancelled" && order.amountPaid > 0) return "refunded";
  if (order.amountPaid <= 0) return "unpaid";
  if (order.amountPaid >= order.totalAmount) return "paid";
  return "partially_paid";
}

export interface PurchaseSummary {
  totalOrders: number;
  totalOrdersDelta: number;
  pendingOrders: number;
  pendingOrdersDelta: number;
  completedOrders: number;
  completedOrdersDelta: number;
  outstandingPayments: number;
  outstandingPaymentsDelta: number;
}

export interface PurchaseListParams extends ListParams {
  branchId?: ID;
  status?: PurchaseOrderStatus | "all";
}

export type PurchaseAction =
  | "view"
  | "receive"
  | "record_invoice"
  | "return"
  | "record_payment"
  | "cancel";

export interface PurchaseMenuEntry {
  id: PurchaseAction;
  label: string;
  disabled?: boolean;
}

/**
 * The row menu keeps every entry visible and disables the ones that do not
 * apply at this stage, as the designs specify.
 */
export function getPurchaseActions(order: PurchaseOrder): PurchaseMenuEntry[] {
  const awaiting = order.status === "pending_approval";
  const closed = order.status === "cancelled" || order.status === "completed";
  const nothingReceived = order.fulfilled <= 0;

  return [
    { id: "view", label: "View Details" },
    { id: "receive", label: "Receive Goods", disabled: awaiting || closed },
    { id: "record_invoice", label: "Record Supplier Invoice", disabled: awaiting || closed },
    { id: "return", label: "Return Products", disabled: nothingReceived || closed },
    { id: "record_payment", label: "Record Payment", disabled: closed },
    { id: "cancel", label: "Cancel Order", disabled: closed },
  ];
}

export const RETURN_REASONS = [
  { value: "damaged", label: "Damaged" },
  { value: "expired", label: "Expired" },
  { value: "wrong_order", label: "Wrong order" },
  { value: "short_supplied", label: "Short supplied" },
];

export const DELIVERY_METHODS = [
  { value: "supplier", label: "Supplier Delivery" },
  { value: "pickup", label: "Self Pickup" },
  { value: "courier", label: "Courier" },
];

export const PURCHASE_PAYMENT_METHODS = [
  { value: "transfer", label: "Bank Transfer" },
  { value: "cash", label: "Cash" },
  { value: "cheque", label: "Cheque" },
  { value: "card", label: "Card" },
];

/** Pack sizes offered when ordering. */
export const PURCHASE_UNITS = ["Piece", "Carton (24)", "Carton (12)", "Bag", "Roll", "Bottle"];

export const PRODUCT_VARIANTS = ["Original", "Large / Milk", "Small / Dark", "Medium / Milk"];
