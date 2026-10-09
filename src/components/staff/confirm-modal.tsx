import type { ReactNode } from "react";
import { PrimaryButton } from "@/components/button";
import { Modal } from "../ui/modal";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  icon: ReactNode;
  title: string;
  description: ReactNode;
  note?: ReactNode;
  confirmLabel: string;
  loading?: boolean;
  children?: ReactNode;
  confirmDisabled?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  icon,
  title,
  description,
  note,
  confirmLabel,
  loading,
  children,
  confirmDisabled,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} locked={loading}>
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-2 text-sm text-gray-700">{description}</p>
      {note && <div className="mt-1 text-[11px] text-emerald-700">{note}</div>}
      {children}
      <div className="mt-8 flex justify-end">
        <PrimaryButton
          onClick={onConfirm}
          disabled={loading || confirmDisabled}
        >
          {loading ? "Please wait..." : confirmLabel}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
