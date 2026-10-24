import type { PurchaseOrderStatus, PurchasePaymentStatus } from "./types";

interface PurchaseListFixture {
  supplierName: string;
  status: PurchaseOrderStatus;
  paymentStatus: PurchasePaymentStatus;
}

export const purchaseListFixtures: PurchaseListFixture[] = [
  { supplierName: "Lagos food co", status: "pending_approval", paymentStatus: "unpaid" },
  { supplierName: "Coca Cola Ikeja", status: "received", paymentStatus: "partially_paid" },
  { supplierName: "Ade Traders Limited", status: "partially_received", paymentStatus: "paid" },
  { supplierName: "Nasco Group", status: "awaiting_supplier", paymentStatus: "unpaid" },
  { supplierName: "Dangote Refinery", status: "partially_received", paymentStatus: "partially_paid" },
  { supplierName: "Indomitable food co", status: "completed", paymentStatus: "paid" },
  { supplierName: "Nasbury Limited", status: "completed", paymentStatus: "paid" },
  { supplierName: "Kokoa Foods", status: "completed", paymentStatus: "paid" },
  { supplierName: "Honeywell Limited", status: "completed", paymentStatus: "paid" },
  { supplierName: "Misiano Farms", status: "completed", paymentStatus: "paid" },
  { supplierName: "Titus Spices and Condiments", status: "cancelled", paymentStatus: "unpaid" },
  { supplierName: "Herbivourous Group Of Foods", status: "cancelled", paymentStatus: "refunded" },
  { supplierName: "Kokoa Foods", status: "cancelled", paymentStatus: "refunded" },
  { supplierName: "Indomitable food co", status: "completed", paymentStatus: "paid" },
  { supplierName: "Nasbury Limited", status: "completed", paymentStatus: "paid" },
];
