import { Badge } from "@/components/ui/badge";
import {
  ORDER_PAYMENT_LABELS,
  ORDER_STATUS_LABELS,
  type OrderPaymentStatus,
  type OrderStatus,
} from "../order-types";

const STATUS_VARIANTS: Record<OrderStatus, "success" | "danger" | "warning" | "neutral"> = {
  completed: "success",
  fulfilled: "success",
  confirmed: "success",
  partially_received: "warning",
  pending: "neutral",
  cancelled: "danger",
};

const PAYMENT_VARIANTS: Record<OrderPaymentStatus, "success" | "danger" | "warning" | "neutral"> = {
  paid: "success",
  unpaid: "danger",
  partially_paid: "warning",
  refunded: "neutral",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} dot>
      {ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}

export function OrderPaymentBadge({ status }: { status: OrderPaymentStatus }) {
  return (
    <Badge variant={PAYMENT_VARIANTS[status]} dot>
      {ORDER_PAYMENT_LABELS[status]}
    </Badge>
  );
}
