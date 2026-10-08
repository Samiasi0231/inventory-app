import { Badge } from "@/components/ui/badge";
import { STOCK_STATUS_LABELS, type StockStatus } from "../types";

const STATUS_VARIANTS: Record<StockStatus, "success" | "danger" | "neutral"> = {
  in_stock: "success",
  low_stock: "danger",
  out_of_stock: "neutral",
};

export function StockStatusBadge({ status }: { status: StockStatus }) {
  return (
    <Badge variant={STATUS_VARIANTS[status]} dot>
      {STOCK_STATUS_LABELS[status]}
    </Badge>
  );
}
