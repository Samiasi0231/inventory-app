"use client";

import Image from "next/image";
import { PrinterIcon, XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { formatCurrency } from "@/lib/format";
import { BUSINESS_PROFILE } from "../mock-data";
import { PAYMENT_METHODS } from "../types";
import type { Receipt } from "../receipts.service";

interface ReceiptDialogProps {
  receipt: Receipt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
        showCloseButton={false}
        className="receipt-dialog flex h-[926px] max-h-[calc(100vh-1rem)] w-[950px] min-w-0 max-w-[calc(100vw-1rem)] flex-col gap-0 overflow-hidden rounded-xl bg-surface-muted p-0 sm:max-w-[calc(100vw-1rem)]"
      >
        <header className="flex h-[77px] shrink-0 items-center justify-between border-b border-border bg-surface px-8">
          <DialogTitle className="text-lg font-semibold tracking-[0.14px] text-ink-1">
            {title}
          </DialogTitle>
          <DialogClose
            aria-label="Close receipt"
            className="flex size-9 items-center justify-center rounded-lg text-ink-1 transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-primary"
          >
            <XIcon className="size-5" />
          </DialogClose>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-11 sm:px-8">
          <article className="receipt-print mx-auto min-h-[596px] min-w-0 w-full max-w-[442px] overflow-hidden bg-white px-4 py-12 text-ink-1 sm:px-[10px] sm:py-[68px]">
            <header className="text-center">
              <Image
                src="/riinox-mark.png"
                alt="Riinox"
                width={22}
                height={22}
                className="mx-auto mb-1"
              />
              <p className="text-lg font-semibold leading-5">{BUSINESS_PROFILE.name}</p>
              <p className="mt-1 text-sm text-ink-1">{BUSINESS_PROFILE.address}</p>
              <p className="text-sm text-ink-1">{BUSINESS_PROFILE.phone}</p>
            </header>

            <div className="my-3 border-t border-dashed border-border" />

            <div className="text-center">
              <p className="text-base font-semibold tracking-[0.3px] text-ink-1">PAYMENT RECEIPT</p>
              <p className="mt-3 text-[28px] leading-8 font-semibold tabular-nums">
                {formatCurrency(receipt.amount)}
              </p>
            </div>

            <dl className="mt-3 space-y-1.5 text-sm tracking-[0.14px]">
              <Row label="Receipt no." value={receipt.number} />
              <Row
                label="Date"
                value={issued.toLocaleString("en-NG", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              />
              <Row label="Method" value={method} />
              <Row label="Invoice" value={receipt.invoiceNumber} />
              <Row label="Customer" value={receipt.customerName} />
              <Row label="Received by" value={receipt.receivedBy} />
            </dl>

            <div className="my-4 border-t border-dashed border-border" />

            <dl className="space-y-2 text-sm tracking-[0.14px]">
              {receipt.lines.map((line) => (
                <Row
                  key={line.description}
                  label={line.description}
                  value={formatCurrency(line.amount)}
                />
              ))}
            </dl>

            <div className="my-4 border-t border-dashed border-border" />

            <dl className="space-y-1.5 text-sm tracking-[0.14px]">
              <Row label="Invoice total" value={formatCurrency(receipt.invoiceTotal)} />
              {balance > 0 && (
                <Row label="Balance after this payment" value={formatCurrency(balance)} strong />
              )}
            </dl>

            <p className="mt-3 border-t border-dashed border-border pt-3 text-center text-sm text-ink-1">
              Thank you for your business.
            </p>
          </article>
        </div>

        <footer className="flex min-h-[77px] shrink-0 flex-wrap items-center justify-end gap-3 border-t border-border/60 bg-surface px-6 py-3">
          <SecondaryButton
            className="h-12 min-w-[120px] text-base text-primary"
            leftIcon={<PrinterIcon className="size-4" />}
            onClick={() => window.print()}
          >
            Print
          </SecondaryButton>
          {onViewSale && (
            <PrimaryButton className="h-12 min-w-[120px] text-base" onClick={onViewSale}>
              View sale
            </PrimaryButton>
          )}
        </footer>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className={strong ? "min-w-0 break-words font-semibold text-ink-1" : "min-w-0 break-words text-ink-2"}>{label}</dt>
      <dd className={strong ? "max-w-[48%] break-words text-right font-semibold text-ink-1" : "max-w-[48%] break-words text-right text-ink-1"}>
        {value}
      </dd>
    </div>
  );
}
