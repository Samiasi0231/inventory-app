"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { z } from "zod";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton } from "@/components/button";
import { Field, SelectInput, TextInput, TextareaInput } from "@/components/form/app-fields";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { cn } from "@/lib/utils";
import { MOCK_SUPPLIERS, MOCK_UNITS } from "../mock-data";
import { inventoryService } from "../inventory.service";
import type { InventoryItem } from "../types";

const reorderSchema = z.object({
  supplierId: z.string().min(1, "Select a supplier"),
  supplierReference: z.string().optional(),
  quantity: z.coerce.number().positive("Enter a quantity"),
  unit: z.string().min(1, "Pick a unit"),
  expectedCostPrice: z.coerce.number().nonnegative("Enter a cost price"),
  expectedDeliveryDate: z.string().optional(),
  deliveryBranchId: z.string().min(1, "Select a delivery location"),
  notes: z.string().optional(),
});

type ReorderValues = z.input<typeof reorderSchema>;

type SectionId = "supplier" | "item" | "delivery";

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-base font-semibold text-ink-1">{title}</span>
        <ChevronDownIcon
          className={cn("size-5 shrink-0 text-ink-2 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
}

interface ReorderStockDialogProps {
  item: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

/** Raises a purchase order for a product that is running low. */
export function ReorderStockDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: ReorderStockDialogProps) {
  const { branches } = useBranch();
  const toast = useToast();
  const [openSection, setOpenSection] = useState<SectionId>("supplier");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ReorderValues>({
    resolver: zodResolver(reorderSchema),
    defaultValues: {
      supplierId: "",
      supplierReference: "",
      // Suggest topping back up to the reorder point.
      quantity: Math.max(1, item.reorderPoint - item.totalStock),
      unit: item.baseUnit,
      expectedCostPrice: item.costPrice,
      expectedDeliveryDate: "",
      deliveryBranchId: item.branchId,
      notes: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { reference } = await inventoryService.reorderStock({
        branchId: values.deliveryBranchId,
        productId: item.productId,
        supplierId: values.supplierId,
        quantity: Number(values.quantity),
        unit: values.unit,
        expectedCostPrice: Number(values.expectedCostPrice),
        expectedDeliveryDate: values.expectedDeliveryDate
          ? new Date(values.expectedDeliveryDate).toISOString()
          : undefined,
        notes: values.notes,
      });

      toast.add({
        type: "success",
        title: "Purchase order created",
        description: `${item.name} • reference ${reference}`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch {
      toast.add({
        type: "error",
        title: "Couldn't create purchase order",
        description: "Please check the details and try again.",
      });
    }
  });

  function toggle(section: SectionId) {
    setOpenSection((current) => (current === section ? current : section));
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create Purchase Order"
      description="Fill in the details to create a new purchase order"
      footer={
        <div className="flex w-full justify-end">
          <PrimaryButton onClick={onSubmit} loading={isSubmitting}>
            Create Purchase Order
          </PrimaryButton>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col">
        <Section
          title="Suppliers Information"
          open={openSection === "supplier"}
          onToggle={() => toggle("supplier")}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Select Supplier" htmlFor="supplierId" error={errors.supplierId?.message}>
              <SelectInput id="supplierId" invalid={!!errors.supplierId} {...register("supplierId")}>
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
            className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-700"
          >
            <PlusIcon className="size-4" />
            Add New Supplier
          </button>
        </Section>

        <Section
          title="Item Information"
          open={openSection === "item"}
          onToggle={() => toggle("item")}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Product">
              <TextInput value={item.name} readOnly aria-readonly />
            </Field>

            <Field label="Quantity" htmlFor="quantity" required error={errors.quantity?.message}>
              <TextInput
                id="quantity"
                type="number"
                min={1}
                invalid={!!errors.quantity}
                {...register("quantity")}
              />
            </Field>

            <Field label="Unit" htmlFor="unit" required error={errors.unit?.message}>
              <SelectInput id="unit" invalid={!!errors.unit} {...register("unit")}>
                {MOCK_UNITS.map((unit) => (
                  <option key={unit.id} value={unit.name}>
                    {unit.name}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field
              label="Expected Cost Price"
              htmlFor="expectedCostPrice"
              required
              error={errors.expectedCostPrice?.message}
            >
              <TextInput
                id="expectedCostPrice"
                type="number"
                min={0}
                step="0.01"
                invalid={!!errors.expectedCostPrice}
                {...register("expectedCostPrice")}
              />
            </Field>
          </div>
        </Section>

        <Section
          title="Delivery and Logistics"
          open={openSection === "delivery"}
          onToggle={() => toggle("delivery")}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Expected Delivery Date" htmlFor="expectedDeliveryDate">
              <TextInput id="expectedDeliveryDate" type="date" {...register("expectedDeliveryDate")} />
            </Field>

            <Field
              label="Deliver To"
              htmlFor="deliveryBranchId"
              required
              error={errors.deliveryBranchId?.message}
            >
              <SelectInput
                id="deliveryBranchId"
                invalid={!!errors.deliveryBranchId}
                {...register("deliveryBranchId")}
              >
                <option value="">Select Location</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          <Field label="Notes (Optional)" htmlFor="reorder-notes" className="mt-4">
            <TextareaInput
              id="reorder-notes"
              placeholder="Deliver before the weekend rush"
              {...register("notes")}
            />
          </Field>
        </Section>
      </form>
    </FormDialog>
  );
}
