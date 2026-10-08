import { WalletIcon } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";

/** Placeholder so the sidebar link resolves; the screen is not built yet. */
export default function Page() {
  return (
    <div className="rounded-xl bg-surface p-5">
      <EmptyState
        icon={WalletIcon}
        title="Payments"
        description="Payments received from customers and made to suppliers. Coming soon."
      />
    </div>
  );
}
