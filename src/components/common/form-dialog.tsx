"use client";

import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const DIALOG_SHELL =
  "flex h-[926px] max-h-[calc(100vh-1rem)] w-[950px] min-w-0 max-w-[calc(100vw-1rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[calc(100vw-1rem)]";

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  overlayClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  className,
  overlayClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  bodyClassName,
  footerClassName,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton overlayClassName={overlayClassName} className={cn(DIALOG_SHELL, className)}>
        <div className={cn("flex shrink-0 flex-col gap-1 border-b border-border/60 p-6 pr-14", headerClassName)}>
          <DialogTitle className={cn("text-xl font-bold text-ink-1", titleClassName)}>{title}</DialogTitle>
          {description && (
            <DialogDescription className={cn("text-sm text-ink-3", descriptionClassName)}>{description}</DialogDescription>
          )}
        </div>

        <div className={cn("min-h-0 flex-1 overflow-y-auto p-6", bodyClassName)}>{children}</div>

        {footer && (
          <div className={cn("flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-border/60 p-6 [&>*:first-child]:mr-auto", footerClassName)}>
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
