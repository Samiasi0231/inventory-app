"use client";

import { MinusCircle } from "lucide-react";
import { ConfirmModal } from "@/components/common/confirm-modal";
import type { StaffMember } from "@/types/staff";

interface Props {
  staff: StaffMember | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function RemoveStaffModal({ staff, onClose, onConfirm }: Props) {
  return (
    <ConfirmModal
      open={!!staff}
      onClose={onClose}
      onConfirm={() => {
        if (!staff) return;
        return onConfirm(staff.id);
      }}
      icon={<MinusCircle size={16} />}
      title="Remove Staff?"
      description={`Removing ${staff?.name} will revoke their access to this business.`}
      note="Their historical transactions and activity records will be retained."
      confirmLabel="Remove Staff"
    />
  );
}
