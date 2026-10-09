import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  align?: "left" | "right";
  className?: string;
}

interface Props<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  density?: "comfortable" | "compact";
  minWidth?: number;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "Nothing to show yet.",
  density = "comfortable",
  minWidth = 720,
}: Props<T>) {
  const cellPad = density === "comfortable" ? "px-4 py-5" : "px-4 py-3";

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full text-left text-xs text-gray-700"
        style={{ minWidth }}
      >
        <thead>
          <tr className="bg-gray-50 text-[11px] font-medium text-gray-500">
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  "px-4 py-3 font-medium",
                  c.align === "right" && "text-right",
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-gray-100 last:border-0"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      cellPad,
                      c.align === "right" && "text-right",
                      c.className,
                    )}
                  >
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
