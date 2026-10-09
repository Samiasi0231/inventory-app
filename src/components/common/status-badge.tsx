import { cn } from "@/lib/utils";

export type StatusTone = "success" | "danger" | "warning";

const TONES: Record<StatusTone, { pill: string; dot: string }> = {
  success: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  danger: { pill: "bg-red-50 text-red-600", dot: "bg-red-500" },
  warning: { pill: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
};

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: StatusTone;
}) {
  const t = TONES[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium",
        t.pill,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", t.dot)} />
      {label}
    </span>
  );
}
