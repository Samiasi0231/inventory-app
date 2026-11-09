"use client";

import { Archive, CreditCard, Eye, Pencil } from "lucide-react";
import { RowActionsMenu } from "@/components/common/row-action-menu";
import type { Customer } from "@/types/customer";

export type CustomerAction = "view" | "edit" | "archive" | "adjust-credit";

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
          key: "adjust-credit",
          label: "Adjust Credit",
          icon: <CreditCard size={13} />,
          onSelect: () => onAction("adjust-credit", customer),
        },
        {
          key: "archive",
          label: "Archive / Deactivate",
          icon: <Archive size={13} />,
          onSelect: () => onAction("archive", customer),
        },
      ]}
    />
  );
}
