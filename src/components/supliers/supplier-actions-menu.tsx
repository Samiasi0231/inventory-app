"use client";

import { Archive, Eye, Pencil } from "lucide-react";
import { RowActionsMenu } from "@/components/common/row-action-menu";
import type { Supplier } from "@/types/suppliers";

export type SupplierAction = "view" | "edit" | "archive";

interface Props {
  supplier: Supplier;
  onAction: (action: SupplierAction, supplier: Supplier) => void;
}

export function SupplierActionsMenu({ supplier, onAction }: Props) {
  return (
    <RowActionsMenu
      ariaLabel={`Actions for ${supplier.name}`}
      items={[
        {
          key: "view",
          label: "View Details",
          icon: <Eye size={13} />,
          onSelect: () => onAction("view", supplier),
        },
        {
          key: "edit",
          label: "Edit Details",
          icon: <Pencil size={13} />,
          onSelect: () => onAction("edit", supplier),
        },
        {
          key: "archive",
          label: "Archive Supplier",
          icon: <Archive size={13} />,
          onSelect: () => onAction("archive", supplier),
        },
      ]}
    />
  );
}
