"use client";

import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Sticky action row at the bottom, outside the scrolling body. */
  footer?: ReactNode;
  children: ReactNode;
  /** Width override, e.g. "sm:max-w-[950px]". */
  className?: string;
}

/** Centred dialog with a fixed header, a scrolling body and a pinned footer. */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  className,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-[660px]",
          className,
        )}
      >
        <div className="flex flex-col gap-1 p-6 pb-4">
          <DialogTitle className="text-xl font-bold text-ink-1">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-ink-3">{description}</DialogDescription>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">{children}</div>

        {footer && (
          <div className="flex items-center justify-between gap-3 border-t border-border/60 p-6">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
