"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import { formatNaira } from "@/lib/format";
import type { Customer } from "@/types/customer";
import {
  CustomerActionsMenu,
  type CustomerAction,
} from "./customer-action-menu";

interface Props {
  customers: Customer[];
  onAction: (action: CustomerAction, customer: Customer) => void;
}

export function CustomersTable({ customers, onAction }: Props) {
  const columns: DataTableColumn<Customer>[] = [
    { key: "code", header: "ID", cell: (c) => c.code },
    {
      key: "name",
      header: "Customer",
      cell: (c) => c.name,
      className: "text-gray-900",
    },
    { key: "email", header: "Email", cell: (c) => c.email },
    { key: "phone", header: "Phone Number", cell: (c) => c.phone },
    {
      key: "totalSales",
      header: "Total Sales",
      cell: (c) => formatNaira(c.totalSales),
    },
    {
      key: "outstanding",
      header: "Outstanding",
      cell: (c) => (c.outstanding > 0 ? formatNaira(c.outstanding) : "--"),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (c) => <CustomerActionsMenu customer={c} onAction={onAction} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={customers}
      rowKey={(c) => c.id}
      emptyMessage="No customers found."
      minWidth={860}
    />
  );
}
