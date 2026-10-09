"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { TextInput } from "@/components/form/app-fields";
import { useToast } from "@/components/ui/toast";
import { purchasingService } from "../purchasing.service";
import type { PurchaseOrder } from "../types";

const schema = z.object({
  lines: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      variant: z.string(),
      ordered: z.number(),
      outstanding: z.number(),
      unit: z.string(),
      received: z.coerce.number().min(0, "Cannot be negative"),
      batchNumber: z.string().optional(),
      expiryDate: z.string().optional(),
    }),
  ),
});

type ReceiveValues = z.input<typeof schema>;

interface ReceiveProductsDialogProps {
  order: PurchaseOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ReceiveProductsDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: ReceiveProductsDialogProps) {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReceiveValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lines: order.lines.map((line) => ({
        productId: line.productId,
        productName: line.productName,
        variant: line.variant,
        ordered: line.ordered,
        outstanding: line.ordered - line.received,
        unit: line.unit,
        received: 0,
        batchNumber: line.batchNumber,
        expiryDate: line.expiryDate ? line.expiryDate.slice(0, 10) : "",
      })),
    },
  });

  const { fields } = useFieldArray({ control, name: "lines" });

  const onSubmit = handleSubmit(async (values) => {
    const received = values.lines.filter((line) => Number(line.received) > 0);
    if (received.length === 0) {
      toast.add({
        type: "error",
        title: "Nothing to receive",
        description: "Enter the quantity received for at least one line.",
      });
      return;
    }

    try {
      await purchasingService.receiveGoods(
        order.id,
        received.map((line) => ({
          productId: line.productId,
          variant: line.variant,
          received: Number(line.received),
          batchNumber: line.batchNumber ?? "",
          expiryDate: line.expiryDate || undefined,
        })),
      );
      toast.add({
        type: "success",
        title: "Stock received",
        description: `${order.purchaseId} has been booked in.`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.add({ type: "error", title: "Couldn't receive stock", description: "Please try again." });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Receive Products"
      description={`Enter the quantities actually received for ${order.purchaseId}`}
      className="sm:max-w-[860px]"
      footer={
        <>
          <SecondaryButton onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <PrimaryButton onClick={onSubmit} loading={isSubmitting}>
            Receive Stock
          </PrimaryButton>
        </>
      }
    >
      <form onSubmit={onSubmit}>
        <div className="overflow-x-auto rounded-lg border border-border">
          <div className="grid min-w-[760px] grid-cols-[1.1fr_1fr_0.7fr_0.8fr_0.7fr_1fr_1fr] gap-3 bg-surface-muted px-4 py-3 text-xs font-semibold text-ink-1">
            <span>Product</span>
            <span>Variant</span>
            <span>Ordered</span>
            <span>Received</span>
            <span>Unit</span>
            <span>Batch No.</span>
            <span>Expiry Date</span>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid min-w-[760px] grid-cols-[1.1fr_1fr_0.7fr_0.8fr_0.7fr_1fr_1fr] items-center gap-3 border-t border-border/60 px-4 py-3"
            >
              <p className="truncate text-sm text-ink-2">{field.productName}</p>
              <p className="truncate text-sm text-ink-2">{field.variant}</p>
              <p className="text-sm text-ink-2">{field.ordered}</p>
              <TextInput
                aria-label={`Received for ${field.variant}`}
                type="number"
                min={0}
                max={field.outstanding}
                className="h-9 text-sm"
                invalid={!!errors.lines?.[index]?.received}
                {...register(`lines.${index}.received`)}
              />
              <p className="text-sm text-ink-2">{field.unit}</p>
              <TextInput
                aria-label={`Batch number for ${field.variant}`}
                className="h-9 text-sm"
                {...register(`lines.${index}.batchNumber`)}
              />
              <TextInput
                aria-label={`Expiry date for ${field.variant}`}
                type="date"
                className="h-9 text-sm"
                {...register(`lines.${index}.expiryDate`)}
              />
            </div>
          ))}
        </div>
      </form>
    </FormDialog>
  );
}
