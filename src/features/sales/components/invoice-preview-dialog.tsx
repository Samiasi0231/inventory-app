"use client";

import { CheckIcon, PrinterIcon, ForwardIcon, XIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatDate } from "@/lib/format";
import { BUSINESS_PROFILE, MOCK_CUSTOMERS } from "../mock-data";
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
  const customer = MOCK_CUSTOMERS.find((entry) => entry.id === invoice.customerId);

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
        showCloseButton={false}
        overlayClassName="bg-black/25! backdrop-blur-none!"
        className="sale-invoice-dialog flex h-[942px] max-h-[calc(100vh-1rem)] w-[986px] min-w-0 max-w-[calc(100vw-1rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-[calc(100vw-1rem)]"
      >
        <DialogTitle className="sr-only">Invoice {invoice.number}</DialogTitle>
        <DialogClose aria-label="Close invoice" className="absolute top-[18px] right-[22px] flex size-6 items-center justify-center rounded text-ink-1 hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-primary"><XIcon className="size-[18px]" /></DialogClose>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-16 pb-6 sm:px-[90px] sm:pt-[88px]">
          <p className="mb-[14px] flex min-h-11 items-center gap-3 rounded-[10px] bg-[#dedede] px-4 py-2 text-sm text-ink-1">
              <CheckIcon className="size-4 shrink-0 text-ink-1" />
              {confirmation ?? <span><strong className="font-semibold">{invoice.number}</strong> created for {formatCurrency(invoice.total)}. Stock updated, ledger written, audit event recorded.</span>}
          </p>

          {/* The document sits on a dark mat, as a print preview would. */}
          <div className="invoice-preview-mat overflow-x-auto rounded-[10px] bg-[#2f2f2f] px-3 py-[18px] sm:px-[95px]">
            <article className="invoice-print flex min-w-[560px] sm:min-w-0 min-h-[671px] flex-col rounded-[5px] border border-[#dedede] bg-white p-4 text-ink-1 sm:px-[30px] sm:pt-[30px] sm:pb-[36px]">
              <header className="flex flex-wrap items-start justify-between gap-4 sm:flex-nowrap">
                <div className="flex items-center gap-[10px] pt-5">
                  <span
                    aria-hidden
                    className="flex size-[38px] shrink-0 items-center justify-center rounded-[9px] bg-primary text-xl font-bold text-primary-foreground"
                  >
                    R
                  </span>
                  <div className="text-[13px] leading-[21px] text-ink-1">
                    <p className="text-base font-semibold text-ink-1">Donquixote.CO</p>
                    <p>14 Aminu Kano Crescent, Wuse II, Abuja</p>
                    <p>
                      {BUSINESS_PROFILE.phone} · {BUSINESS_PROFILE.email}
                    </p>
                    <p>{BUSINESS_PROFILE.taxId}</p>
                  </div>
                </div>

                <div className="shrink-0 text-right text-[13px] leading-[21px] text-ink-1">
                  <p className="text-[22px] leading-7 font-bold text-[#006b39]">INVOICE</p>
                  <p className="mt-1 font-semibold text-ink-1">{invoice.number}</p>
                  <p>Date: {formatDate(invoice.issueDate)}</p>
                  <p>Due: {formatDate(invoice.dueDate)}</p>
                </div>
              </header>

              <section className="mt-[42px]">
                <p className="text-xs text-ink-3">Billed to</p>
                <p className="mt-0.5 text-sm text-ink-1"><strong className="font-semibold">{invoice.customerName}</strong>{customer?.phone && ` · ${customer.phone}`}</p>
              </section>

              <table className="mt-4 w-full border-collapse text-[13px]">
                <thead>
                  <tr className="border-b-2 border-[#2f2f2f] text-ink-3">
                    <th className="py-2 text-left font-normal">Item</th>
                    <th className="py-2 text-right font-normal">Qty</th>
                    <th className="py-2 text-right font-normal">Unit price</th>
                    <th className="py-2 text-right font-normal">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lines.map((line) => (
                    <tr key={`${line.productId}-${line.sku}-${line.unit}-${line.name}`} className="border-b border-[#e4eae7] last:border-0">
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

              <section className="mt-4 ml-auto w-full max-w-[280px] text-[13px]">
                <Row label="Subtotal" value={formatCurrency(invoice.subtotal)} />
                {invoice.subtotal + invoice.vat > invoice.total && <Row label="Discount" value={`−${formatCurrency(invoice.subtotal + invoice.vat - invoice.total)}`} />}
                <Row label="VAT" value={formatCurrency(invoice.vat)} />
                <div className="my-1 border-t-2 border-[#2f2f2f]" />
                <div className="text-base"><Row label="Total" value={formatCurrency(invoice.total)} strong /></div>
                <Row label="Paid" value={formatCurrency(invoice.amountPaid)} />
                <Row label="Balance due" value={formatCurrency(balance)} strong />
              </section>

              <p className="mt-auto pt-6 text-center text-xs text-ink-3">
                Thank you for your business. Please quote {invoice.number} when making payment.
              </p>
            </article>
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-3 px-6 pb-[14px] pt-0">
          <SecondaryButton className="h-12 min-w-[126px] text-base text-primary" leftIcon={<ForwardIcon className="size-[22px]" />} onClick={handleShare}>
            Share
          </SecondaryButton>
          <PrimaryButton
            className="h-12 min-w-[118px] text-base"
            leftIcon={<PrinterIcon className="size-[22px]" />}
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
