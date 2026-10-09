"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { z } from "zod";
import { ConfirmModal } from "@/components/common/confirm-modal";
import type { StaffMember } from "@/types/staff";

interface Props {
  staff: StaffMember | null;
  onClose: () => void;
  onConfirm: (id: string, email: string) => Promise<void>;
}

const emailSchema = z.string().trim().email("Enter a valid email address");

export function ResendInvitationModal({ staff, onClose, onConfirm }: Props) {
  const [editing, setEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (staff) {
      setEmail(staff.email);
      setEditing(false);
      setError(null);
    }
  }, [staff]);

  const handleConfirm = async () => {
    if (!staff) return false;
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return false; // keep the modal open
    }
    await onConfirm(staff.id, parsed.data);
  };

  return (
    <ConfirmModal
      open={!!staff}
      onClose={onClose}
      onConfirm={handleConfirm}
      icon={<Mail size={16} />}
      title="Resend Invitation?"
      description={
        editing ? (
          "Send the invitation to a different email address."
        ) : (
          <>Invitation email will be resent to {email}</>
        )
      }
      note={
        !editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="font-medium hover:underline"
          >
            Change Email
          </button>
        )
      }
      confirmLabel="Resend Invitation"
    >
      {editing && (
        <div className="mt-3">
          <input
            type="email"
            value={email}
            autoFocus
            placeholder="name@gmail.com"
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className="h-10 w-full rounded-md border border-emerald-600 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      )}
    </ConfirmModal>
  );
}
