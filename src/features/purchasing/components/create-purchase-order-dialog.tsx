"use client";

import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { z } from "zod";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, SelectInput, TextInput, TextareaInput } from "@/components/form/app-fields";
import { Stepper } from "@/components/ui/stepper";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { MOCK_INVENTORY_RECORDS, MOCK_SUPPLIERS } from "@/features/inventory/mock-data";
import { purchasingService } from "../purchasing.service";
import { DELIVERY_METHODS, PURCHASE_UNITS, PRODUCT_VARIANTS } from "../types";

const CREATED_BY_OPTIONS = ["Inventory Manager", "Branch Manager", "Owner"];

const STEPS = [
  { id: "logistics", label: "Supplier and Logistics" },
  { id: "products", label: "Products" },
  { id: "review", label: "Review" },
];

const schema = z.object({
  orderDate: z.string().min(1, "Pick an order date"),
  createdBy: z.string().min(1, "Select who is raising this"),
  branchId: z.string().min(1, "Select a receiving branch"),
  supplierId: z.string().min(1, "Select a supplier"),
  supplierReference: z.string().optional(),
  expectedDelivery: z.string().min(1, "Pick an expected delivery date"),
  deliveryMethod: z.string().min(1, "Select a delivery method"),
  notes: z.string().optional(),
  lines: z
    .array(
      z.object({
        productName: z.string().min(1, "Choose a product"),
        variant: z.string().optional(),
        unit: z.string().min(1, "Pick a unit"),
        quantity: z.coerce.number().positive("Enter a quantity"),
        unitCost: z.coerce.number().nonnegative("Enter a unit cost"),
      }),
    )
    .min(1, "Add at least one product"),
});

type CreateOrderValues = z.input<typeof schema>;

const STEP_FIELDS: (keyof CreateOrderValues)[][] = [
  ["orderDate", "createdBy", "branchId", "supplierId", "expectedDelivery", "deliveryMethod"],
  ["lines"],
  [],
];

/** A line to pre-fill, e.g. the product a reorder was started from. */
export interface SeedLine {
  productName: string;
  unitCost: number;
  quantity?: number;
}

interface CreatePurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  seedLine?: SeedLine;
}

/** Catalog products offered on the Products step, with their last cost. */
const CATALOG = (() => {
  const seen = new Map<string, number>();
  for (const record of MOCK_INVENTORY_RECORDS) {
    if (!seen.has(record.name)) seen.set(record.name, record.costPrice);
  }
  return [...seen.entries()].map(([name, unitCost]) => ({ name, unitCost }));
})();

const blankLine = {
  productName: "",
  variant: PRODUCT_VARIANTS[0],
  unit: PURCHASE_UNITS[1],
  quantity: 1,
  unitCost: 0,
};

/** Borderless until hovered or focused, as the Products table is drawn. */
const inlineControl =
  "h-9 border-transparent bg-transparent px-2 text-xs hover:border-border focus-visible:border-primary";

export function CreatePurchaseOrderDialog({
  open,
  onOpenChange,
  onSuccess,
  seedLine,
}: CreatePurchaseOrderDialogProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const { branches } = useBranch();
  const toast = useToast();

  const defaults: CreateOrderValues = useMemo(
    () => ({
      orderDate: new Date().toISOString().slice(0, 10),
      createdBy: CREATED_BY_OPTIONS[0],
      branchId: "",
      supplierId: "",
      supplierReference: "",
      expectedDelivery: "",
      deliveryMethod: DELIVERY_METHODS[0].value,
      notes: "",
      lines: [
        seedLine
          ? { ...blankLine, productName: seedLine.productName, unitCost: seedLine.unitCost, quantity: seedLine.quantity ?? 1 }
          : blankLine,
      ],
    }),
    [seedLine],
  );

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrderValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const lines = watch("lines") ?? [];
  const lineTotal = (line: { quantity?: unknown; unitCost?: unknown }) =>
    Number(line.quantity || 0) * Number(line.unitCost || 0);
  const grandTotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);

  /** Clear the wizard on close so the next one starts from a blank form. */
  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset(defaults);
      setStepIndex(0);
    }
    onOpenChange(nextOpen);
  }

  async function goNext() {
    const fieldsToCheck = STEP_FIELDS[stepIndex];
    const valid = fieldsToCheck.length === 0 || (await trigger(fieldsToCheck));
    if (!valid) return;
    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  }

  const isLastStep = stepIndex === STEPS.length - 1;

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { purchaseId } = await purchasingService.createOrder({
        orderDate: values.orderDate,
        createdBy: values.createdBy,
        branchId: values.branchId,
        supplierId: values.supplierId,
        supplierReference: values.supplierReference,
        expectedDelivery: values.expectedDelivery,
        deliveryMethod: values.deliveryMethod,
        notes: values.notes,
        lines: values.lines.map((line) => ({
          productName: line.productName,
          variant: line.variant ?? "",
          quantity: Number(line.quantity),
          unit: line.unit,
          unitCost: Number(line.unitCost),
        })),
      });

      toast.add({
        type: "success",
        title: "Purchase order created",
        description: `${purchaseId} is awaiting approval.`,
      });
      handleOpenChange(false);
      onSuccess?.();
    } catch {
      toast.add({
        type: "error",
        title: "Couldn't create purchase order",
        description: "Please check the details and try again.",
      });
    }
  });

  const supplierName =
    MOCK_SUPPLIERS.find((supplier) => supplier.id === watch("supplierId"))?.name ?? "—";
  const branchName = branches.find((branch) => branch.id === watch("branchId"))?.name ?? "—";
  const deliveryLabel =
    DELIVERY_METHODS.find((method) => method.value === watch("deliveryMethod"))?.label ?? "—";

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Create Purchase Order"
      description="Fill in the details to create a new purchase order"
      className="sm:max-w-[950px]"
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
              Create Purchase Order
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
                <Field label="Order Date" htmlFor="orderDate" required error={errors.orderDate?.message}>
                  <TextInput
                    id="orderDate"
                    type="date"
                    invalid={!!errors.orderDate}
                    {...register("orderDate")}
                  />
                </Field>

                <Field label="Created by" htmlFor="createdBy" error={errors.createdBy?.message}>
                  <SelectInput id="createdBy" {...register("createdBy")}>
                    {CREATED_BY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>

              <Field label="Receiving Branch" htmlFor="branchId" error={errors.branchId?.message}>
                <SelectInput id="branchId" invalid={!!errors.branchId} {...register("branchId")}>
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Select Supplier" htmlFor="supplierId" error={errors.supplierId?.message}>
                  <SelectInput
                    id="supplierId"
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

                <Field label="Supplier's Reference/Invoice Number" htmlFor="supplierReference">
                  <TextInput
                    id="supplierReference"
                    placeholder="+23480456378"
                    {...register("supplierReference")}
                  />
                </Field>
              </div>

              <button
                type="button"
                className="-mt-2 flex w-fit items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-brand-700"
              >
                <PlusIcon className="size-3.5" />
                Add New Supplier
              </button>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Expected Delivery"
                  htmlFor="expectedDelivery"
                  required
                  error={errors.expectedDelivery?.message}
                >
                  <TextInput
                    id="expectedDelivery"
                    type="date"
                    invalid={!!errors.expectedDelivery}
                    {...register("expectedDelivery")}
                  />
                </Field>

                <Field
                  label="Delivery Method"
                  htmlFor="deliveryMethod"
                  error={errors.deliveryMethod?.message}
                >
                  <SelectInput id="deliveryMethod" {...register("deliveryMethod")}>
                    {DELIVERY_METHODS.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>

              <Field label="Notes (Optional)" htmlFor="po-notes">
                <TextareaInput id="po-notes" placeholder="Urgent order" {...register("notes")} />
              </Field>
            </div>
          )}

          {stepIndex === 1 && (
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-semibold text-ink-2">Products</h3>
                <p className="mt-1 text-[11px] text-ink-3">Choose items…</p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border/70">
                <div className="grid min-w-[760px] grid-cols-[1.5fr_1.1fr_1.1fr_0.7fr_1fr_1fr_32px] gap-2 bg-surface-muted px-4 py-3 text-[11px] font-semibold text-ink-1">
                  <span>Product</span>
                  <span>Variant</span>
                  <span>Unit</span>
                  <span>Quantity</span>
                  <span>Unit Cost (₦)</span>
                  <span>Total (₦)</span>
                  <span />
                </div>

                {fields.map((field, index) => {
                  const productRegistration = register(`lines.${index}.productName`);
                  return (
                    <div
                      key={field.id}
                      className="grid min-w-[760px] grid-cols-[1.5fr_1.1fr_1.1fr_0.7fr_1fr_1fr_32px] items-center gap-2 border-t border-border/50 px-4 py-2"
                    >
                      <div className="relative">
                        <select
                          aria-label="Product"
                          {...productRegistration}
                          onChange={(event) => {
                            productRegistration.onChange(event);
                            const match = CATALOG.find((entry) => entry.name === event.target.value);
                            if (match) setValue(`lines.${index}.unitCost`, match.unitCost);
                          }}
                          className={cn(
                            "w-full appearance-none rounded-lg border pr-6 text-ink-1 outline-none",
                            inlineControl,
                            errors.lines?.[index]?.productName && "border-destructive",
                          )}
                        >
                          <option value="">Select product</option>
                          {!CATALOG.some((entry) => entry.name === field.productName) &&
                            field.productName && (
                              <option value={field.productName}>{field.productName}</option>
                            )}
                          {CATALOG.map((entry) => (
                            <option key={entry.name} value={entry.name}>
                              {entry.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon
                          aria-hidden
                          className="pointer-events-none absolute top-1/2 right-1 size-3.5 -translate-y-1/2 text-ink-3"
                        />
                      </div>

                      <div className="relative">
                        <select
                          aria-label="Variant"
                          {...register(`lines.${index}.variant`)}
                          className={cn(
                            "w-full appearance-none rounded-lg border pr-6 text-ink-2 outline-none",
                            inlineControl,
                          )}
                        >
                          {PRODUCT_VARIANTS.map((variant) => (
                            <option key={variant} value={variant}>
                              {variant}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon
                          aria-hidden
                          className="pointer-events-none absolute top-1/2 right-1 size-3.5 -translate-y-1/2 text-ink-3"
                        />
                      </div>

                      <div className="relative">
                        <select
                          aria-label="Unit"
                          {...register(`lines.${index}.unit`)}
                          className={cn(
                            "w-full appearance-none rounded-lg border pr-6 text-ink-2 outline-none",
                            inlineControl,
                          )}
                        >
                          {PURCHASE_UNITS.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                        <ChevronDownIcon
                          aria-hidden
                          className="pointer-events-none absolute top-1/2 right-1 size-3.5 -translate-y-1/2 text-ink-3"
                        />
                      </div>

                      <TextInput
                        aria-label="Quantity"
                        type="number"
                        min={1}
                        className={cn(inlineControl, "rounded-lg")}
                        invalid={!!errors.lines?.[index]?.quantity}
                        {...register(`lines.${index}.quantity`)}
                      />
                      <TextInput
                        aria-label="Unit cost"
                        type="number"
                        min={0}
                        className={cn(inlineControl, "rounded-lg")}
                        invalid={!!errors.lines?.[index]?.unitCost}
                        {...register(`lines.${index}.unitCost`)}
                      />
                      <p className="px-2 text-xs text-ink-2" aria-label="Line total">
                        {formatNumber(lineTotal(lines[index] ?? {}))}
                      </p>

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        aria-label="Remove product"
                        className="justify-self-end rounded-md p-1.5 text-ink-3 transition-colors hover:bg-danger-bg hover:text-danger-fg disabled:pointer-events-none disabled:opacity-40"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {errors.lines?.message && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.lines.message}
                </p>
              )}

              <button
                type="button"
                onClick={() => append(blankLine)}
                className="flex w-fit items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-brand-700"
              >
                <PlusIcon className="size-3.5" />
                Add Product
              </button>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="flex flex-col gap-5">
              <ReviewCard title="Supplier and Logistics">
                <ReviewRow label="Order Date:" value={formatReviewDate(watch("orderDate"))} />
                <ReviewRow label="Created by:" value={watch("createdBy")} />
                <ReviewRow label="Branch:" value={branchName} />
                <ReviewRow label="Supplier:" value={supplierName} />
                <ReviewRow
                  label="Supplier's Reference/Invoice Number:"
                  value={watch("supplierReference") || "—"}
                />
                <ReviewRow label="Delivery Method:" value={deliveryLabel} />
                <ReviewRow label="Notes:" value={watch("notes") || "—"} wrap />
              </ReviewCard>

              <ReviewCard title="Products">
                <div className="overflow-x-auto rounded-lg border border-border/70">
                  <div className="grid min-w-[560px] grid-cols-[1.4fr_1fr_0.8fr_0.7fr_1fr_1fr] gap-3 bg-surface-muted px-4 py-3 text-[11px] font-semibold text-ink-1">
                    <span>Product</span>
                    <span>Variant</span>
                    <span>Unit</span>
                    <span>Quantity</span>
                    <span>Unit Cost (₦)</span>
                    <span>Total (₦)</span>
                  </div>
                  {lines.map((line, index) => (
                    <div
                      key={index}
                      className="grid min-w-[560px] grid-cols-[1.4fr_1fr_0.8fr_0.7fr_1fr_1fr] gap-3 border-t border-border/50 px-4 py-3 text-xs text-ink-2"
                    >
                      <span>{line.productName || "—"}</span>
                      <span>{line.variant || "—"}</span>
                      <span>{line.unit}</span>
                      <span>{String(line.quantity)}</span>
                      <span>{formatNumber(Number(line.unitCost) || 0)}</span>
                      <span>{formatNumber(lineTotal(line))}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-accent px-4 py-3 text-accent-foreground">
                  <span className="text-xs font-semibold">Grand Total</span>
                  <span className="text-sm font-semibold">₦{formatNumber(grandTotal)}</span>
                </div>
              </ReviewCard>
            </div>
          )}
        </form>
      </div>
    </FormDialog>
  );
}

function formatReviewDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-NG", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(value),
  );
}

function ReviewCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border/70 p-5 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]">
      <h3 className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-ink-1">
        <span aria-hidden className="size-1 rounded-full bg-ink-1" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function ReviewRow({ label, value, wrap }: { label: string; value: string; wrap?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-6 py-1.5 text-[13px]">
      <dt className="shrink-0 text-ink-3">{label}</dt>
      <dd className={cn("text-right text-ink-2", wrap ? "max-w-[260px]" : "")}>{value}</dd>
    </div>
  );
}
