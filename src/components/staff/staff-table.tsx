"use client";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/common/data-table";
import type { StaffMember } from "@/types/staff";
import { StaffActionsMenu, type StaffAction } from "./staff-actions-menu";
import { StaffStatusBadge } from "./staff-status-badge";

interface Props {
  staff: StaffMember[];
  onAction: (action: StaffAction, staff: StaffMember) => void;
}

export function StaffTable({ staff, onAction }: Props) {
  const columns: DataTableColumn<StaffMember>[] = [
    {
      key: "name",
      header: "Name",
      cell: (s) => s.name,
      className: "text-gray-900",
    },
    {
      key: "email",
      header: "Email",
      cell: (s) => s.email,
    },
    {
      key: "role",
      header: "Assigned Role",
      cell: (s) => s.role,
    },
    {
      key: "branch",
      header: "Branch",
      cell: (s) => s.branch,
    },
    {
      key: "status",
      header: "Status",
      cell: (s) => <StaffStatusBadge status={s.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (s) => (
        <StaffActionsMenu
          staff={s}
          onAction={onAction}
          disabled={s.role === "Owner"}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={staff}
      rowKey={(s) => s.id}
      emptyMessage="No staff found."
      minWidth={860}
    />
  );
}
