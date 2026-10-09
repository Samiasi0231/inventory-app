"use client";

import { Archive, Eye, Pencil } from "lucide-react";
import { RowActionsMenu } from "@/components/common/row-action-menu";
import type { Customer } from "@/types/customer";

export type CustomerAction = "view" | "edit" | "archive";

interface Props {
  customer: Customer;
  onAction: (action: CustomerAction, customer: Customer) => void;
}

export function CustomerActionsMenu({ customer, onAction }: Props) {
  return (
    <RowActionsMenu
      ariaLabel={`Actions for ${customer.name}`}
      items={[
        {
          key: "view",
          label: "View Details",
          icon: <Eye size={13} />,
          onSelect: () => onAction("view", customer),
        },
        {
          key: "edit",
          label: "Edit Details",
          icon: <Pencil size={13} />,
          onSelect: () => onAction("edit", customer),
        },
        {
          key: "archive",
          label: "Archive Customer",
          icon: <Archive size={13} />,
          onSelect: () => onAction("archive", customer),
        },
      ]}
    />
  );
}
