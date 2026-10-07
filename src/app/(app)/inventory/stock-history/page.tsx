import { HistoryIcon } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";

/** Placeholder so the sidebar link resolves; the screen is not built yet. */
export default function Page() {
  return (
    <div className="rounded-xl bg-surface p-5">
      <EmptyState
        icon={HistoryIcon}
        title="Stock History"
        description="A record of every stock movement across your branches. Coming soon."
      />
    </div>
  );
}
