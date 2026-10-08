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
import { ADJUSTMENT_REASONS, type AdjustmentReason, type InventoryItem } from "../types";

const adjustSchema = z.object({
  direction: z.enum(["increase", "decrease"]),
  branchId: z.string().min(1, "Select a location"),
  createdBy: z.string().min(1, "Select who is raising this"),
  reason: z.string().min(1, "Select a reason"),
  lines: z
    .array(
      z.object({
        variant: z.string().optional(),
        batchCode: z.string().optional(),
        unit: z.string().min(1, "Pick a unit"),
        quantity: z.coerce.number().positive("Enter a quantity"),
      }),
    )
    .min(1, "Add at least one product"),
  notes: z.string().optional(),
});

type AdjustValues = z.input<typeof adjustSchema>;

const CREATED_BY_OPTIONS = ["Inventory Manager", "Branch Manager", "Owner"];

interface AdjustStockDialogProps {
  item: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AdjustStockDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: AdjustStockDialogProps) {
  const { branches } = useBranch();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AdjustValues>({
    resolver: zodResolver(adjustSchema),
    defaultValues: {
      direction: "decrease",
      branchId: item.branchId,
      createdBy: CREATED_BY_OPTIONS[0],
      reason: "",
      lines: [{ unit: item.baseUnit, quantity: 1, variant: "", batchCode: "" }],
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const results = await Promise.all(
        values.lines.map((line) =>
          inventoryService.adjustStock({
            branchId: values.branchId,
            productId: item.productId,
            direction: values.direction,
            quantity: Number(line.quantity),
            unit: line.unit,
            reason: values.reason as AdjustmentReason,
            date: new Date().toISOString(),
            notes: values.notes,
          }),
        ),
      );

      toast.add({
        type: "success",
        title: "Stock adjusted",
        description: `${item.name} • reference ${results[0].reference}`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.add({
        type: "error",
        title: "Adjustment failed",
        description: "We couldn't save this adjustment. Please try again.",
      });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Adjust Stock"
      description="Correct stock levels for damage, loss or a recount"
      footer={
        <>
          <SecondaryButton onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={onSubmit} loading={isSubmitting}>
            Save Adjustment
          </PrimaryButton>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="rounded-lg bg-accent p-4">
          <p className="truncate text-sm font-semibold text-ink-1">{item.name}</p>
          <p className="text-xs text-ink-3">
            Available stock: {formatNumber(item.totalStock)} {item.baseUnit.toLowerCase()}
            {item.totalStock === 1 ? "" : "s"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Adjustment Type" htmlFor="direction" required error={errors.direction?.message}>
            <SelectInput id="direction" invalid={!!errors.direction} {...register("direction")}>
              <option value="increase">Add Stock</option>
              <option value="decrease">Remove Stock</option>
            </SelectInput>
          </Field>

          <Field label="Location" htmlFor="branchId" required error={errors.branchId?.message}>
            <SelectInput id="branchId" invalid={!!errors.branchId} {...register("branchId")}>
              <option value="">Select Location</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </SelectInput>
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

                <SelectInput aria-label="Variant" className="h-9 text-sm" {...register(`lines.${index}.variant`)}>
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

        <Field label="Select Reason" htmlFor="reason" required error={errors.reason?.message}>
          <SelectInput id="reason" invalid={!!errors.reason} {...register("reason")}>
            <option value="">Select Reason</option>
            {ADJUSTMENT_REASONS.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field label="Notes (Optional)" htmlFor="adjust-notes">
          <TextareaInput
            id="adjust-notes"
            placeholder="Damaged during offloading"
            {...register("notes")}
          />
        </Field>
      </form>
    </FormDialog>
  );
}
