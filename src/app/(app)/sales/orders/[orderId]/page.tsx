import SalesOrderDetailPage from "@/screens/sales/sales-order-detail-page";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { orderId } = await params;
  const { tab } = await searchParams;
  return <SalesOrderDetailPage orderId={orderId} initialTab={tab} />;
}
