"use client";

import { use } from "react";
import PurchaseOrderDetailPage from "@/screens/purchase-order-detail-page";

export default function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  return <PurchaseOrderDetailPage orderId={orderId} />;
}
