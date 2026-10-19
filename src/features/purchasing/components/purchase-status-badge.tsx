import { Badge } from "@/components/ui/badge";
import {
  PURCHASE_PAYMENT_LABELS,
  PURCHASE_STATUS_LABELS,
  type PurchaseOrderStatus,
  type PurchasePaymentStatus,
} from "../types";

const STATUS_VARIANTS: Record<
  PurchaseOrderStatus,
  "success" | "danger" | "warning" | "neutral" | "info"
> = {
  draft: "neutral",
  pending_approval: "neutral",
  approved: "info",
  sent_to_supplier: "info",
  awaiting_supplier: "warning",
  confirmed: "success",
  partially_received: "warning",
  received: "success",
  completed: "success",
  cancelled: "danger",
};

const PAYMENT_VARIANTS: Record<PurchasePaymentStatus, "success" | "danger" | "warning" | "neutral"> = {
  paid: "success",
  unpaid: "danger",
  partially_paid: "warning",
  refunded: "neutral",
};

export function PurchaseStatusBadge({ status }: { status: PurchaseOrderStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} dot>
      {PURCHASE_STATUS_LABELS[status]}
    </Badge>
  );
}

export function PurchasePaymentBadge({ status }: { status: PurchasePaymentStatus }) {
  return (
    <Badge variant={PAYMENT_VARIANTS[status]} dot>
      {PURCHASE_PAYMENT_LABELS[status]}
    </Badge>
  );
}
