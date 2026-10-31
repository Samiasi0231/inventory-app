"use client";

import { useState } from "react";
import { CheckIcon, MinusIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { TextInput } from "@/components/form/app-fields";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatNaira } from "@/lib/format";
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
  onEditLine?: (line: CartLine) => void;
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
  onEditLine,
  onDiscountModeChange,
  onDiscountValueChange,
  onPaymentAmountChange,
  onPaymentMethodChange,
  onAddPayment,
  onPayRemaining,
  onRemovePayment,
  onConfirm,
}: CartPanelProps) {
  const [paymentFocused, setPaymentFocused] = useState(false);
  const { subtotal, discount, vat, total } = calculateCartTotals(
    lines,
    discountMode,
    discountValue,
    0,
  );
  const paid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = Math.max(0, total - paid);
  const fullyPaid = total > 0 && outstanding < 0.01;
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const paymentMethodLabel =
    paymentMethod === "card" ? "POS" : paymentMethod === "transfer" ? "Bank Transfer" : "Cash";

  return (
    <aside className="flex h-fit min-w-0 flex-col gap-4 rounded-xl bg-surface p-5 xl:min-h-[546px] xl:sticky xl:top-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg leading-6 font-semibold text-ink-1">
          Cart{lines.length > 0 && <span className="ml-1 text-xs font-normal text-ink-3">· {itemCount} items</span>}
    <aside className="flex h-fit min-w-0 flex-col gap-0 rounded-xl bg-surface p-5 xl:min-h-[780px] xl:sticky xl:top-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg leading-6 font-semibold text-ink-1">
          Cart{lines.length > 0 && <span className="ml-1 text-xs font-normal text-ink-3">{itemCount} {itemCount === 1 ? "item" : "items"}</span>}
        </h2>
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear cart"
          className="rounded-full p-0 text-ink-3 transition-colors hover:bg-surface-muted hover:text-ink-1 disabled:pointer-events-none disabled:opacity-40"
        >
          <XIcon className="size-[26px] stroke-[1.75]" />
        </button>
      </div>

      <p className="mt-[46px] mb-6 text-center text-base text-ink-2">Tap a product to add it to the sale.</p>
      {lines.length > 0 && (
        <ul className="mb-3 flex max-h-[300px] flex-col gap-4 overflow-y-auto">
          {lines.map((line) => (
            <li key={line.lineId ?? line.productId} className="block">
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p title={line.name} className="truncate text-sm font-semibold text-ink-1">{line.name.split(" · ")[0]}</p>
                  <p className="shrink-0 text-sm font-semibold text-ink-1">{formatNaira(line.unitPrice * line.quantity)}</p>
                </div>
                <p className="mt-1 text-sm text-ink-2">
                  {formatNaira(line.unitPrice)} / Item
                  {onEditLine && <button type="button" onClick={() => onEditLine(line)} className="ml-2 text-primary">Change</button>}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex h-5 shrink-0 items-center gap-2 rounded border border-[#dedede] px-[3px]">
                    <button type="button" aria-label={`Decrease ${line.name}`} onClick={() => onQuantityChange(line.lineId ?? line.productId, line.quantity - 1)} className="flex h-[14px] w-[12px] items-center justify-center rounded bg-primary text-white">
                      <MinusIcon className="size-3" />
                    </button>
                    <span className="min-w-3 text-center text-sm font-medium text-ink-1">{line.quantity}</span>
                    <button type="button" aria-label={`Increase ${line.name}`} onClick={() => onQuantityChange(line.lineId ?? line.productId, line.quantity + 1)} className="flex h-[14px] w-[12px] items-center justify-center rounded bg-primary text-white">
                      <PlusIcon className="size-3" />
                    </button>
                  </div>
                  <button type="button" aria-label={`Remove ${line.name}`} onClick={() => onRemoveLine(line.lineId ?? line.productId)} className="shrink-0 rounded p-1 text-ink-4 transition-colors hover:bg-danger-bg hover:text-danger-fg">
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="discount" className="text-sm font-semibold text-ink-2">
          Discount
        </label>
        <div className="flex items-center gap-2">
          <TextInput
            id="discount"
            type="number"
            min={0}
            value={discountValue}
            onChange={(event) => onDiscountValueChange(Number(event.target.value) || 0)}
            className="h-11"
          />
          <div className="flex shrink-0 overflow-hidden rounded-lg border border-border">
            {(["amount", "percentage"] as DiscountMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={discountMode === mode}
                onClick={() => onDiscountModeChange(mode)}
                className={cn(
                  "h-[42px] w-9 text-sm font-medium transition-colors",
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

      <dl className="mt-3 flex flex-col gap-2 text-sm">
        <Row label="Subtotal" value={formatCurrency(subtotal)} />
        {discount > 0 && <Row label="Discount" value={`-${formatCurrency(discount)}`} />}
        <Row label="VAT" value={formatCurrency(vat)} />
      </dl>

      <div className="mt-3 border-t border-dashed border-[#999] pt-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-semibold text-ink-1">Total</span>
          <span className="text-2xl font-semibold text-ink-1">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <p className="text-sm font-semibold text-ink-2">Payment</p>

        {payments.length > 0 && !fullyPaid && (
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
            type="text"
            inputMode="decimal"
            placeholder="Amount"
            value={
              paymentFocused || !paymentAmount
                ? paymentAmount
                : formatNaira(Number(paymentAmount) || 0)
            }
            onFocus={() => setPaymentFocused(true)}
            onBlur={() => setPaymentFocused(false)}
            onChange={(event) => onPaymentAmountChange(event.target.value.replace(/[^\d.]/g, ""))}
            className="h-[46px]"
          />
          <Select
            value={paymentMethod}
            onValueChange={(value) => onPaymentMethodChange(value as SalePayment["method"])}
          >
            <SelectTrigger aria-label="Payment method" className="h-[46px]! w-[114px] shrink-0">
              <SelectValue>{paymentMethodLabel}</SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">POS</SelectItem>
              <SelectItem value="transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <SecondaryButton fullWidth className="h-[34px] text-sm font-normal text-ink-2" onClick={onAddPayment}>
            Add payment
          </SecondaryButton>
          <SecondaryButton fullWidth className="h-[34px] text-sm font-normal text-ink-2" onClick={onPayRemaining}>
            Pay remaining in full
          </SecondaryButton>
        </div>

        {fullyPaid && (
          <div className="flex min-h-[42px] items-center gap-3 rounded-lg border border-[#1597ee] bg-[#c9e3fc] px-4 py-2.5 text-sm text-[#1689d6]" role="status">
            <CheckIcon className="size-4" />
            <span>Fully paid.</span>
          </div>
        )}

        {outstanding > 0 && payments.length > 0 && (
          <p className="text-xs text-ink-3">
            Outstanding after payments: {formatCurrency(outstanding)} — this will be invoiced on
            credit.
          </p>
        )}
      </div>

      <PrimaryButton
        fullWidth
        className="mt-[10px] h-12 text-base"
        loading={submitting}
        disabled={lines.length === 0 || submitting}
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
