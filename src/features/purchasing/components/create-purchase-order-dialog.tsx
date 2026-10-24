"use client";

import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { z } from "zod";
import { SupplierFormModal } from "@/components/supliers/suplier-form-modal";
import { useSuppliers } from "@/hooks/use-suppliers";
import { PurchaseDialog } from "./purchase-dialog";
import { PurchaseDateInput } from "./purchase-date-input";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import {
  Field,
  SelectInput,
  TextInput,
  TextareaInput,
} from "@/components/form/app-fields";
import { Stepper } from "@/components/ui/stepper";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  MOCK_INVENTORY_RECORDS,
  MOCK_SUPPLIERS,
} from "@/features/inventory/mock-data";
import { purchasingService } from "../purchasing.service";
import {
  GrandTotalBar,
  ReviewCard,
  ReviewRow,
  formatReviewDate,
} from "./review";
import { DELIVERY_METHODS, PURCHASE_UNITS, PRODUCT_VARIANTS } from "../types";

const CREATED_BY_OPTIONS = ["Inventory Manager", "Branch Manager", "Owner"];

const STEPS = [
  { id: "order", label: "Supplier and Logistics" },
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
  deliveryAddress: z.string().optional(),
  contactPerson: z.string().optional(),
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
  [
    "supplierId",
    "orderDate",
    "createdBy",
    "expectedDelivery",
    "branchId",
    "deliveryMethod",
  ],
  ["lines"],
  [],
];

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

const inlineControl =
  "h-9 border-transparent bg-transparent px-2 text-xs hover:border-border focus-visible:border-primary";

export function CreatePurchaseOrderDialog({
  open,
  onOpenChange,
  onSuccess,
  seedLine,
}: CreatePurchaseOrderDialogProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [supplierOpen, setSupplierOpen] = useState(false);
  const { addSupplier } = useSuppliers();
  const { branches } = useBranch();
  const toast = useToast();

  const defaults: CreateOrderValues = useMemo(
    () => ({
      orderDate: new Intl.DateTimeFormat("en-CA", {
        timeZone: "Africa/Lagos",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
      createdBy: CREATED_BY_OPTIONS[0],
      branchId: "",
      supplierId: "",
      supplierReference: "",
      expectedDelivery: "",
      deliveryMethod: DELIVERY_METHODS[0].value,
      deliveryAddress: "",
      contactPerson: "",
      notes: "",
      lines: [
        seedLine
          ? {
              ...blankLine,
              productName: seedLine.productName,
              unitCost: seedLine.unitCost,
              quantity: seedLine.quantity ?? 1,
            }
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
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrderValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  const { fields, append, remove } = useFieldArray({ control, name: "lines" });
  const values = useWatch({ control }) as CreateOrderValues;
  const lines = values.lines ?? [];
  const lineTotal = (line: { quantity?: unknown; unitCost?: unknown }) =>
    Number(line.quantity || 0) * Number(line.unitCost || 0);
  const grandTotal = lines.reduce((sum, line) => sum + lineTotal(line), 0);

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

  const onSubmit = handleSubmit(
    async (values) => {
      try {
        const { purchaseId } = await purchasingService.createOrder({
          orderDate: values.orderDate,
          createdBy: values.createdBy,
          branchId: values.branchId,
          supplierId: values.supplierId,
          supplierReference: values.supplierReference,
          expectedDelivery: values.expectedDelivery,
          deliveryMethod: values.deliveryMethod,
          deliveryAddress: values.deliveryAddress,
          contactPerson: values.contactPerson,
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
          title: "Submitted for approval",
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
    },
    (errors) => {
      const invalidStep = STEP_FIELDS.findIndex((fields) =>
        fields.some((field) => field in errors),
      );
      if (invalidStep >= 0) setStepIndex(invalidStep);
    },
  );

  const supplierName =
    MOCK_SUPPLIERS.find((supplier) => supplier.id === values.supplierId)
      ?.name ?? "—";
  const branchName =
    branches.find((branch) => branch.id === values.branchId)?.name ?? "—";
  const deliveryLabel =
    DELIVERY_METHODS.find((method) => method.value === values.deliveryMethod)
      ?.label ?? "—";

  return (
    <>
      <PurchaseDialog
        className={`purchase-create-dialog ${isLastStep ? "purchase-review-dialog" : ""}`}
        open={open}
        onOpenChange={handleOpenChange}
        title="Create Purchase Order"
        description="Fill in the details to create a new purchase order"
        footer={
          <>
            <SecondaryButton
              onClick={() =>
                stepIndex === 0
                  ? handleOpenChange(false)
                  : setStepIndex((index) => index - 1)
              }
              disabled={isSubmitting}
              leftIcon={
                stepIndex === 1 ? (
                  <ArrowLeftIcon size={20} strokeWidth={1.5} />
                ) : undefined
              }
            >
              {stepIndex === 0 ? "Cancel" : "Back"}
            </SecondaryButton>
            <PrimaryButton
              onClick={isLastStep ? onSubmit : goNext}
              loading={isSubmitting}
              rightIcon={
                !isLastStep ? (
                  <ArrowRightIcon size={20} strokeWidth={1.5} />
                ) : undefined
              }
            >
              {isLastStep ? "Submit Order" : "Next"}
            </PrimaryButton>
          </>
        }
      >
        <div className="purchase-body flex flex-col gap-6">
          <Stepper
            steps={STEPS}
            currentIndex={stepIndex}
            onStepSelect={setStepIndex}
            className="overflow-x-auto pb-1"
          />

          <form onSubmit={(event) => event.preventDefault()}>
            {stepIndex === 0 && (
              <div className="purchase-fields grid gap-x-4 gap-y-4 sm:grid-cols-2">
                <Field
                  label="Order Date"
                  htmlFor="orderDate"
                  required
                  error={errors.orderDate?.message}
                >
                  <PurchaseDateInput
                    id="orderDate"
                    showIcon={false}
                    displayValue={values.orderDate}
                    invalid={!!errors.orderDate}
                    {...register("orderDate")}
                  />
                </Field>
                <Field
                  label="Created by"
                  htmlFor="createdBy"
                  error={errors.createdBy?.message}
                >
                  <SelectInput id="createdBy" {...register("createdBy")}>
                    {CREATED_BY_OPTIONS.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </SelectInput>
                </Field>
                <Field
                  label="Receiving Branch"
                  htmlFor="branchId"
                  error={errors.branchId?.message}
                  className="sm:col-span-2"
                >
                  <SelectInput
                    id="branchId"
                    invalid={!!errors.branchId}
                    {...register("branchId")}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <div>
                  <Field
                    label="Select Supplier"
                    htmlFor="supplierId"
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
                  <button
                    type="button"
                    onClick={() => setSupplierOpen(true)}
                    className="mt-3 flex items-center gap-2 text-xs text-primary"
                  >
                    <PlusIcon className="size-4" strokeWidth={1.5} />
                    Add New Supplier
                  </button>
                </div>
                <Field
                  label="Supplier’s Reference/Invoice Number"
                  htmlFor="supplierReference"
                >
                  <TextInput
                    id="supplierReference"
                    placeholder="+23480456378"
                    {...register("supplierReference")}
                  />
                </Field>
                <Field
                  label="Expected Delivery Date"
                  htmlFor="expectedDelivery"
                  required
                  error={errors.expectedDelivery?.message}
                >
                  <PurchaseDateInput
                    id="expectedDelivery"
                    showIcon={false}
                    displayValue={values.expectedDelivery}
                    placeholder="Select Date"
                    invalid={!!errors.expectedDelivery}
                    {...register("expectedDelivery")}
                  />
                </Field>
                <Field
                  label="Delivery Method"
                  htmlFor="deliveryMethod"
                  error={errors.deliveryMethod?.message}
                >
                  <SelectInput
                    id="deliveryMethod"
                    {...register("deliveryMethod")}
                  >
                    {DELIVERY_METHODS.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field
                  label="Notes (Optional)"
                  htmlFor="po-notes"
                  className="sm:col-span-2"
                >
                  <TextareaInput
                    id="po-notes"
                    placeholder="Urgent order"
                    className="min-h-[112px]"
                    {...register("notes")}
                  />
                </Field>
              </div>
            )}

            {stepIndex === 1 && (
              <div className="purchase-products flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-ink-2">Products</h3>
                  <p className="mt-4 text-xs text-ink-3">Choose items…</p>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <div className="grid min-w-[760px] grid-cols-[2fr_1.2fr_1.15fr_0.95fr_1.05fr_0.95fr_24px] gap-2 bg-surface-muted px-2 py-3 text-[11px] font-semibold text-ink-1">
                    <span>Product</span>
                    <span>Variant</span>
                    <span>Unit</span>
                    <span>Quantity</span>
                    <span>Unit Cost (₦)</span>
                    <span>Total (₦)</span>
                    <span className="sr-only">Actions</span>
                  </div>

                  {fields.map((field, index) => {
                    const productRegistration = register(
                      `lines.${index}.productName`,
                    );
                    return (
                      <div
                        key={field.id}
                        className="grid min-w-[760px] grid-cols-[2fr_1.2fr_1.15fr_0.95fr_1.05fr_0.95fr_24px] items-center gap-2 px-2 py-2"
                      >
                        <div className="relative">
                          <select
                            aria-label="Product"
                            {...productRegistration}
                            onChange={(event) => {
                              productRegistration.onChange(event);
                              const match = CATALOG.find(
                                (entry) => entry.name === event.target.value,
                              );
                              if (match)
                                setValue(
                                  `lines.${index}.unitCost`,
                                  match.unitCost,
                                );
                            }}
                            className={cn(
                              "w-full appearance-none rounded-lg border pr-6 text-ink-1 outline-none",
                              inlineControl,
                              errors.lines?.[index]?.productName &&
                                "border-destructive",
                            )}
                          >
                            <option value="">Select product</option>
                            {!CATALOG.some(
                              (entry) => entry.name === field.productName,
                            ) &&
                              field.productName && (
                                <option value={field.productName}>
                                  {field.productName}
                                </option>
                              )}
                            {CATALOG.map((entry) => (
                              <option key={entry.name} value={entry.name}>
                                {entry.name}
                              </option>
                            ))}
                          </select>
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
                        <div className="purchase-money relative">
                          <TextInput
                            aria-label="Unit cost"
                            type="number"
                            min={0}
                            step="0.01"
                            className={cn(inlineControl, "rounded-lg")}
                            invalid={!!errors.lines?.[index]?.unitCost}
                            {...register(`lines.${index}.unitCost`)}
                          />
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-xs text-ink-2"
                          >
                            {formatNumber(Number(lines[index]?.unitCost) || 0)}
                          </span>
                        </div>
                        <p
                          className="px-2 text-xs text-ink-2"
                          aria-label="Line total"
                        >
                          {formatNumber(lineTotal(lines[index] ?? {}))}
                        </p>

                        <button
                          type="button"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                          aria-label="Remove product"
                          className="justify-self-end rounded-md p-1.5 text-ink-3 transition-colors hover:bg-danger-bg hover:text-danger-fg disabled:pointer-events-none disabled:opacity-40"
                        >
                          <Trash2Icon className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {errors.lines?.some?.(
                  (line) =>
                    line?.productName || line?.quantity || line?.unitCost,
                ) && (
                  <p role="alert" className="text-xs text-destructive">
                    Choose a product, enter a quantity greater than zero, and a
                    valid unit cost for each row.
                  </p>
                )}
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
                  <ReviewRow
                    label="Order Date:"
                    value={formatReviewDate(values.orderDate)}
                  />
                  <ReviewRow label="Created by:" value={values.createdBy} />
                  <ReviewRow label="Branch:" value={branchName} />
                  <ReviewRow label="Supplier:" value={supplierName} />
                  <ReviewRow
                    label="Supplier’s Reference/Invoice Number:"
                    value={values.supplierReference || "—"}
                  />
                  <ReviewRow label="Delivery Method:" value={deliveryLabel} />
                  <ReviewRow label="Notes:" value={values.notes || "—"} wrap />
                </ReviewCard>

                <ReviewCard title="Products">
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <div className="grid min-w-[560px] grid-cols-6 gap-3 bg-surface-muted px-2 py-3 text-[11px] font-semibold text-ink-1">
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
                        className="grid min-w-[560px] grid-cols-6 gap-3 min-h-16 items-center border-t border-border/40 px-3 py-3 text-sm text-ink-2"
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

                  <GrandTotalBar amount={grandTotal} />
                </ReviewCard>
              </div>
            )}
          </form>
        </div>
      </PurchaseDialog>
      <SupplierFormModal
        open={supplierOpen}
        onClose={() => setSupplierOpen(false)}
        onSubmit={async (input) => {
          await addSupplier(input);
          const supplier = {
            id: `sup_${crypto.randomUUID()}`,
            name: input.name,
          };
          MOCK_SUPPLIERS.push(supplier);
          setValue("supplierId", supplier.id, { shouldValidate: true });
          setSupplierOpen(false);
        }}
      />
    </>
  );
}
