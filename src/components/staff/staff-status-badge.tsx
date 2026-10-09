import { cn } from "@/lib/utils";
import type { StaffStatus } from "@/types/staff";

const STYLES: Record<StaffStatus, { label: string; pill: string; dot: string }> = {
  active: { label: "Active", pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  suspended: { label: "Suspended", pill: "bg-red-50 text-red-600", dot: "bg-red-500" },
  pending: { label: "Pending", pill: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
};

export function StaffStatusBadge({ status }: { status: StaffStatus }) {
  const s = STYLES[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium", s.pill)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}