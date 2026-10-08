"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, SelectInput, TextInput, TextareaInput } from "@/components/form/app-fields";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/format";
import { purchasingService } from "../purchasing.service";
import { getPurchaseBalance, PURCHASE_PAYMENT_METHODS, type PurchaseOrder } from "../types";

const NOTE_LIMIT = 500;

interface RecordPaymentDialogProps {
  order: PurchaseOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RecordPaymentDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: RecordPaymentDialogProps) {
  const toast = useToast();
  const balance = getPurchaseBalance(order);

  const schema = z.object({
    amount: z.coerce
      .number()
      .positive("Enter an amount")
      .max(balance, `That is more than the ${formatCurrency(balance)} outstanding`),
    reference: z.string().optional(),
    method: z.string().min(1, "Select a payment method"),
    paymentDate: z.string().min(1, "Pick a payment date"),
    note: z.string().max(NOTE_LIMIT, `Keep notes under ${NOTE_LIMIT} characters`).optional(),
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: balance,
      reference: "",
      method: "",
      paymentDate: new Date().toISOString().slice(0, 10),
      note: "",
    },
  });

  const note = watch("note") ?? "";

  const onSubmit = handleSubmit(async (values) => {
    try {
      await purchasingService.recordPayment(order.id, Number(values.amount));
      toast.add({
        type: "success",
        title: "Payment recorded",
        description: `${formatCurrency(Number(values.amount))} against ${order.purchaseId}`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.add({
        type: "error",
        title: "Couldn't record payment",
        description: "Please try again.",
      });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Record Payment"
      description={`Record a payment for ${order.purchaseId} from ${order.supplierName}`}
      className="sm:max-w-[640px]"
      footer={
        <>
          <SecondaryButton onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={onSubmit} loading={isSubmitting}>
            Record Payment
          </PrimaryButton>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <dl className="flex flex-col gap-2 rounded-lg bg-accent p-4 text-sm">
          <SummaryRow label="Order Total" value={formatCurrency(order.totalAmount)} />
          <SummaryRow label="Already Paid" value={formatCurrency(order.amountPaid)} />
          <SummaryRow label="Balance Due" value={formatCurrency(balance)} />
        </dl>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Amount Paid" htmlFor="amount" required error={errors.amount?.message}>
            <TextInput
              id="amount"
              type="number"
              min={0}
              step="0.01"
              placeholder="₦0"
              invalid={!!errors.amount}
              {...register("amount")}
            />
          </Field>

          <Field label="Reference Number" htmlFor="reference">
            <TextInput id="reference" placeholder="0" {...register("reference")} />
          </Field>

          <Field label="Payment Method" htmlFor="method" required error={errors.method?.message}>
            <SelectInput id="method" invalid={!!errors.method} {...register("method")}>
              <option value="">Select Payment Method</option>
              {PURCHASE_PAYMENT_METHODS.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field
            label="Payment Date"
            htmlFor="paymentDate"
            required
            error={errors.paymentDate?.message}
          >
            <TextInput
              id="paymentDate"
              type="date"
              invalid={!!errors.paymentDate}
              {...register("paymentDate")}
            />
          </Field>
        </div>

        <Field
          label="Note (optional)"
          htmlFor="note"
          error={errors.note?.message}
          hint={`${note.length}/${NOTE_LIMIT}`}
        >
          <TextareaInput id="note" placeholder="Note" maxLength={NOTE_LIMIT} {...register("note")} />
        </Field>
      </form>
    </FormDialog>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-2">{label}</dt>
      <dd className="font-medium text-ink-1">{value}</dd>
    </div>
  );
}
