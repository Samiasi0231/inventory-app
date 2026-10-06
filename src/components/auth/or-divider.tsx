export function OrDivider({ label = "Or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-[11px] text-neutral-400">
      <span className="h-px flex-1 bg-neutral-200" />
      {label}
      <span className="h-px flex-1 bg-neutral-200" />
    </div>
  );
}