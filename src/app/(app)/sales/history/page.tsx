import { HistoryIcon } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";

/** Placeholder so the sidebar link resolves; the screen is not built yet. */
export default function Page() {
  return (
    <div className="rounded-xl bg-surface p-5">
      <EmptyState
        icon={HistoryIcon}
        title="Sales History"
        description="Every completed sale, searchable by date, customer or item. Coming soon."
      />
    </div>
  );
}
