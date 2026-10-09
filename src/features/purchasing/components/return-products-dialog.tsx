"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, SelectInput, TextInput, TextareaInput } from "@/components/form/app-fields";
import { useToast } from "@/components/ui/toast";
import { purchasingService } from "../purchasing.service";
import { RETURN_REASONS, type PurchaseOrder } from "../types";

const CREATED_BY_OPTIONS = ["Inventory Manager", "Branch Manager", "Owner"];

const schema = z.object({
  date: z.string().min(1, "Pick a date"),
  createdBy: z.string().min(1, "Select who is raising this"),
  notes: z.string().optional(),
  lines: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      variant: z.string(),
      ordered: z.number(),
      received: z.number(),
      unit: z.string(),
      returnQty: z.coerce.number().min(0, "Cannot be negative"),
      batchNumber: z.string().optional(),
      reason: z.string(),
    }),
  ),
});

type ReturnValues = z.input<typeof schema>;

interface ReturnProductsDialogProps {
  order: PurchaseOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ReturnProductsDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: ReturnProductsDialogProps) {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReturnValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      createdBy: CREATED_BY_OPTIONS[0],
      notes: "",
      lines: order.lines.map((line) => ({
        productId: line.productId,
        productName: line.productName,
        variant: line.variant,
        ordered: line.ordered,
        received: line.received,
        unit: line.unit,
        returnQty: 0,
        batchNumber: line.batchNumber,
        reason: RETURN_REASONS[0].value,
      })),
    },
  });

  const { fields } = useFieldArray({ control, name: "lines" });

  const onSubmit = handleSubmit(async (values) => {
    const returning = values.lines.filter((line) => Number(line.returnQty) > 0);
    if (returning.length === 0) {
      toast.add({
        type: "error",
        title: "Nothing to return",
        description: "Enter a return quantity for at least one line.",
      });
      return;
    }

    try {
      const { reference } = await purchasingService.returnProducts(
        order.id,
        returning.map((line) => ({
          productId: line.productId,
          variant: line.variant,
          returnQty: Number(line.returnQty),
          batchNumber: line.batchNumber ?? "",
          reason: line.reason,
        })),
      );
      toast.add({
        type: "success",
        title: "Return request created",
        description: `${order.purchaseId} • reference ${reference}`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.add({
        type: "error",
        title: "Couldn't create return request",
        description: "Please try again.",
      });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Return Products"
      description="Enter details to return goods"
      className="sm:max-w-[900px]"
      footer={
        <>
          <SecondaryButton onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={onSubmit} loading={isSubmitting}>
            Create Return Request
          </PrimaryButton>
        </>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date" htmlFor="return-date" required error={errors.date?.message}>
            <TextInput id="return-date" type="date" invalid={!!errors.date} {...register("date")} />
          </Field>
          <Field label="Created by" htmlFor="return-by" error={errors.createdBy?.message}>
            <SelectInput id="return-by" {...register("createdBy")}>
              {CREATED_BY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="grid min-w-[800px] grid-cols-[1fr_0.9fr_0.6fr_0.7fr_0.6fr_0.8fr_0.9fr_1fr] gap-3 bg-surface-muted px-4 py-3 text-xs font-semibold text-ink-1">
            <span>Product</span>
            <span>Variant</span>
            <span>Ordered</span>
            <span>Received</span>
            <span>Unit</span>
            <span>Return Qty</span>
            <span>Batch No.</span>
            <span>Reason for Return</span>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid min-w-[800px] grid-cols-[1fr_0.9fr_0.6fr_0.7fr_0.6fr_0.8fr_0.9fr_1fr] items-center gap-3 border-t border-border/60 px-4 py-3"
            >
              <p className="truncate text-sm text-ink-2">{field.productName}</p>
              <p className="truncate text-sm text-ink-2">{field.variant}</p>
              <p className="text-sm text-ink-2">{field.ordered}</p>
              <p className="text-sm text-ink-2">{field.received}</p>
              <p className="text-sm text-ink-2">{field.unit}</p>
              <TextInput
                aria-label={`Return quantity for ${field.variant}`}
                type="number"
                min={0}
                max={field.received}
                className="h-9 text-sm"
                invalid={!!errors.lines?.[index]?.returnQty}
                {...register(`lines.${index}.returnQty`)}
              />
              <TextInput
                aria-label={`Batch number for ${field.variant}`}
                className="h-9 text-sm"
                {...register(`lines.${index}.batchNumber`)}
              />
              <SelectInput
                aria-label={`Reason for ${field.variant}`}
                className="h-9 text-sm"
                {...register(`lines.${index}.reason`)}
              >
                {RETURN_REASONS.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </SelectInput>
            </div>
          ))}
        </div>

        <Field label="Notes (Optional)" htmlFor="return-notes">
          <TextareaInput
            id="return-notes"
            placeholder="Additional notes to supplier"
            {...register("notes")}
          />
        </Field>
      </form>
    </FormDialog>
  );
}
