"use client";

import {
  Mail,
  MinusCircle,
  PauseCircle,
  Pencil,
  PlayCircle,
} from "lucide-react";
import {
  RowActionsMenu,
  type RowActionItem,
} from "@/components/common/row-action-menu";
import type { StaffMember } from "@/types/staff";

export type StaffAction = "edit" | "suspend" | "restore" | "remove" | "resend";

interface Props {
  staff: StaffMember;
  onAction: (action: StaffAction, staff: StaffMember) => void;
  disabled?: boolean;
}

export function StaffActionsMenu({ staff, onAction, disabled }: Props) {
  const item = (
    action: StaffAction,
    label: string,
    icon: RowActionItem["icon"],
  ): RowActionItem => ({
    key: action,
    label,
    icon,
    onSelect: () => onAction(action, staff),
  });

  const edit = item("edit", "Edit Details", <Pencil size={13} />);
  const remove = item("remove", "Remove Staff", <MinusCircle size={13} />);

  const middle = {
    active: item("suspend", "Suspend Access", <PauseCircle size={13} />),
    suspended: item("restore", "Restore Access", <PlayCircle size={13} />),
    pending: item("resend", "Resend Invitation", <Mail size={13} />),
  }[staff.status];

  return (
    <RowActionsMenu
      items={[edit, middle, remove]}
      ariaLabel={`Actions for ${staff.name}`}
      disabled={disabled}
    />
  );
}
