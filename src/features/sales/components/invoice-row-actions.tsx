"use client";

import { BanIcon, EyeIcon, MoreHorizontalIcon, Share2Icon, WalletIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInvoiceStatus, type Invoice } from "../types";

export type InvoiceAction = "view" | "payment" | "share" | "cancel";

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
          View Invoice
        </DropdownMenuItem>
        <DropdownMenuItem disabled={settled} onClick={() => onAction("payment", invoice)}>
          <WalletIcon />
          Record Payment
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction("share", invoice)}>
          <Share2Icon />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={status === "cancelled"}
          onClick={() => onAction("cancel", invoice)}
        >
          <BanIcon />
          Cancel Invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
