"use client";

import { useRouter } from "next/navigation";
import SalesOrdersPage from "./sales-orders-page";
import { OrderDetailsDialog, type OrderDetailTab } from "@/features/sales/components/order-details-dialog";

/** Deep links retain the same modal presentation as opening an order from the list. */
export default function SalesOrderDetailPage({ orderId, initialTab }: { orderId: string; initialTab?: string }) {
  const router = useRouter();
  const tab: OrderDetailTab = initialTab === "payments" || initialTab === "returns" || initialTab === "invoice" ? initialTab : "overview";
  return <><SalesOrdersPage /><OrderDetailsDialog orderId={orderId} initialTab={tab} onClose={() => router.push("/sales/orders")} onSuccess={() => router.refresh()} /></>;
}
