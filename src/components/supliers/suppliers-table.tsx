"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { formatNaira } from "@/lib/format";
import type { Supplier } from "@/types/suppliers";
import {
  SupplierActionsMenu,
  type SupplierAction,
} from "./supplier-actions-menu";

interface Props {
  suppliers: Supplier[];
  onAction: (action: SupplierAction, supplier: Supplier) => void;
}

export function SuppliersTable({ suppliers, onAction }: Props) {
  const columns: DataTableColumn<Supplier>[] = [
    {
      key: "name",
      header: "Vendor",
      cell: (s) => s.name,
      className: "text-gray-900",
    },
    { key: "email", header: "Email", cell: (s) => s.email },
    { key: "phone", header: "Phone Number", cell: (s) => s.phone },
    {
      key: "totalPurchases",
      header: "Total Purchase",
      cell: (s) => formatNaira(s.totalPurchases),
    },
    {
      key: "outstanding",
      header: "Outstanding",
      cell: (s) => (s.outstanding > 0 ? formatNaira(s.outstanding) : "--"),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (s) => <SupplierActionsMenu supplier={s} onAction={onAction} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={suppliers}
      rowKey={(s) => s.id}
      emptyMessage="No suppliers found."
      minWidth={780}
    />
  );
}
