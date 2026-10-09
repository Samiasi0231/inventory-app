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
  CUSTOMER_TYPES,
  type Customer,
  type CustomerInput,
  type CustomerType,
} from "@/types/customer";

const schema = z.object({
  name: z.string().trim().min(2, "Enter the customer name"),
  type: z.string().min(1, "Select a customer type"),
  contactPerson: z.string().trim(),
  phone: z
    .string()
    .trim()
    .regex(/^$|^\+?[0-9\s-]{7,15}$/, "Enter a valid phone number"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .or(z.literal("")),
  address: z.string().trim(),
  creditLimit: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0),
      "Enter a valid amount",
    ),
  notes: z.string().trim(),
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  name: "",
  type: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
  creditLimit: "",
  notes: "",
};

const fromCustomer = (c: Customer): FormValues => ({
  name: c.name,
  type: c.type,
  contactPerson: c.contactPerson,
  phone: c.phone,
  email: c.email,
  address: c.address,
  creditLimit: c.creditLimit ? String(c.creditLimit) : "",
  notes: c.notes,
});

interface Props {
  open: boolean;
  /** Pass a customer to edit; omit for "Add Customer" */
  customer?: Customer | null;
  onClose: () => void;
  onSubmit: (input: CustomerInput) => Promise<void>;
  /** The edit design reuses the staff button text ("Send Invitation") — we default to "Save Changes". */
  editSubmitLabel?: string;
}

export function CustomerFormModal({
  open,
  customer,
  onClose,
  onSubmit,
  editSubmitLabel = "Save Changes",
}: Props) {
  const isEdit = !!customer;
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
    if (open) reset(customer ? fromCustomer(customer) : EMPTY);
  }, [open, customer, reset]);

  const submit = handleSubmit(async (v) => {
    const limit = Number(v.creditLimit);
    setSubmitting(true);
    try {
      await onSubmit({
        name: v.name,
        type: v.type as CustomerType,
        contactPerson: v.contactPerson,
        phone: v.phone,
        email: v.email,
        address: v.address,
        creditLimit: v.creditLimit === "" || limit === 0 ? null : limit, // empty / 0 = no limit
        notes: v.notes,
      });
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
        {isEdit ? "Edit Details" : "Add Customer"}
      </h2>
      <p className="mt-1 text-xs text-gray-500">
        {isEdit
          ? "Fill in the details to edit"
          : "Fill in the details to add new customer"}
      </p>

      <form
        onSubmit={submit}
        className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <FormInput
          fieldClassName="sm:col-span-2"
          label="Customer Name"
          required
          placeholder="Type customer name"
          error={errors.name?.message}
          {...register("name")}
        />

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <FormSelect
              label="Customer Type"
              required
              placeholder="Select Customer Type"
              value={field.value}
              options={CUSTOMER_TYPES}
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
          label="Phone Number"
          type="tel"
          placeholder="+2348012345678"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <FormInput
          label="Email Address"
          type="email"
          placeholder="e.g name@gmail.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <FormInput
          fieldClassName="sm:col-span-2"
          label="Address"
          placeholder="Street, city, state"
          error={errors.address?.message}
          {...register("address")}
        />
        <FormInput
          fieldClassName="sm:col-span-2"
          label="Credit Limit"
          type="number"
          min={0}
          placeholder="0"
          error={errors.creditLimit?.message}
          {...register("creditLimit")}
        />
        <FormTextarea
          fieldClassName="sm:col-span-2"
          label="Notes (Optional)"
          placeholder="Add any notes about this customer"
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
                : "Add Customer"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
