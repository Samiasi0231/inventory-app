import type { ID, ISODateString, ListParams } from "@/types/shared";

/**
 * Sales orders carry two independent status dimensions: how much has been paid,
 * and how far fulfilment has progressed. The row menu keys off the latter.
 */

export type OrderPaymentStatus = "unpaid" | "partially_paid" | "paid" | "refunded";

export const ORDER_PAYMENT_LABELS: Record<OrderPaymentStatus, string> = {
  unpaid: "Unpaid",
  partially_paid: "Partially Paid",
  paid: "Paid",
  refunded: "Refunded",
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "partially_received"
  | "fulfilled"
  | "completed"
  | "cancelled";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  partially_received: "Partially Received",
  fulfilled: "Fulfilled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export interface SalesOrder {
  id: ID;
  /** Display reference, e.g. "SO-2026-0032". */
  orderId: string;
  customerId: ID;
  customerName: string;
  orderDate: ISODateString;
  dueDate: ISODateString;
  total: number;
  amountPaid: number;
  status: OrderStatus;
  branchId: ID;
}

export function getOrderBalance(order: Pick<SalesOrder, "total" | "amountPaid">) {
  return Math.max(0, order.total - order.amountPaid);
}

export function getOrderPaymentStatus(order: SalesOrder): OrderPaymentStatus {
  if (order.status === "cancelled" && order.amountPaid > 0) return "refunded";
  if (order.amountPaid <= 0) return "unpaid";
  if (order.amountPaid >= order.total) return "paid";
  return "partially_paid";
}

export interface SalesOrderSummary {
  totalSales: number;
  totalSalesDelta: number;
  invoiceCount: number;
  collected: number;
  collectedDelta: number;
  outstanding: number;
  outstandingDelta: number;
  grossProfit: number;
  grossProfitDelta: number;
  invoices: number;
}

export interface SalesOrderListParams extends ListParams {
  branchId?: ID;
  status?: OrderStatus | "all";
}

export type OrderAction =
  | "view"
  | "view_invoice"
  | "view_returns"
  | "view_receipt"
  | "create_invoice"
  | "record_payment"
  | "send_goods"
  | "cancel";

export interface OrderMenuEntry {
  id: OrderAction;
  label: string;
}

/** The row menu differs by fulfilment stage, as the designs specify. */
export function getOrderActions(status: OrderStatus): OrderMenuEntry[] {
  switch (status) {
    case "completed":
    case "fulfilled":
      return [
        { id: "view", label: "View Details" },
        { id: "view_invoice", label: "View invoice" },
        { id: "view_returns", label: "View returns" },
        { id: "view_receipt", label: "View receipt" },
      ];
    case "partially_received":
      return [
        { id: "view", label: "View Details" },
        { id: "create_invoice", label: "Create invoice" },
        { id: "record_payment", label: "Record payment" },
      ];
    case "confirmed":
      return [
        { id: "view", label: "View Details" },
        { id: "send_goods", label: "Send goods" },
        { id: "create_invoice", label: "Create invoice" },
        { id: "cancel", label: "Cancel order" },
      ];
    case "cancelled":
      return [
        { id: "view", label: "View Details" },
        { id: "view_returns", label: "View returns" },
      ];
    default:
      return [
        { id: "view", label: "View Details" },
        { id: "create_invoice", label: "Create invoice" },
        { id: "cancel", label: "Cancel order" },
      ];
  }
}
