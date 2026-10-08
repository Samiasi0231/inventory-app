"use client";

import { use } from "react";
import SalesOrderDetailPage from "@/screens/sales-order-detail-page";

export default function Page({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { orderId } = use(params);
  const { tab } = use(searchParams);
  return <SalesOrderDetailPage orderId={orderId} initialTab={tab} />;
}
