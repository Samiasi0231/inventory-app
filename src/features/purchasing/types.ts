import type { ID, ISODateString, ListParams } from "@/types/shared";

export type PurchasePaymentStatus = "unpaid" | "partially_paid" | "paid" | "refunded";

export const PURCHASE_PAYMENT_LABELS: Record<PurchasePaymentStatus, string> = {
  unpaid: "Unpaid",
  partially_paid: "Partially Paid",
  paid: "Paid",
  refunded: "Refunded",
};

export type PurchaseOrderStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "sent_to_supplier"
  | "awaiting_supplier"
  | "confirmed"
  | "partially_received"
  | "received"
  | "completed"
  | "cancelled";

export const PURCHASE_STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  approved: "Approved",
  sent_to_supplier: "Sent to Supplier",
  awaiting_supplier: "Awaiting Supplier Response",
  confirmed: "Confirmed",
  partially_received: "Partially Received",
  received: "Received",
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
  purchaseId: string;
  supplierId: ID;
  supplierName: string;
  items: number;
  totalAmount: number;
  amountPaid: number;
  date: ISODateString;
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
  | "edit"
  | "submit_approval"
  | "cancel_request"
  | "send_to_supplier"
  | "view_supplier_response"
  | "receive"
  | "receive_remaining"
  | "record_invoice"
  | "return"
  | "record_payment"
  | "view_received"
  | "view_payments"
  | "view_returns"
  | "cancel";

export interface PurchaseMenuEntry {
  id: PurchaseAction;
  label: string;
  disabled?: boolean;
}

export function getPurchaseActions(order: PurchaseOrder): PurchaseMenuEntry[] {
  const view: PurchaseMenuEntry = { id: "view", label: "View Details" };

  switch (order.status) {
    case "draft":
      return [
        view,
        { id: "edit", label: "Edit" },
        { id: "submit_approval", label: "Submit for Approval" },
      ];
    case "pending_approval":
      return [view, { id: "cancel_request", label: "Cancel Request" }];
    case "approved":
      return [
        view,
        { id: "send_to_supplier", label: "Send to Supplier" },
        { id: "edit", label: "Edit" },
        { id: "cancel", label: "Cancel" },
      ];
    case "sent_to_supplier":
    case "awaiting_supplier":
      return [
        view,
        { id: "cancel", label: "Cancel Order" },
        { id: "view_supplier_response", label: "View Supplier Response" },
      ];
    case "confirmed":
      return [
        view,
        { id: "receive", label: "Receive Goods" },
        { id: "record_invoice", label: "Record Supplier Invoice" },
        { id: "record_payment", label: "Record Payment" },
      ];
    case "partially_received":
      return [
        view,
        { id: "receive_remaining", label: "Receive Remaining" },
        { id: "record_invoice", label: "Record Supplier Invoice" },
        { id: "view_returns", label: "View Returns" },
      ];
    case "received":
      return [
        view,
        { id: "record_invoice", label: "Record Supplier Invoice" },
        { id: "record_payment", label: "Record Payment" },
        { id: "return", label: "Return Products" },
      ];
    case "completed":
      return [
        view,
        { id: "view_received", label: "View Received Goods" },
        { id: "view_payments", label: "View Payments" },
        { id: "view_returns", label: "View Returns" },
      ];
    case "cancelled":
      return [view];
  }
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

export const PURCHASE_UNITS = ["Piece", "Carton (24)", "Carton (12)", "Bag", "Roll", "Bottle"];

export const PRODUCT_VARIANTS = ["Original", "Large / Milk", "Small / Dark", "Medium / Milk"];
