"use client";

import { useState, type FormEvent } from "react";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, TextInput, TextareaInput } from "@/components/form/app-fields";
import { useToast } from "@/components/ui/toast";
import { formatNumber, formatDate } from "@/lib/format";
import { getOrderBalance, type SalesOrder } from "../order-types";
import { ordersService } from "../orders.service";
import { OrderStatusBadge } from "./order-status-badge";

function receivedDate(value: string) {
  const formatted = formatDate(value);
  const day = Number(formatted.split(" ")[0]);
  const suffix = day % 100 >= 11 && day % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[day % 10] ?? "th");
  return formatted.replace(/^\d+/, `${day}${suffix}`);
}

export function OrderDecisionDialog({ order, kind, onClose, onSuccess }: {
  order: SalesOrder;
  kind: "reject" | "changes";
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [note, setNote] = useState("");
  const [price, setPrice] = useState("");
  const [priceFocused, setPriceFocused] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const proposing = kind === "changes";
  const title = proposing ? "Propose changes" : "Reject order";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(price.replace(/,/g, ""));
    if (proposing && (!Number.isFinite(amount) || amount <= 0)) {
      setError("Enter a new price greater than zero.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (proposing) await ordersService.proposeChanges(order.id, note, amount);
      else await ordersService.rejectOrder(order.id, note);
      onSuccess();
      onClose();
      toast.add({ type: "success", title: proposing ? "Changes proposed" : "Order rejected" });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <FormDialog
      open
      onOpenChange={open => { if (!open && !busy) onClose(); }}
      title={title}
      description={proposing ? "Propose changes to order price" : "Reject a sales order and state your reason"}
      className={`order-decision-dialog ${proposing ? "order-propose-dialog" : "order-reject-dialog"}`}
      footer={
        <>
          <SecondaryButton disabled={busy} onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" form="order-decision-form" disabled={busy}>
            {busy ? "Saving…" : proposing ? "Send" : "Reject Order"}
          </PrimaryButton>
        </>
      }
    >
      <form id="order-decision-form" onSubmit={submit}>
        <div className="decision-order">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold leading-6">#{order.orderId}</h3>
            <OrderStatusBadge status={order.status} detail />
          </div>
          <p className="mt-2 text-sm leading-5 text-ink-3">Date Received: {receivedDate(order.orderDate)}</p>
        </div>

        <dl className="decision-totals">
          {[
            ["Order Total", order.total],
            ["Already Paid", order.amountPaid],
            ["Balance Due", getOrderBalance(order)],
          ].map(([label, amount]) => (
            <div key={label} className="flex items-center justify-between gap-4 text-base leading-6">
              <dt className="text-ink-3">{label}</dt>
              <dd className="font-medium text-ink-1">₦{formatNumber(Number(amount))}</dd>
            </div>
          ))}
        </dl>

        {proposing && (
          <Field label="New Price" htmlFor="decision-price" error={error || undefined} className="decision-price">
            <TextInput
              id="decision-price"
              inputMode="decimal"
              autoComplete="off"
              placeholder="₦0"
              value={priceFocused || !price || !Number.isFinite(Number(price)) ? price : `₦${formatNumber(Number(price))}`}
              onFocus={() => setPriceFocused(true)}
              onBlur={() => setPriceFocused(false)}
              onChange={event => {
                const raw = event.target.value.replace(/[₦,]/g, "");
                if (/^\d*(\.\d{0,2})?$/.test(raw)) { setPrice(raw); setError(""); }
              }}
              invalid={Boolean(error)}
              aria-required="true"
            />
          </Field>
        )}

        <div className="decision-note">
          <label htmlFor="decision-note" className="text-sm leading-5 text-ink-1">
            Note <span className="text-xs text-ink-3">(optional)</span>
          </label>
          <TextareaInput
            id="decision-note"
            placeholder="Note"
            maxLength={500}
            value={note}
            onChange={event => setNote(event.target.value)}
            aria-describedby="decision-note-count"
          />
          <p id="decision-note-count" className="mt-2 text-xs leading-4 text-ink-4">{note.length}/500</p>
        </div>
        {!proposing && error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </form>
    </FormDialog>
  );
}
