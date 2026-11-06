"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { FormInput, FormTextarea } from "@/components/form/form-field";
import { Modal } from "@/components/ui/modal";
import type { Customer, AdjustCreditInput } from "@/types/customer";

const schema = z.object({
  creditLimit: z
    .string()
    .trim()
    .min(1, "Enter a credit limit amount")
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) >= 0,
      "Enter a valid non-negative amount",
    ),
  paymentTermsDays: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0),
      "Enter a valid non-negative number of days",
    ),
  reason: z.string().trim().max(255, "Reason cannot exceed 255 characters"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  customer?: Customer | null;
  onClose: () => void;
  onSubmit: (input: AdjustCreditInput) => Promise<void>;
}

export function AdjustCreditModal({ open, customer, onClose, onSubmit }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      creditLimit: "",
      paymentTermsDays: "",
      reason: "",
    },
  });

  useEffect(() => {
    if (open && customer) {
      setError(null);
      reset({
        creditLimit: customer.creditLimit !== null ? String(customer.creditLimit) : "0",
        paymentTermsDays: customer.paymentTermsDays !== undefined ? String(customer.paymentTermsDays) : "0",
        reason: "",
      });
    }
  }, [open, customer, reset]);

  const submit = handleSubmit(async (v) => {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        creditLimit: Number(v.creditLimit),
        paymentTermsDays: v.paymentTermsDays ? Number(v.paymentTermsDays) : 0,
        reason: v.reason || undefined,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to adjust credit policy");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Modal open={open} onClose={onClose} locked={submitting} className="max-w-md">
      <h2 className="text-xl font-semibold text-gray-900">Adjust Credit Policy</h2>
      <p className="mt-1 text-xs text-gray-500">
        Update the credit limit and payment terms for{" "}
        <strong className="text-gray-800">{customer?.name}</strong>.
      </p>

      {error && (
        <div className="mt-3 rounded-md bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={submit} className="mt-4 space-y-4">
        <FormInput
          label="Credit Limit (NGN)"
          required
          placeholder="e.g. 50000"
          error={errors.creditLimit?.message}
          {...register("creditLimit")}
        />

        <FormInput
          label="Payment Terms (Days)"
          placeholder="e.g. 30"
          error={errors.paymentTermsDays?.message}
          {...register("paymentTermsDays")}
        />

        <FormTextarea
          label="Audit Justification / Reason"
          placeholder="Brief explanation for this credit adjustment"
          rows={3}
          error={errors.reason?.message}
          {...register("reason")}
        />

        <div className="flex justify-end gap-3 pt-3">
          <SecondaryButton type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" loading={submitting}>
            Save Credit Policy
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
