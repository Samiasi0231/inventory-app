"use client";

import { PauseCircle } from "lucide-react";
import { ConfirmModal } from "@/components/common/confirm-modal";
import type { StaffMember } from "@/types/staff";

interface Props {
  staff: StaffMember | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function SuspendAccessModal({ staff, onClose, onConfirm }: Props) {
  return (
    <ConfirmModal
      open={!!staff}
      onClose={onClose}
      onConfirm={() => (staff ? onConfirm(staff.id) : undefined)}
      icon={<PauseCircle size={16} />}
      title="Suspend Access?"
      description={`${staff?.name} will no longer be able to sign in or access RIINOX until their access is restored.`}
      note="Their records and activity history will be retained."
      confirmLabel="Suspend Access"
    />
  );
}
