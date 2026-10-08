"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { z } from "zod";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Field, SelectInput, TextInput, TextareaInput } from "@/components/form/app-fields";
import { Stepper } from "@/components/ui/stepper";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { formatCurrency } from "@/lib/format";
import { MOCK_SUPPLIERS, MOCK_UNITS } from "@/features/inventory/mock-data";
import { purchasingService } from "../purchasing.service";
import { DELIVERY_METHODS } from "../types";

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
        productName: z.string().min(1, "Name the product"),
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

interface CreatePurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreatePurchaseOrderDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreatePurchaseOrderDialogProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const { branches, activeBranch } = useBranch();
  const toast = useToast();

  const defaults: CreateOrderValues = {
    orderDate: new Date().toISOString().slice(0, 10),
    createdBy: CREATED_BY_OPTIONS[0],
    branchId: activeBranch.id,
    supplierId: "",
    supplierReference: "",
    expectedDelivery: "",
    deliveryMethod: DELIVERY_METHODS[0].value,
    notes: "",
    lines: [{ productName: "", variant: "", unit: "Carton", quantity: 1, unitCost: 0 }],
  };

  const form = useForm<CreateOrderValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const lines = watch("lines") ?? [];
  const orderTotal = lines.reduce(
    (sum, line) => sum + Number(line.quantity || 0) * Number(line.unitCost || 0),
    0,
  );

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

                <Field
                  label="Receiving Branch"
                  htmlFor="branchId"
                  required
                  error={errors.branchId?.message}
                  className="sm:col-span-2"
                >
                  <SelectInput id="branchId" invalid={!!errors.branchId} {...register("branchId")}>
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>

                <Field
                  label="Select Supplier"
                  htmlFor="supplierId"
                  required
                  error={errors.supplierId?.message}
                >
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
                className="flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-700"
              >
                <PlusIcon className="size-4" />
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
                <h3 className="text-base font-semibold text-ink-1">Products</h3>
                <p className="mt-0.5 text-xs text-ink-3">Choose items…</p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <div className="grid min-w-[720px] grid-cols-[1.3fr_1fr_0.8fr_0.8fr_1fr_auto] gap-3 bg-surface-muted px-4 py-3 text-xs font-semibold text-ink-1">
                  <span>Product</span>
                  <span>Variant</span>
                  <span>Unit</span>
                  <span>Quantity</span>
                  <span>Unit Cost</span>
                  <span className="w-8" />
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid min-w-[720px] grid-cols-[1.3fr_1fr_0.8fr_0.8fr_1fr_auto] items-center gap-3 border-t border-border/60 px-4 py-3"
                  >
                    <TextInput
                      aria-label="Product"
                      placeholder="Minimie Chin Chin"
                      className="h-9 text-sm"
                      invalid={!!errors.lines?.[index]?.productName}
                      {...register(`lines.${index}.productName`)}
                    />
                    <TextInput
                      aria-label="Variant"
                      placeholder="Large / Milk"
                      className="h-9 text-sm"
                      {...register(`lines.${index}.variant`)}
                    />
                    <SelectInput
                      aria-label="Unit"
                      className="h-9 text-sm"
                      {...register(`lines.${index}.unit`)}
                    >
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
                    <TextInput
                      aria-label="Unit cost"
                      type="number"
                      min={0}
                      className="h-9 text-sm"
                      invalid={!!errors.lines?.[index]?.unitCost}
                      {...register(`lines.${index}.unitCost`)}
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      aria-label="Remove product"
                      className="justify-self-end rounded-md p-2 text-ink-4 transition-colors hover:bg-danger-bg hover:text-danger-fg disabled:pointer-events-none disabled:opacity-40"
                    >
                      <Trash2Icon className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  append({ productName: "", variant: "", unit: "Carton", quantity: 1, unitCost: 0 })
                }
                className="flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-700"
              >
                <PlusIcon className="size-4" />
                Add Product
              </button>
            </div>
          )}

          {stepIndex === 2 && (
            <div className="flex flex-col gap-5">
              <section className="rounded-xl border border-border/70 p-5">
                <h3 className="mb-4 text-sm font-semibold text-ink-1">Supplier and Logistics</h3>
                <dl className="grid gap-x-6 sm:grid-cols-2">
                  <ReviewRow label="Order Date" value={watch("orderDate")} />
                  <ReviewRow label="Created by" value={watch("createdBy")} />
                  <ReviewRow label="Receiving Branch" value={branchName} />
                  <ReviewRow label="Supplier" value={supplierName} />
                  <ReviewRow label="Reference" value={watch("supplierReference") || "—"} />
                  <ReviewRow label="Expected Delivery" value={watch("expectedDelivery") || "—"} />
                  <ReviewRow
                    label="Delivery Method"
                    value={
                      DELIVERY_METHODS.find((method) => method.value === watch("deliveryMethod"))
                        ?.label ?? "—"
                    }
                  />
                  <ReviewRow label="Notes" value={watch("notes") || "—"} />
                </dl>
              </section>

              <section className="rounded-xl border border-border/70 p-5">
                <h3 className="mb-4 text-sm font-semibold text-ink-1">Products</h3>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <div className="grid min-w-[560px] grid-cols-[1.3fr_1fr_0.8fr_0.8fr_1fr] gap-3 bg-surface-muted px-4 py-3 text-xs font-semibold text-ink-1">
                    <span>Product</span>
                    <span>Variant</span>
                    <span>Unit</span>
                    <span>Quantity</span>
                    <span>Unit Cost</span>
                  </div>
                  {lines.map((line, index) => (
                    <div
                      key={index}
                      className="grid min-w-[560px] grid-cols-[1.3fr_1fr_0.8fr_0.8fr_1fr] gap-3 border-t border-border/60 px-4 py-3 text-xs text-ink-2"
                    >
                      <span className="truncate">{line.productName || "—"}</span>
                      <span className="truncate">{line.variant || "—"}</span>
                      <span>{line.unit}</span>
                      <span>{String(line.quantity)}</span>
                      <span>{formatCurrency(Number(line.unitCost) || 0)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-dashed border-border pt-3">
                  <span className="text-sm font-semibold text-ink-1">Order total</span>
                  <span className="text-lg font-semibold text-ink-1">
                    {formatCurrency(orderTotal)}
                  </span>
                </div>
              </section>
            </div>
          )}
        </form>
      </div>
    </FormDialog>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-3 py-1.5">
      <dt className="text-xs text-ink-3">{label}</dt>
      <dd className="min-w-0 text-xs break-words text-ink-1">{value}</dd>
    </div>
  );
}
