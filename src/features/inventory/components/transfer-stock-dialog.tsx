"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { z } from "zod";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, SelectInput, TextInput, TextareaInput } from "@/components/form/app-fields";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { formatNumber } from "@/lib/format";
import { MOCK_UNITS } from "../mock-data";
import { inventoryService } from "../inventory.service";
import type { InventoryItem } from "../types";

const lineSchema = z.object({
  variant: z.string().optional(),
  batchCode: z.string().optional(),
  unit: z.string().min(1, "Pick a unit"),
  quantity: z.coerce.number().positive("Enter a quantity"),
});

const transferSchema = z
  .object({
    fromBranchId: z.string().min(1, "Select the source branch"),
    toBranchId: z.string().min(1, "Select the destination branch"),
    date: z.string().min(1, "Pick a date"),
    createdBy: z.string().min(1, "Select who is raising this"),
    lines: z.array(lineSchema).min(1, "Add at least one product"),
    notes: z.string().optional(),
  })
  .refine((values) => values.fromBranchId !== values.toBranchId, {
    message: "Source and destination must be different branches",
    path: ["toBranchId"],
  });

type TransferValues = z.input<typeof transferSchema>;

const CREATED_BY_OPTIONS = ["Inventory Manager", "Branch Manager", "Owner"];

interface TransferStockDialogProps {
  item: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TransferStockDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: TransferStockDialogProps) {
  const { branches } = useBranch();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TransferValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      fromBranchId: item.branchId,
      toBranchId: "",
      date: new Date().toISOString().slice(0, 10),
      createdBy: CREATED_BY_OPTIONS[0],
      lines: [{ unit: item.baseUnit, quantity: 1, variant: "", batchCode: "" }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { reference } = await inventoryService.transferStock({
        fromBranchId: values.fromBranchId,
        toBranchId: values.toBranchId,
        date: new Date(values.date).toISOString(),
        createdBy: values.createdBy,
        notes: values.notes,
        lines: values.lines.map((line) => ({
          productId: item.productId,
          variantId: line.variant || null,
          batchCode: line.batchCode || null,
          unit: line.unit,
          quantity: Number(line.quantity),
        })),
      });

      toast.add({
        type: "success",
        title: "Transfer requested",
        description: `${item.name} • reference ${reference}`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.add({
        type: "error",
        title: "Transfer failed",
        description: "We couldn't request this transfer. Please try again.",
      });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Transfer Stock"
      description="Move stock from one branch to another"
      footer={
        <>
          <SecondaryButton onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={onSubmit} loading={isSubmitting}>
            Request Transfer
          </PrimaryButton>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex items-center gap-3 rounded-lg bg-accent p-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-1">{item.name}</p>
            <p className="text-xs text-ink-3">
              Available stock: {formatNumber(item.totalStock)} {item.baseUnit.toLowerCase()}
              {item.totalStock === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="From Location" htmlFor="fromBranchId" required error={errors.fromBranchId?.message}>
            <SelectInput id="fromBranchId" invalid={!!errors.fromBranchId} {...register("fromBranchId")}>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="To Location" htmlFor="toBranchId" required error={errors.toBranchId?.message}>
            <SelectInput id="toBranchId" invalid={!!errors.toBranchId} {...register("toBranchId")}>
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field label="Date" htmlFor="date" error={errors.date?.message}>
            <TextInput id="date" type="date" invalid={!!errors.date} {...register("date")} />
          </Field>

          <Field label="Created by" htmlFor="createdBy" error={errors.createdBy?.message}>
            <SelectInput id="createdBy" invalid={!!errors.createdBy} {...register("createdBy")}>
              {CREATED_BY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-ink-2">Product Details</p>

          <div className="overflow-hidden rounded-lg border border-border">
            <div className="hidden grid-cols-[1.3fr_1fr_1.1fr_1fr_0.8fr_auto] gap-3 bg-surface-muted px-4 py-3 text-xs font-semibold text-ink-1 sm:grid">
              <span>Product</span>
              <span>Variant</span>
              <span>Batch (if tracked)</span>
              <span>Unit</span>
              <span>Quantity</span>
              <span className="w-8" />
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 items-center gap-3 border-t border-border/60 px-4 py-3 sm:grid-cols-[1.3fr_1fr_1.1fr_1fr_0.8fr_auto]"
              >
                <p className="truncate text-sm text-ink-2">{item.name}</p>

                <SelectInput
                  aria-label="Variant"
                  className="h-9 text-sm"
                  {...register(`lines.${index}.variant`)}
                >
                  <option value="">None</option>
                  <option value="large-milk">Large / Milk</option>
                  <option value="small-dark">Small / Dark</option>
                </SelectInput>

                <TextInput
                  aria-label="Batch code"
                  placeholder="CH-LG-M-001"
                  className="h-9 text-sm"
                  {...register(`lines.${index}.batchCode`)}
                />

                <SelectInput aria-label="Unit" className="h-9 text-sm" {...register(`lines.${index}.unit`)}>
                  {MOCK_UNITS.map((unit) => (
                    <option key={unit.id} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </SelectInput>

                <TextInput
                  aria-label="Quantity"
                  type="number"
                  min={1}
                  className="h-9 text-sm"
                  invalid={!!errors.lines?.[index]?.quantity}
                  {...register(`lines.${index}.quantity`)}
                />

                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  aria-label="Remove line"
                  className="justify-self-end rounded-md p-2 text-ink-4 transition-colors hover:bg-danger-bg hover:text-danger-fg disabled:pointer-events-none disabled:opacity-40"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => append({ unit: item.baseUnit, quantity: 1, variant: "", batchCode: "" })}
            className="flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-700"
          >
            <PlusIcon className="size-4" />
            Add Details
          </button>
        </div>

        <Field label="Notes (Optional)" htmlFor="notes">
          <TextareaInput id="notes" placeholder="Reallocate to Lagos demand" {...register("notes")} />
        </Field>
      </form>
    </FormDialog>
  );
}
