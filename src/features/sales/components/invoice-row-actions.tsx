"use client";

import { ArchiveIcon, BellIcon, EyeIcon, MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInvoiceStatus, type Invoice } from "../types";

export type InvoiceAction = "view" | "remind" | "archive";

interface InvoiceRowActionsProps {
  invoice: Invoice & { cancelled?: boolean };
  onAction: (action: InvoiceAction, invoice: Invoice) => void;
}

export function InvoiceRowActions({ invoice, onAction }: InvoiceRowActionsProps) {
  const status = getInvoiceStatus(invoice);
  const settled = status === "paid" || status === "cancelled";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${invoice.number}`}
        className="flex size-8 items-center justify-center rounded-lg text-ink-2 transition-colors hover:bg-surface-muted data-popup-open:bg-surface-muted"
      >
        <MoreHorizontalIcon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onAction("view", invoice)}>
          <EyeIcon />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem disabled={settled} onClick={() => onAction("remind", invoice)}>
          <BellIcon />
          Send Payment Reminder
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={status === "cancelled"}
          onClick={() => onAction("archive", invoice)}
        >
          <ArchiveIcon />
          Archive Invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
