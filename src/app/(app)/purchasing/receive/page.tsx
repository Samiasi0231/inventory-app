import { TruckIcon } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";

/** Placeholder so the sidebar link resolves; the screen is not built yet. */
export default function Page() {
  return (
    <div className="rounded-xl bg-surface p-5">
      <EmptyState
        icon={TruckIcon}
        title="Receive Stock"
        description="Book in stock against an open purchase order. Coming soon."
      />
    </div>
  );
}
