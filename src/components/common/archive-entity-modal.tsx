"use client";

import { Archive } from "lucide-react";
import { ConfirmModal } from "./confirm-modal";

interface Props {
  /** "Customer" | "Supplier" */
  entityLabel: string;
  /** The record being archived; null keeps the modal closed */
  entity: { id: string; name: string } | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function ArchiveEntityModal({
  entityLabel,
  entity,
  onClose,
  onConfirm,
}: Props) {
  return (
    <ConfirmModal
      open={!!entity}
      onClose={onClose}
      onConfirm={() => (entity ? onConfirm(entity.id) : undefined)}
      icon={<Archive size={16} />}
      title={`Archive ${entityLabel}?`}
      description={`${entity?.name} will be removed from your active ${entityLabel.toLowerCase()} list.`}
      note="Their transaction history and records will be retained."
      confirmLabel={`Archive ${entityLabel}`}
    />
  );
}
