import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, type OrderStatus } from "../order-types";
export function OrderStatusBadge({ status, detail = false }: { status: OrderStatus; detail?: boolean }) {
  return <Badge dot variant={status === "confirmed" ? "info" : status === "cancelled" ? "danger" : status === "partially_received" || (detail && status === "pending") ? "warning" : status === "pending" ? "neutral" : "success"} className={detail ? "border border-current/30 px-2 py-1 text-xs" : "px-2 py-1 text-xs"}>{detail && status === "pending" ? "Pending Approval" : ORDER_STATUS_LABELS[status]}</Badge>;
}
