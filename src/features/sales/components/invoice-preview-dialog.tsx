"use client";

import { CheckIcon, PrinterIcon, Share2Icon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatDate } from "@/lib/format";
import { BUSINESS_PROFILE } from "../mock-data";
import { getBalanceDue, type Invoice } from "../types";

interface InvoicePreviewDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Shown above the document right after a sale is confirmed. */
  confirmation?: string;
}

export function InvoicePreviewDialog({
  invoice,
  open,
  onOpenChange,
  confirmation,
}: InvoicePreviewDialogProps) {
  const toast = useToast();

  if (!invoice) return null;

  const balance = getBalanceDue(invoice);

  async function handleShare() {
    if (!invoice) return;
    const summary = `${invoice.number} — ${formatCurrency(invoice.total)} for ${invoice.customerName}`;
    try {
      await navigator.clipboard.writeText(summary);
      toast.add({
        type: "success",
        title: "Copied to clipboard",
        description: summary,
      });
    } catch {
      toast.add({
        type: "error",
        title: "Couldn't copy",
        description: "Your browser blocked clipboard access.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex h-[926px] max-h-[calc(100vh-1rem)] w-[950px] min-w-0 max-w-[calc(100vw-1rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[calc(100vw-1rem)]"
      >
        <DialogTitle className="sr-only">Invoice {invoice.number}</DialogTitle>

        <div className="min-h-0 flex-1 overflow-y-auto px-8 pt-[88px] pb-6 sm:px-[92px]">
          <p className="mb-4 flex items-start gap-2 rounded-xl bg-neutral-200 px-4 py-3 text-sm text-ink-2">
              <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
              {confirmation ?? `${invoice.number} created for ${formatCurrency(invoice.total)}. Stock updated, ledger written, audit event recorded.`}
          </p>

          {/* The document sits on a dark mat, as a print preview would. */}
          <div className="rounded-xl bg-neutral-800 p-5 sm:px-24 sm:py-5">
            <article className="min-h-[670px] overflow-hidden rounded-md bg-white p-8 text-ink-1">
              <header className="flex items-start justify-between gap-6">
                <div className="flex gap-3">
                  <span
                    aria-hidden
                    className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground"
                  >
                    R
                  </span>
                  <div className="text-xs leading-relaxed text-ink-2">
                    <p className="text-sm font-semibold text-ink-1">Donquixote.CO</p>
                    <p>14 Aminu Kano Crescent, Wuse II, Abuja</p>
                    <p>
                      {BUSINESS_PROFILE.phone} · {BUSINESS_PROFILE.email}
                    </p>
                    <p>{BUSINESS_PROFILE.taxId}</p>
                  </div>
                </div>

                <div className="shrink-0 text-right text-xs text-ink-2">
                  <p className="text-xl font-bold tracking-wide text-primary">INVOICE</p>
                  <p className="mt-1 font-semibold text-ink-1">{invoice.number}</p>
                  <p>Date: {formatDate(invoice.issueDate)}</p>
                  <p>Due: {formatDate(invoice.dueDate)}</p>
                </div>
              </header>

              <section className="mt-8">
                <p className="text-xs text-ink-3">Billed to</p>
                <p className="text-sm font-semibold text-ink-1">{invoice.customerName}</p>
              </section>

              <table className="mt-6 w-full border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-ink-3">
                    <th className="py-2 text-left font-normal">Item</th>
                    <th className="py-2 text-right font-normal">Qty</th>
                    <th className="py-2 text-right font-normal">Unit price</th>
                    <th className="py-2 text-right font-normal">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lines.map((line) => (
                    <tr key={line.productId} className="border-b border-neutral-100">
                      <td className="py-3 pr-4">
                        <p className="text-ink-1">{line.name}</p>
                        <p className="text-[11px] text-ink-4">{line.sku}</p>
                      </td>
                      <td className="py-3 text-right text-ink-2">{line.quantity}</td>
                      <td className="py-3 text-right text-ink-2">
                        {formatCurrency(line.unitPrice)}
                      </td>
                      <td className="py-3 text-right text-ink-2">{formatCurrency(line.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <section className="mt-6 ml-auto w-full max-w-[280px] text-xs">
                <Row label="Subtotal" value={formatCurrency(invoice.subtotal)} />
                <Row label="VAT" value={formatCurrency(invoice.vat)} />
                <div className="my-2 border-t border-dashed border-neutral-300" />
                <Row label="Total" value={formatCurrency(invoice.total)} strong />
                <Row label="Paid" value={formatCurrency(invoice.amountPaid)} />
                <Row label="Balance due" value={formatCurrency(balance)} strong />
              </section>

              <p className="mt-8 text-center text-[11px] text-ink-4">
                Thank you for your business. Please quote {invoice.number} when making payment.
              </p>
            </article>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-border/60 p-6">
          <SecondaryButton leftIcon={<Share2Icon className="size-4" />} onClick={handleShare}>
            Share
          </SecondaryButton>
          <PrimaryButton
            leftIcon={<PrinterIcon className="size-4" />}
            onClick={() => window.print()}
          >
            Print
          </PrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={strong ? "font-semibold text-ink-1" : "text-ink-2"}>{label}</span>
      <span className={strong ? "font-semibold text-ink-1" : "text-ink-2"}>{value}</span>
    </div>
  );
}
