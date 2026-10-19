"use client";

import { use } from "react";
import PurchaseOrderDetailPage from "@/screens/purchasing/purchase-order-detail-page";

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { orderId } = use(params);
  const { tab } = use(searchParams);
  return <PurchaseOrderDetailPage orderId={orderId} initialTab={tab} />;
}
