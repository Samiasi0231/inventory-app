"use client";

import { PrinterIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { formatCurrency } from "@/lib/format";
import { BUSINESS_PROFILE } from "../mock-data";
import { PAYMENT_METHODS } from "../types";
import type { Receipt } from "../receipts.service";

interface ReceiptDialogProps {
  receipt: Receipt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Heading above the document; "Sale confirmed" right after a sale. */
  title?: string;
  onViewSale?: () => void;
}

export function ReceiptDialog({
  receipt,
  open,
  onOpenChange,
  title = "Receipt",
  onViewSale,
}: ReceiptDialogProps) {
  if (!receipt) return null;

  const method =
    PAYMENT_METHODS.find((entry) => entry.value === receipt.method)?.label ?? receipt.method;
  const balance = Math.max(0, receipt.invoiceTotal - receipt.amount);
  const issued = new Date(receipt.issuedAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-[560px]"
      >
        <div className="border-b border-border/60 p-6">
          <DialogTitle className="text-lg font-semibold text-ink-1">{title}</DialogTitle>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <article className="mx-auto max-w-[360px] text-ink-1">
            <header className="text-center">
              <p className="text-sm font-semibold">{BUSINESS_PROFILE.name}</p>
              <p className="mt-1 text-[11px] text-ink-3">{BUSINESS_PROFILE.address}</p>
              <p className="text-[11px] text-ink-3">{BUSINESS_PROFILE.phone}</p>
            </header>

            <div className="my-4 border-t border-dashed border-neutral-300" />

            <div className="text-center">
              <p className="text-xs tracking-wide text-ink-2">PAYMENT RECEIPT</p>
              <p className="mt-1 text-2xl font-semibold">{formatCurrency(receipt.amount)}</p>
            </div>

            <dl className="mt-5 space-y-1.5 text-[11px]">
              <Row label="Receipt no." value={receipt.number} />
              <Row
                label="Date"
                value={issued.toLocaleString("en-NG", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
              <Row label="Method" value={method} />
              <Row label="Invoice" value={receipt.invoiceNumber} />
              <Row label="Customer" value={receipt.customerName} />
              <Row label="Received by" value={receipt.receivedBy} />
            </dl>

            <div className="my-4 border-t border-dashed border-neutral-300" />

            <dl className="space-y-1.5 text-[11px]">
              {receipt.lines.map((line) => (
                <Row
                  key={line.description}
                  label={line.description}
                  value={formatCurrency(line.amount)}
                />
              ))}
            </dl>

            <div className="my-4 border-t border-dashed border-neutral-300" />

            <dl className="space-y-1.5 text-[11px]">
              <Row label="Invoice total" value={formatCurrency(receipt.invoiceTotal)} />
              <Row label="Balance after this payment" value={formatCurrency(balance)} strong />
            </dl>

            <p className="mt-6 text-center text-[11px] text-ink-3">
              Thank you for your business.
            </p>
          </article>
        </div>

        <div className="flex justify-end gap-3 border-t border-border/60 p-6">
          <SecondaryButton
            leftIcon={<PrinterIcon className="size-4" />}
            onClick={() => window.print()}
          >
            Print
          </SecondaryButton>
          {onViewSale && <PrimaryButton onClick={onViewSale}>View sale</PrimaryButton>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className={strong ? "font-semibold text-ink-1" : "text-ink-2"}>{label}</dt>
      <dd className={strong ? "shrink-0 font-semibold text-ink-1" : "shrink-0 text-ink-1"}>
        {value}
      </dd>
    </div>
  );
}
