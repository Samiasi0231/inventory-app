"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, SelectInput, TextInput } from "@/components/form/app-fields";
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
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { amount: balance, method: "cash", reference: "" },
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
      description={`Against ${invoice.number} for ${invoice.customerName}`}
      className="sm:max-w-[480px]"
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
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-lg bg-accent px-4 py-3">
          <span className="text-sm text-ink-2">Balance due</span>
          <span className="text-base font-semibold text-ink-1">{formatCurrency(balance)}</span>
        </div>

        <Field label="Amount" htmlFor="amount" required error={errors.amount?.message}>
          <TextInput
            id="amount"
            type="number"
            min={0}
            step="0.01"
            invalid={!!errors.amount}
            {...register("amount")}
          />
        </Field>

        <button
          type="button"
          onClick={() => setValue("amount", balance, { shouldValidate: true })}
          className="w-fit text-sm font-semibold text-primary transition-colors hover:text-brand-700"
        >
          Pay remaining in full
        </button>

        <Field label="Method" htmlFor="method" required error={errors.method?.message}>
          <SelectInput id="method" invalid={!!errors.method} {...register("method")}>
            {PAYMENT_METHODS.filter((method) => method.value !== "credit").map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field label="Reference (Optional)" htmlFor="reference">
          <TextInput id="reference" placeholder="Transfer reference or teller number" {...register("reference")} />
        </Field>
      </form>
    </FormDialog>
  );
}
