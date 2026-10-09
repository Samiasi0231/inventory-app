import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { StaffStatus } from "@/types/staff";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));}


 

const STYLES: Record<StaffStatus, { label: string; pill: string; dot: string }> = {
  active: { label: "Active", pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  suspended: { label: "Suspended", pill: "bg-red-50 text-red-600", dot: "bg-red-500" },
  pending: { label: "Pending", pill: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
};







export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string | number;
}

const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

export function exportCsv<T>(rows: T[], columns: CsvColumn<T>[], filename: string) {
  const lines = [columns.map((c) => escape(c.header)), ...rows.map((r) => columns.map((c) => escape(c.value(r))))];
  const csv = lines.map((l) => l.join(",")).join("\n");

  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}