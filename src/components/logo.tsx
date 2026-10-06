import { cn } from "@/lib/utils";
 
export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1", className)} aria-label="Riinox">
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="size-1 rounded-full bg-brand-500" />
        ))}
      </div>
      <span className="text-sm font-bold tracking-wide text-brand-500">RIINOX</span>
    </div>
  );
}