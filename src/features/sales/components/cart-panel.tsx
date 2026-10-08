"use client";

import { MinusIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { TextInput } from "@/components/form/app-fields";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  calculateCartTotals,
  type CartLine,
  type DiscountMode,
  type SalePayment,
} from "../types";

interface CartPanelProps {
  lines: CartLine[];
  discountMode: DiscountMode;
  discountValue: number;
  payments: SalePayment[];
  paymentAmount: string;
  paymentMethod: SalePayment["method"];
  submitting: boolean;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveLine: (productId: string) => void;
  onClear: () => void;
  onDiscountModeChange: (mode: DiscountMode) => void;
  onDiscountValueChange: (value: number) => void;
  onPaymentAmountChange: (value: string) => void;
  onPaymentMethodChange: (method: SalePayment["method"]) => void;
  onAddPayment: () => void;
  onPayRemaining: () => void;
  onRemovePayment: (index: number) => void;
  onConfirm: () => void;
}

export function CartPanel({
  lines,
  discountMode,
  discountValue,
  payments,
  paymentAmount,
  paymentMethod,
  submitting,
  onQuantityChange,
  onRemoveLine,
  onClear,
  onDiscountModeChange,
  onDiscountValueChange,
  onPaymentAmountChange,
  onPaymentMethodChange,
  onAddPayment,
  onPayRemaining,
  onRemovePayment,
  onConfirm,
}: CartPanelProps) {
  const { subtotal, discount, vat, total } = calculateCartTotals(
    lines,
    discountMode,
    discountValue,
  );
  const paid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = Math.max(0, total - paid);

  return (
    <aside className="flex h-fit flex-col gap-4 rounded-xl bg-surface p-5 lg:sticky lg:top-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink-1">Cart</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={lines.length === 0}
          aria-label="Clear cart"
          className="rounded-full p-1 text-ink-3 transition-colors hover:bg-surface-muted hover:text-ink-1 disabled:pointer-events-none disabled:opacity-40"
        >
          <XIcon className="size-5" />
        </button>
      </div>

      {lines.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-3">Tap a product to add it to the sale.</p>
      ) : (
        <ul className="flex max-h-[280px] flex-col gap-3 overflow-y-auto">
          {lines.map((line) => (
            <li key={line.productId} className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink-1">{line.name}</p>
                <p className="text-xs text-ink-4">
                  {formatCurrency(line.unitPrice)} / {line.unit}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  aria-label={`Decrease ${line.name}`}
                  onClick={() => onQuantityChange(line.productId, line.quantity - 1)}
                  className="flex size-6 items-center justify-center rounded border border-border text-ink-2 transition-colors hover:bg-surface-muted"
                >
                  <MinusIcon className="size-3" />
                </button>
                <span className="w-7 text-center text-sm text-ink-1">{line.quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase ${line.name}`}
                  onClick={() => onQuantityChange(line.productId, line.quantity + 1)}
                  className="flex size-6 items-center justify-center rounded border border-border text-ink-2 transition-colors hover:bg-surface-muted"
                >
                  <PlusIcon className="size-3" />
                </button>
              </div>

              <button
                type="button"
                aria-label={`Remove ${line.name}`}
                onClick={() => onRemoveLine(line.productId)}
                className="shrink-0 rounded p-1 text-ink-4 transition-colors hover:bg-danger-bg hover:text-danger-fg"
              >
                <Trash2Icon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="discount" className="text-sm text-ink-2">
          Discount
        </label>
        <div className="flex items-center gap-2">
          <TextInput
            id="discount"
            type="number"
            min={0}
            value={discountValue}
            onChange={(event) => onDiscountValueChange(Number(event.target.value) || 0)}
            className="h-10"
          />
          <div className="flex shrink-0 overflow-hidden rounded-lg border border-border">
            {(["amount", "percentage"] as DiscountMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={discountMode === mode}
                onClick={() => onDiscountModeChange(mode)}
                className={cn(
                  "size-10 text-sm font-medium transition-colors",
                  discountMode === mode
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface text-ink-2 hover:bg-surface-muted",
                )}
              >
                {mode === "amount" ? "₦" : "%"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <dl className="flex flex-col gap-1 text-sm">
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        {discount > 0 && <Row label="Discount" value={`-${formatCurrency(discount)}`} />}
        <Row label="VAT" value={formatCurrency(vat)} />
      </dl>

      <div className="border-t border-dashed border-border pt-3">
        <div className="flex items-baseline justify-between">
          <span className="text-lg font-semibold text-ink-1">Total</span>
          <span className="text-2xl font-semibold text-ink-1">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-ink-2">Payment</p>

        {payments.length > 0 && (
          <ul className="flex flex-col gap-1">
            {payments.map((payment, index) => (
              <li
                key={`${payment.method}-${index}`}
                className="flex items-center justify-between rounded-md bg-surface-muted px-3 py-2 text-xs"
              >
                <span className="text-ink-2 capitalize">{payment.method}</span>
                <span className="flex items-center gap-2 text-ink-1">
                  {formatCurrency(payment.amount)}
                  <button
                    type="button"
                    aria-label="Remove payment"
                    onClick={() => onRemovePayment(index)}
                    className="text-ink-4 transition-colors hover:text-danger-fg"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2">
          <TextInput
            aria-label="Payment amount"
            type="number"
            min={0}
            placeholder="Amount"
            value={paymentAmount}
            onChange={(event) => onPaymentAmountChange(event.target.value)}
            className="h-10"
          />
          <select
            aria-label="Payment method"
            value={paymentMethod}
            onChange={(event) =>
              onPaymentMethodChange(event.target.value as SalePayment["method"])
            }
            className="h-10 shrink-0 rounded-lg border border-border bg-surface px-3 text-sm text-ink-1 outline-none focus-visible:border-primary"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <SecondaryButton fullWidth className="h-10" onClick={onAddPayment}>
            Add payment
          </SecondaryButton>
          <SecondaryButton fullWidth className="h-10" onClick={onPayRemaining}>
            Pay remaining in full
          </SecondaryButton>
        </div>

        {outstanding > 0 && payments.length > 0 && (
          <p className="text-xs text-ink-3">
            Outstanding after payments: {formatCurrency(outstanding)} — this will be invoiced on
            credit.
          </p>
        )}
      </div>

      <PrimaryButton
        fullWidth
        className="h-12"
        disabled={lines.length === 0}
        loading={submitting}
        onClick={onConfirm}
      >
        Confirm sale
      </PrimaryButton>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-3">{label}</dt>
      <dd className="text-ink-1">{value}</dd>
    </div>
  );
}
