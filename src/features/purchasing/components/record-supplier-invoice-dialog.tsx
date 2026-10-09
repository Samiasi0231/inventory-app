"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { z } from "zod";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, SelectInput, TextInput, TextareaInput } from "@/components/form/app-fields";
import { Stepper } from "@/components/ui/stepper";
import { useToast } from "@/components/ui/toast";
import { formatNumber } from "@/lib/format";
import { MOCK_SUPPLIERS } from "@/features/inventory/mock-data";
import { purchasingService } from "../purchasing.service";
import type { PurchaseOrder } from "../types";
import { GrandTotalBar, ReviewCard, ReviewRow, formatReviewDate } from "./review";

const CREATED_BY_OPTIONS = ["Inventory Manager", "Branch Manager", "Owner"];

const INVOICE_TYPES = [{ value: "supplier_invoice", label: "Supplier Invoice" }];

const TAX_LABEL = "Standard VAT 7.5%";

const STEPS = [
  { id: "details", label: "Invoice Details" },
  { id: "products", label: "Products" },
  { id: "review", label: "Review" },
];

const schema = z.object({
  billedTo: z.string().min(1, "Enter who this is billed to"),
  createdBy: z.string().min(1, "Select who is raising this"),
  invoiceType: z.string().min(1, "Select an invoice type"),
  supplierId: z.string().min(1, "Select a supplier"),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  lines: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      variant: z.string(),
      unit: z.string(),
      ordered: z.number(),
      invoiceQty: z.coerce.number().min(0, "Cannot be negative"),
      unitCost: z.coerce.number().min(0, "Cannot be negative"),
    }),
  ),
});

type InvoiceValues = z.input<typeof schema>;

const STEP_FIELDS: (keyof InvoiceValues)[][] = [
  ["billedTo", "createdBy", "invoiceType", "supplierId"],
  ["lines"],
  [],
];

const lineTotal = (line: { invoiceQty?: unknown; unitCost?: unknown }) =>
  Number(line.invoiceQty || 0) * Number(line.unitCost || 0);

interface RecordSupplierInvoiceDialogProps {
  order: PurchaseOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RecordSupplierInvoiceDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: RecordSupplierInvoiceDialogProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const toast = useToast();

  const defaults: InvoiceValues = {
    billedTo: "Funke Adeleke",
    createdBy: CREATED_BY_OPTIONS[0],
    invoiceType: INVOICE_TYPES[0].value,
    supplierId: "",
    issueDate: "",
    dueDate: "",
    notes: "",
    lines: order.lines.map((line) => ({
      productId: line.productId,
      productName: line.productName,
      variant: line.variant,
      unit: line.unit,
      ordered: line.ordered,
      invoiceQty: line.ordered,
      unitCost: line.unitCost,
    })),
  };

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  const { fields } = useFieldArray({ control, name: "lines" });
  const lines = watch("lines") ?? [];
  const total = lines.reduce((sum, line) => sum + lineTotal(line), 0);

  /** Clear the wizard on close so the next one starts from a blank form. */
  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset(defaults);
      setStepIndex(0);
    }
    onOpenChange(nextOpen);
  }

  async function goNext() {
    const fields = STEP_FIELDS[stepIndex];
    const valid = fields.length === 0 || (await trigger(fields));
    if (!valid) return;

    if (stepIndex === 1 && !lines.some((line) => Number(line.invoiceQty) > 0)) {
      toast.add({
        type: "error",
        title: "Nothing to invoice",
        description: "Enter an invoice quantity for at least one line.",
      });
      return;
    }

    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  }

  const isLastStep = stepIndex === STEPS.length - 1;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { reference } = await purchasingService.recordSupplierInvoice(order.id, {
        ...values,
        total,
      });
      toast.add({
        type: "success",
        title: "Supplier invoice recorded",
        description: `${order.purchaseId} • reference ${reference}`,
      });
      handleOpenChange(false);
      onSuccess?.();
    } catch {
      toast.add({
        type: "error",
        title: "Couldn't record invoice",
        description: "Please check the details and try again.",
      });
    }
  });

  const supplierName =
    MOCK_SUPPLIERS.find((supplier) => supplier.id === watch("supplierId"))?.name ?? "—";
  const invoiceTypeLabel =
    INVOICE_TYPES.find((type) => type.value === watch("invoiceType"))?.label ?? "—";

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Record Supplier Invoice"
      description="Fill in details to record supplier invoice"
      className="sm:max-w-[860px]"
      footer={
        <>
          <SecondaryButton
            onClick={() => (stepIndex === 0 ? handleOpenChange(false) : setStepIndex((i) => i - 1))}
            disabled={isSubmitting}
            leftIcon={stepIndex > 0 ? <ArrowLeftIcon className="size-4" /> : undefined}
          >
            {stepIndex === 0 ? "Cancel" : "Back"}
          </SecondaryButton>

          {isLastStep ? (
            <PrimaryButton onClick={onSubmit} loading={isSubmitting}>
              Record Invoice
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={goNext} rightIcon={<ArrowRightIcon className="size-4" />}>
              Next
            </PrimaryButton>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <Stepper
          steps={STEPS}
          currentIndex={stepIndex}
          onStepSelect={setStepIndex}
          className="overflow-x-auto pb-1"
        />

        <form onSubmit={(event) => event.preventDefault()}>
          {stepIndex === 0 && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Billed To" htmlFor="billedTo" error={errors.billedTo?.message}>
                  <TextInput id="billedTo" invalid={!!errors.billedTo} {...register("billedTo")} />
                </Field>

                <Field label="Created by" htmlFor="inv-createdBy" error={errors.createdBy?.message}>
                  <SelectInput id="inv-createdBy" {...register("createdBy")}>
                    {CREATED_BY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectInput>
                </Field>

                <Field label="Invoice Type" htmlFor="invoiceType" error={errors.invoiceType?.message}>
                  <SelectInput id="invoiceType" {...register("invoiceType")}>
                    {INVOICE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>

                <Field label="Supplier" htmlFor="inv-supplier" error={errors.supplierId?.message}>
                  <SelectInput
                    id="inv-supplier"
                    invalid={!!errors.supplierId}
                    {...register("supplierId")}
                  >
                    <option value="">Select Supplier</option>
                    {MOCK_SUPPLIERS.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>

                <Field label="Issue Date" htmlFor="issueDate">
                  <TextInput id="issueDate" type="date" {...register("issueDate")} />
                </Field>

                <Field label="Due Date" htmlFor="dueDate">
                  <TextInput id="dueDate" type="date" {...register("dueDate")} />
                </Field>
              </div>

              <Field label="Notes (Optional)" htmlFor="inv-notes">
                <TextareaInput
                  id="inv-notes"
                  placeholder="Additional notes to supplier"
                  {...register("notes")}
                />
              </Field>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="flex flex-col gap-4">
              <div className="overflow-x-auto rounded-lg border border-border/70">
                <div className="grid min-w-[760px] grid-cols-[1.2fr_1.1fr_0.7fr_0.8fr_1fr_1.1fr_1.1fr] gap-3 bg-surface-muted px-4 py-3 text-[11px] font-semibold text-ink-1">
                  <span>Product</span>
                  <span>Variant</span>
                  <span>Unit</span>
                  <span>Ordered</span>
                  <span>Invoice Qty</span>
                  <span>Unit Cost (₦)</span>
                  <span>Total (₦)</span>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid min-w-[760px] grid-cols-[1.2fr_1.1fr_0.7fr_0.8fr_1fr_1.1fr_1.1fr] items-center gap-3 border-t border-border/50 px-4 py-2.5 text-xs text-ink-2"
                  >
                    <span className="truncate">{field.productName}</span>
                    <span className="truncate">{field.variant}</span>
                    <span>{field.unit}</span>
                    <span>{field.ordered}</span>
                    <TextInput
                      aria-label={`Invoice quantity for ${field.variant}`}
                      type="number"
                      min={0}
                      className="h-9 text-xs"
                      invalid={!!errors.lines?.[index]?.invoiceQty}
                      {...register(`lines.${index}.invoiceQty`)}
                    />
                    <TextInput
                      aria-label={`Unit cost for ${field.variant}`}
                      type="number"
                      min={0}
                      className="h-9 text-xs"
                      invalid={!!errors.lines?.[index]?.unitCost}
                      {...register(`lines.${index}.unitCost`)}
                    />
                    <TextInput
                      aria-label={`Total for ${field.variant}`}
                      readOnly
                      tabIndex={-1}
                      className="h-9 text-xs"
                      value={formatNumber(lineTotal(lines[index] ?? {}))}
                    />
                  </div>
                ))}
              </div>

              <dl className="flex flex-col gap-3 border-t border-border/60 pt-4 text-xs">
                <SummaryRow label="Tax" value={TAX_LABEL} />
                <SummaryRow label="Discounts" value="₦0" />
                <SummaryRow label="TOTAL" value={`₦${formatNumber(total)}`} />
              </dl>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="flex flex-col gap-5">
              <ReviewCard title="Invoice Details">
                <ReviewRow label="Billed To:" value={watch("billedTo") || "Not provided"} />
                <ReviewRow label="Created by:" value={watch("createdBy")} />
                <ReviewRow label="Invoice Type:" value={invoiceTypeLabel} />
                <ReviewRow label="Supplier:" value={supplierName} />
                <ReviewRow
                  label="Issue Date:"
                  value={formatReviewDate(watch("issueDate"), "Not provided")}
                />
                <ReviewRow
                  label="Due Date:"
                  value={formatReviewDate(watch("dueDate"), "Not provided")}
                />
                <ReviewRow label="Note:" value={watch("notes") || "Not provided"} wrap />
              </ReviewCard>

              <ReviewCard title="Products">
                <div className="overflow-x-auto rounded-lg border border-border/70">
                  <div className="grid min-w-[620px] grid-cols-[1.2fr_1.1fr_0.7fr_0.8fr_0.9fr_1fr_1fr] gap-3 bg-surface-muted px-4 py-3 text-[11px] font-semibold text-ink-1">
                    <span>Product</span>
                    <span>Variant</span>
                    <span>Unit</span>
                    <span>Ordered</span>
                    <span>Invoice Qty</span>
                    <span>Unit Cost (₦)</span>
                    <span>Total (₦)</span>
                  </div>
                  {lines.map((line, index) => (
                    <div
                      key={index}
                      className="grid min-w-[620px] grid-cols-[1.2fr_1.1fr_0.7fr_0.8fr_0.9fr_1fr_1fr] gap-3 border-t border-border/50 px-4 py-3 text-xs text-ink-2"
                    >
                      <span className="truncate">{line.productName}</span>
                      <span className="truncate">{line.variant}</span>
                      <span>{line.unit}</span>
                      <span>{line.ordered}</span>
                      <span>{String(line.invoiceQty)}</span>
                      <span>{formatNumber(Number(line.unitCost) || 0)}</span>
                      <span>{formatNumber(lineTotal(line))}</span>
                    </div>
                  ))}
                </div>

                <GrandTotalBar amount={total} />
              </ReviewCard>
            </div>
          )}
        </form>
      </div>
    </FormDialog>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-ink-3">{label}</dt>
      <dd className="text-ink-1">{value}</dd>
    </div>
  );
}
