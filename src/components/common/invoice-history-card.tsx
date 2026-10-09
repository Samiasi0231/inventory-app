"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { StatusBadge, type StatusTone } from "@/components/common/status-badge";
import { Panel } from "@/components/common/panel";
import {
  INVOICE_STATUS_LABELS,
  type InvoiceRecord,
  type InvoiceStatus,
} from "@/features/sales/types";
import { formatDate, formatNaira } from "@/lib/format";

const TONES: Record<InvoiceStatus, StatusTone> = {
  pending: "warning",
  partially_paid: "warning",
  paid: "success",
  completed: "success",
  cancelled: "danger",
};

interface Props {
  /** "Sales History" for customers, "Purchase History" for suppliers */
  title: string;
  records: InvoiceRecord[];
  onView?: (record: InvoiceRecord) => void;
}

export function InvoiceHistoryCard({ title, records, onView }: Props) {
  const columns: DataTableColumn<InvoiceRecord>[] = [
    { key: "date", header: "Date", cell: (r) => formatDate(r.date) },
    { key: "invoiceNo", header: "Invoice No", cell: (r) => r.invoiceNo },
    { key: "amount", header: "Amount", cell: (r) => formatNaira(r.amount) },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <StatusBadge
          label={INVOICE_STATUS_LABELS[r.status] ?? r.status}
          tone={TONES[r.status] ?? "warning"}
        />
      ),
    },
    {
      key: "action",
      header: "Action",
      cell: (r) => (
        <button
          type="button"
          onClick={() => onView?.(r)}
          className="rounded border border-gray-200 px-2 py-0.5 text-[10px] text-gray-700 hover:bg-gray-50"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <Panel>
      <h2 className="mb-4 text-base font-semibold text-gray-900">{title}</h2>
      <DataTable
        columns={columns}
        rows={records}
        rowKey={(r) => r.id}
        density="compact"
        minWidth={560}
        emptyMessage="Nothing here yet."
      />
    </Panel>
  );
}
