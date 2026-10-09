import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  locked?: boolean;
}

export function Modal({
  open,
  onClose,
  children,
  className,
  locked,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !locked) onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, locked]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !locked) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          "relative w-full max-w-[520px] rounded-xl bg-white p-6 shadow-xl",
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={locked}
          aria-label="Close"
          className="absolute right-4 top-4 rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
        >
          <X size={16} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
