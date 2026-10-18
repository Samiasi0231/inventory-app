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
  className?: string;
}

export const DIALOG_SHELL =
  "flex h-[min(680px,calc(100dvh-2rem))] w-[min(960px,calc(100vw-2rem))] max-w-none flex-col gap-0 p-0 sm:max-w-none";

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
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border/60 p-6 [&>*:first-child]:mr-auto">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
