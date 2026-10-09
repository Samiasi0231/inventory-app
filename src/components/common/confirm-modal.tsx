"use client";

import { useState, type ReactNode } from "react";
import { PrimaryButton } from "@/components/button";
import { Modal } from "../ui/modal";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * Runs when the confirm button is clicked. The modal shows a loading state while it runs
   * and closes afterwards — unless it returns `false` (e.g. validation failed).
   */
  onConfirm: () => void | boolean | Promise<void | boolean>;
  icon: ReactNode;
  title: string;
  description: ReactNode;
  note?: ReactNode;
  confirmLabel: string;
  /** Optional extra content between the text and the footer */
  children?: ReactNode;
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
  children,
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const result = await onConfirm();
      if (result !== false) onClose();
    } finally {
      setLoading(false);
    }
  };

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
        <PrimaryButton onClick={handleConfirm} disabled={loading}>
          {loading ? "Please wait..." : confirmLabel}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
