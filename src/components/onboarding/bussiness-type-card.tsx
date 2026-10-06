import { Check } from "lucide-react";
import type { BusinessType } from "@/features/onboarding/bussiness-types";
import { cn } from "@/lib/utils";
 
interface BusinessTypeCardProps {
  type: BusinessType;
  selected: boolean;
  onSelect: (id: string) => void;
}
 
export function BusinessTypeCard({ type, selected, onSelect }: BusinessTypeCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(type.id)}
      className={cn(
        "relative flex flex-col gap-2 rounded-xl border bg-white p-4 text-left transition-colors",
        "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-500/30",
        selected ? "border-brand-500 bg-brand-50" : "border-neutral-200 hover:border-neutral-300",
      )}
    >
      {selected && (
        <span className="absolute right-2 top-2 grid size-4 place-items-center rounded-full bg-brand-500 text-white">
          <Check className="size-3" aria-hidden />
        </span>
      )}
      <span className="grid size-9 place-items-center rounded-lg border border-neutral-200 bg-white text-brand-500">
        <type.icon className="size-4" aria-hidden />
      </span>
      <span className="mt-1 text-sm font-semibold text-neutral-800">{type.title}</span>
      <span className="text-xs leading-relaxed text-neutral-600">{type.description}</span>
      <span className="mt-1 flex flex-wrap gap-1.5">
        {type.tags.map((tag) => (
          <span key={tag} className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600">
            {tag}
          </span>
        ))}
      </span>
    </button>
  );
}