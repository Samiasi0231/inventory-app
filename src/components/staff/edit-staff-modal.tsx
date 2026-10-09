"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { FormInput } from "@/components/form/form-field";
import { FormSelect } from "@/components/form/form-select";
import { Modal } from "@/components/ui/modal";
import { BRANCHES } from "@/types/staff";
import { ASSIGNABLE_ROLES, type StaffMember } from "@/types/staff";

const schema = z.object({
  branch: z.string().min(1, "Select a branch"),
  name: z.string().trim().min(2, "Enter the staff member's full name"),
  email: z.string().trim().email("Enter a valid email address"),
  role: z.string().min(1, "Assign a role"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  staff: StaffMember | null;
  onClose: () => void;
  onSubmit: (id: string, data: FormValues) => Promise<void>;
  /** The design labels this button "Send Invitation". Override if needed. */
  submitLabel?: string;
}

export function EditStaffModal({
  staff,
  onClose,
  onSubmit,
  submitLabel = "Send Invitation",
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { branch: "", name: "", email: "", role: "" },
  });

  useEffect(() => {
    if (staff)
      reset({
        branch: staff.branch,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      });
  }, [staff, reset]);

  const submit = handleSubmit(async (values) => {
    if (!staff) return;
    setSubmitting(true);
    try {
      await onSubmit(staff.id, values);
      onClose();
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Modal
      open={!!staff}
      onClose={onClose}
      locked={submitting}
      className="max-w-[560px]"
    >
      <h2 className="text-xl font-semibold text-gray-900">Edit Details</h2>
      <p className="mt-1 text-xs text-gray-500">Fill in the details to edit</p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <Controller
          control={control}
          name="branch"
          render={({ field }) => (
            <FormSelect
              label="Branch"
              value={field.value}
              options={BRANCHES}
              onChange={field.onChange}
              error={errors.branch?.message}
            />
          )}
        />

        <FormInput
          label="Full Name"
          placeholder="Full name"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormInput
          label="Email Address"
          type="email"
          placeholder="e.g name@gmail.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <FormSelect
              label="Assign Role"
              value={field.value}
              options={ASSIGNABLE_ROLES}
              onChange={field.onChange}
              error={errors.role?.message}
            />
          )}
        />

        <div className="flex justify-between pt-4">
          <SecondaryButton
            type="button"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? "Please wait..." : submitLabel}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
