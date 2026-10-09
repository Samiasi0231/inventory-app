import { Badge } from "@/components/ui/badge";
import { INVOICE_STATUS_LABELS, type InvoiceStatus } from "../types";

const STATUS_VARIANTS: Record<InvoiceStatus, "success" | "danger" | "warning" | "neutral"> = {
  paid: "success",
  completed: "success",
  pending: "danger",
  partially_paid: "warning",
  cancelled: "neutral",
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} dot>
      {INVOICE_STATUS_LABELS[status]}
    </Badge>
  );
}
