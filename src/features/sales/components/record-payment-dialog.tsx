"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, SelectInput, TextareaInput, TextInput } from "@/components/form/app-fields";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/format";
import { salesService } from "../sales.service";
import { getBalanceDue, PAYMENT_METHODS, type Invoice } from "../types";

interface RecordPaymentDialogProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RecordPaymentDialog({
  invoice,
  open,
  onOpenChange,
  onSuccess,
}: RecordPaymentDialogProps) {
  const toast = useToast();
  const balance = getBalanceDue(invoice);

  const schema = z.object({
    amount: z.coerce
      .number()
      .positive("Enter an amount")
      .max(balance, `That is more than the ${formatCurrency(balance)} outstanding`),
    method: z.string().min(1, "Pick a payment method"),
    reference: z.string().optional(),
    paymentDate: z.string().min(1, "Choose a payment date"),
    note: z.string().max(500).optional(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: "",
      method: "",
      reference: "",
      paymentDate: "",
      note: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await salesService.recordPayment(invoice.id, Number(values.amount));
      toast.add({
        type: "success",
        title: "Payment recorded",
        description: `${formatCurrency(Number(values.amount))} against ${invoice.number}`,
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
      description={`Record a payment for ${invoice.number} from ${invoice.customerName}`}
      className="[&_[data-slot=dialog-title]]:text-[22px] [&>div:first-child]:px-8 [&>div:nth-child(2)]:px-8 [&>div:last-child]:px-8"
      footer={
        <>
          <SecondaryButton className="h-12" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton className="h-12" onClick={onSubmit} loading={isSubmitting}>
            Record Payment
          </PrimaryButton>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <dl className="grid gap-2 rounded-lg bg-accent p-4 text-base">
          <SummaryRow label="Order Total" value={formatCurrency(invoice.total)} />
          <SummaryRow label="Already Paid" value={formatCurrency(invoice.amountPaid)} />
          <SummaryRow label="Balance Due" value={formatCurrency(balance)} strong />
        </dl>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Amount Paid" htmlFor="amount" error={errors.amount?.message}>
            <TextInput
              id="amount"
              type="number"
              min={0}
              step="0.01"
              placeholder="₦0"
              className="h-[50px]"
              invalid={!!errors.amount}
              {...register("amount")}
            />
          </Field>

          <Field label="Reference Number" htmlFor="reference">
            <TextInput id="reference" placeholder="0" className="h-[50px]" {...register("reference")} />
          </Field>

          <Field label="Payment Method" htmlFor="method" error={errors.method?.message}>
            <SelectInput id="method" className="h-[50px]" invalid={!!errors.method} {...register("method")}>
              <option value="">Select Payment Method</option>
              {PAYMENT_METHODS.filter((method) => method.value !== "credit").map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Payment Date" htmlFor="paymentDate" error={errors.paymentDate?.message}>
            <TextInput id="paymentDate" type="date" className="h-[50px] empty:text-ink-4" invalid={!!errors.paymentDate} {...register("paymentDate")} />
          </Field>
        </div>
        <Field label="Note" htmlFor="note" hint="0/500">
          <TextareaInput id="note" maxLength={500} placeholder="Note" className="min-h-[70px]" {...register("note")} />
        </Field>

        <button type="button" onClick={() => setValue("amount", balance, { shouldValidate: true })} className="sr-only">
          Pay remaining in full
        </button>
      </form>
    </FormDialog>
  );
}

function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-ink-3">{label}</dt>
      <dd className={strong ? "font-semibold text-ink-1" : "text-ink-1"}>{value}</dd>
    </div>
  );
}
