import { exportCsv } from "@/lib/utils";
import type { PurchaseOrder } from "./types";

export function exportPurchases(
  orders: PurchaseOrder[],
  filename = "purchase-orders",
) {
  exportCsv(orders, [
    { header: "Purchase ID", value: (order) => order.purchaseId },
    { header: "Supplier", value: (order) => order.supplierName },
    { header: "Items", value: (order) => order.items },
    { header: "Total Amount", value: (order) => order.totalAmount },
    { header: "Date", value: (order) => order.date.slice(0, 10) },
    { header: "Fulfilled", value: (order) => order.fulfilled },
    { header: "Status", value: (order) => order.status },
  ], `${filename}.csv`);
}
