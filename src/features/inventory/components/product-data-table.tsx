import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProductDataTableProps {
  headers: string[];
  rows: ReactNode[][];
  columnClasses?: string[];
  label?: string;
}

export function ProductDataTable({
  headers,
  rows,
  columnClasses,
  label,
}: ProductDataTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/40">
      <table
        aria-label={label}
        className={cn(
          "w-full text-left text-sm",
          headers.length > 4 && "min-w-[600px]",
          columnClasses && "table-fixed",
        )}
      >
        <thead className="bg-surface-muted text-xs">
          <tr>
            {headers.map((header, index) => (
              <th
                key={header}
                className={cn("h-10 px-4 py-3 font-semibold", columnClasses?.[index])}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-border/30">
              {row.map((cell, column) => (
                <td
                  key={column}
                  className={cn("h-[52px] px-4 py-3 text-ink-3", columnClasses?.[column])}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
