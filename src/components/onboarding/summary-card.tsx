export interface SummaryItem {
  label: string;
  value: string;
}

/**
 * Mint summary box from the "You're all Set!" design.
 * 2 columns (left ~65% / right ~35%), tiny grey label above a bold value,
 * and a generous gap between the two rows.
 */
export function SummaryCard({ items }: { items: SummaryItem[] }) {
  return (
    <dl className="grid grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] gap-x-4 gap-y-12 rounded-lg border border-[#bdf0d1] bg-[#e4fcec] p-4 text-left">
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-[11px] leading-none text-neutral-600">{item.label}</dt>
          <dd className="mt-1.5 break-words text-base font-bold leading-tight text-neutral-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}