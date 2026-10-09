import { ReceiptIcon } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";

/** Placeholder so the sidebar link resolves; the screen is not built yet. */
export default function Page() {
  return (
    <div className="rounded-xl bg-surface p-5">
      <EmptyState
        icon={ReceiptIcon}
        title="Receipts"
        description="Receipts issued alongside your invoices. Coming soon."
      />
    </div>
  );
}
