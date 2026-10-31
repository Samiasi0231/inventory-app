"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { FormInput } from "@/components/form/form-field";
import { FormSelect } from "@/components/form/form-select";
import { Modal } from "@/components/ui/modal";
import { BRANCHES, ASSIGNABLE_ROLES } from "@/types/staff";

const schema = z.object({
  branch: z.string().min(1, "Select a branch"),
  name: z.string().trim().min(2, "Enter the staff member's full name"),
  email: z.string().trim().email("Enter a valid email address"),
  role: z.string().min(1, "Assign a role"),
});

export type StaffInviteFormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StaffInviteFormValues) => Promise<void>;
}

export function StaffInviteModal({ open, onClose, onSubmit }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffInviteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      branch: "",
      name: "",
      email: "",
      role: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        branch: "",
        name: "",
        email: "",
        role: "",
      });
    }
  }, [open, reset]);

  const submit = handleSubmit(async (values) => {
    setSubmitting(true);

    try {
      await onSubmit(values);
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
      className="max-w-[560px]"
    >
      <h2 className="text-xl font-semibold text-gray-900">
        Invite Staff
      </h2>

      <p className="mt-1 text-xs text-gray-500">
        Enter the staff member's details to send an invitation.
      </p>

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
          placeholder="e.g. name@gmail.com"
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
            {submitting ? "Sending..." : "Send Invitation"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}