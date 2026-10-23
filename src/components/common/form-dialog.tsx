"use client";

import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const DIALOG_SHELL = "flex max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl flex-col overflow-hidden p-0";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Sticky action row at the bottom, outside the scrolling body. */
  footer?: ReactNode;
  children: ReactNode;
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
      <DialogContent showCloseButton className={cn(DIALOG_SHELL, className)}>
        <div className="flex shrink-0 flex-col gap-1 border-b border-border/60 p-6 pr-14">
          <DialogTitle className="text-xl font-bold text-ink-1">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm text-ink-3">{description}</DialogDescription>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">{children}</div>

        {footer && (
          <div className="flex items-center justify-between gap-3 border-t border-border/60 p-6">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
