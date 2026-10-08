"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { z } from "zod";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, SelectInput, TextInput, TextareaInput } from "@/components/form/app-fields";
import { Stepper } from "@/components/ui/stepper";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/format";
import { MOCK_SUPPLIERS } from "@/features/inventory/mock-data";
import { purchasingService } from "../purchasing.service";
import type { PurchaseOrder } from "../types";

const CREATED_BY_OPTIONS = ["Inventory Manager", "Branch Manager", "Owner"];

const INVOICE_TYPES = [
  { value: "supplier_invoice", label: "Supplier Invoice" },
  { value: "proforma", label: "Proforma Invoice" },
  { value: "credit_note", label: "Credit Note" },
];

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
  issueDate: z.string().min(1, "Pick an issue date"),
  dueDate: z.string().min(1, "Pick a due date"),
  notes: z.string().optional(),
});

type InvoiceValues = z.input<typeof schema>;

const STEP_FIELDS: (keyof InvoiceValues)[][] = [
  ["billedTo", "createdBy", "invoiceType", "supplierId", "issueDate", "dueDate"],
  [],
  [],
];

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
    supplierId: order.supplierId,
    issueDate: "",
    dueDate: "",
    notes: "",
  };

  const {
    register,
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
    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  }

  const isLastStep = stepIndex === STEPS.length - 1;
  const linesTotal = order.lines.reduce((sum, line) => sum + line.ordered * line.unitCost, 0);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { reference } = await purchasingService.recordSupplierInvoice(order.id, { ...values });
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
                <Field label="Billed To" htmlFor="billedTo" required error={errors.billedTo?.message}>
                  <TextInput
                    id="billedTo"
                    invalid={!!errors.billedTo}
                    {...register("billedTo")}
                  />
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

                <Field
                  label="Invoice Type"
                  htmlFor="invoiceType"
                  required
                  error={errors.invoiceType?.message}
                >
                  <SelectInput id="invoiceType" {...register("invoiceType")}>
                    {INVOICE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>

                <Field
                  label="Supplier"
                  htmlFor="inv-supplier"
                  required
                  error={errors.supplierId?.message}
                >
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

                <Field label="Issue Date" htmlFor="issueDate" required error={errors.issueDate?.message}>
                  <TextInput
                    id="issueDate"
                    type="date"
                    invalid={!!errors.issueDate}
                    {...register("issueDate")}
                  />
                </Field>

                <Field label="Due Date" htmlFor="dueDate" required error={errors.dueDate?.message}>
                  <TextInput
                    id="dueDate"
                    type="date"
                    invalid={!!errors.dueDate}
                    {...register("dueDate")}
                  />
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
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-base font-semibold text-ink-1">Products</h3>
                <p className="mt-0.5 text-xs text-ink-3">
                  Lines carried over from {order.purchaseId}.
                </p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <div className="grid min-w-[620px] grid-cols-[1.2fr_1fr_0.7fr_0.7fr_1fr] gap-3 bg-surface-muted px-4 py-3 text-xs font-semibold text-ink-1">
                  <span>Product</span>
                  <span>Variant</span>
                  <span>Ordered</span>
                  <span>Unit</span>
                  <span>Unit Cost</span>
                </div>
                {order.lines.map((line) => (
                  <div
                    key={`${line.productId}-${line.variant}`}
                    className="grid min-w-[620px] grid-cols-[1.2fr_1fr_0.7fr_0.7fr_1fr] gap-3 border-t border-border/60 px-4 py-3 text-xs text-ink-2"
                  >
                    <span className="truncate">{line.productName}</span>
                    <span className="truncate">{line.variant}</span>
                    <span>{line.ordered}</span>
                    <span>{line.unit}</span>
                    <span>{formatCurrency(line.unitCost)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stepIndex === 2 && (
            <section className="rounded-xl border border-border/70 p-5">
              <h3 className="mb-4 text-sm font-semibold text-ink-1">Invoice Details</h3>
              <dl className="grid gap-x-6 sm:grid-cols-2">
                <ReviewRow label="Purchase Order" value={order.purchaseId} />
                <ReviewRow label="Billed To" value={watch("billedTo")} />
                <ReviewRow label="Created by" value={watch("createdBy")} />
                <ReviewRow
                  label="Invoice Type"
                  value={
                    INVOICE_TYPES.find((type) => type.value === watch("invoiceType"))?.label ?? "—"
                  }
                />
                <ReviewRow
                  label="Supplier"
                  value={
                    MOCK_SUPPLIERS.find((supplier) => supplier.id === watch("supplierId"))?.name ??
                    "—"
                  }
                />
                <ReviewRow label="Issue Date" value={watch("issueDate") || "—"} />
                <ReviewRow label="Due Date" value={watch("dueDate") || "—"} />
                <ReviewRow label="Notes" value={watch("notes") || "—"} />
              </dl>

              <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-3">
                <span className="text-sm font-semibold text-ink-1">Invoice total</span>
                <span className="text-lg font-semibold text-ink-1">
                  {formatCurrency(linesTotal)}
                </span>
              </div>
            </section>
          )}
        </form>
      </div>
    </FormDialog>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-1.5">
      <dt className="text-xs text-ink-3">{label}</dt>
      <dd className="min-w-0 text-xs break-words text-ink-1">{value}</dd>
    </div>
  );
}
