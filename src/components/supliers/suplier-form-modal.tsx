"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { FormInput, FormTextarea } from "@/components/form/form-field";
import { FormSelect } from "@/components/form/form-select";
import { Modal } from "@/components/ui/modal";
import {
  SUPPLIER_TYPES,
  type Supplier,
  type SupplierInput,
  type SupplierType,
} from "@/types/suppliers";

const schema = z.object({
  name: z.string().trim().min(2, "Enter the supplier's name"),
  type: z.string().min(1, "Select a supplier type"),
  contactPerson: z.string().trim(),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .regex(/^$|^\+?[0-9\s-]{7,15}$/, "Enter a valid phone number"),
  address: z.string().trim(),
  notes: z.string().trim(),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  type: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
};

const fromSupplier = (s: Supplier): FormValues => ({
  name: s.name,
  type: s.type,
  contactPerson: s.contactPerson,
  email: s.email,
  phone: s.phone,
  address: s.address,
  notes: s.notes,
});

interface Props {
  open: boolean;
  /** Pass a supplier to edit; omit for "Add Supplier" */
  supplier?: Supplier | null;
  onClose: () => void;
  onSubmit: (input: SupplierInput) => Promise<void>;
  /** The edit design reuses the "Add Supplier" button text — we default to "Save Changes". */
  editSubmitLabel?: string;
}

export function SupplierFormModal({
  open,
  supplier,
  onClose,
  onSubmit,
  editSubmitLabel = "Save Changes",
}: Props) {
  const isEdit = !!supplier;
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (open) reset(supplier ? fromSupplier(supplier) : EMPTY);
  }, [open, supplier, reset]);

  const submit = handleSubmit(async (v) => {
    setSubmitting(true);
    try {
      await onSubmit({ ...v, type: v.type as SupplierType });
      onClose();
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      locked={submitting}
      className="max-w-[600px]"
    >
      <h2 className="text-xl font-semibold text-gray-900">
        {isEdit ? "Edit Details" : "Add Supplier"}
      </h2>
      <p className="mt-1 text-xs text-gray-500">
        {isEdit
          ? "Fill in the details to edit"
          : "Fill in the details to add new supplier"}
      </p>

      <form
        onSubmit={submit}
        className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <FormInput
          fieldClassName="sm:col-span-2"
          label="Supplier's Name"
          required
          placeholder="Type supplier's name"
          error={errors.name?.message}
          {...register("name")}
        />

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <FormSelect
              label="Supplier Type"
              required
              placeholder="Select Supplier Type"
              value={field.value}
              options={SUPPLIER_TYPES}
              onChange={field.onChange}
              error={errors.type?.message}
            />
          )}
        />
        <FormInput
          label="Contact Person"
          placeholder="e.g Mr Salami"
          error={errors.contactPerson?.message}
          {...register("contactPerson")}
        />

        <FormInput
          label="Email Address"
          type="email"
          placeholder="Type vendor email address"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormInput
          label="Phone Number"
          type="tel"
          placeholder="Type vendor phone number"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <FormInput
          fieldClassName="sm:col-span-2"
          label="Address"
          placeholder="Street, city, state"
          error={errors.address?.message}
          {...register("address")}
        />
        <FormTextarea
          fieldClassName="sm:col-span-2"
          label="Notes (Optional)"
          placeholder="Add any notes about this supplier"
          error={errors.notes?.message}
          {...register("notes")}
        />

        <div className="flex justify-between pt-2 sm:col-span-2">
          <SecondaryButton
            type="button"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting
              ? "Please wait..."
              : isEdit
                ? editSubmitLabel
                : "Add Supplier"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
