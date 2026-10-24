import type { ReactNode } from "react";

export function ProductDataTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return <div className="overflow-x-auto rounded-lg border border-border/40"><table className={headers.length > 4 ? "w-full min-w-[600px] text-left text-sm" : "w-full text-left text-sm"}><thead className="bg-surface-muted text-xs"><tr>{headers.map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i} className="border-t border-border/30">{row.map((cell, j) => <td key={j} className="h-[52px] px-4 py-3 text-ink-3">{cell}</td>)}</tr>)}</tbody></table></div>;
}
