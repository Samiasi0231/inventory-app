"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { FormDialog } from "@/components/common/form-dialog";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { Stepper } from "@/components/ui/stepper";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { inventoryService } from "../../inventory.service";
import {
  ADD_PRODUCT_DEFAULTS,
  STEP_FIELDS,
  WIZARD_STEPS,
  addProductSchema,
  buildVariantNames,
  type AddProductValues,
} from "./schema";
import { StepBasicInfo } from "./step-basic-info";
import { StepInventory } from "./step-inventory";
import { StepPricingUnits } from "./step-pricing-units";
import { StepReview } from "./step-review";
import { StepVariants } from "./step-variants";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialValues?: AddProductValues;
  itemId?: string;
}

export function AddProductDialog({ open, onOpenChange, onSuccess, initialValues, itemId }: AddProductDialogProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const { activeBranch } = useBranch();
  const toast = useToast();

  const form = useForm<AddProductValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: initialValues ?? ADD_PRODUCT_DEFAULTS,
    mode: "onTouched",
  });

  const { handleSubmit, trigger, reset, formState } = form;

  /** Clear the wizard on close so the next one starts from a blank form. */
  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset(initialValues ?? ADD_PRODUCT_DEFAULTS);
      setStepIndex(0);
    }
    onOpenChange(nextOpen);
  }

  const isLastStep = stepIndex === WIZARD_STEPS.length - 1;

  async function goNext() {
    const fields = STEP_FIELDS[stepIndex];
    const valid = fields.length === 0 || (await trigger(fields));
    if (!valid) return;
    setStepIndex((index) => Math.min(index + 1, WIZARD_STEPS.length - 1));
  }

  function goBack() {
    if (stepIndex === 0) {
      handleOpenChange(false);
      return;
    }
    setStepIndex((index) => index - 1);
  }

  const onSubmit = handleSubmit(async (values) => {
    try {
      const variantNames = values.hasVariants ? buildVariantNames(values.optionGroups ?? []) : [];
      const overrides = values.variantOverrides ?? [];
      const openingStock = values.openingStock ?? [];

      await inventoryService.saveProduct(itemId, values, {
        name: values.name,
        type: values.type,
        sku: values.sku,
        barcode: values.barcode,
        categoryId: values.categoryId,
        brandId: values.brandId || null,
        imageDataUrl: values.imageDataUrl ?? null,
        baseUnit: values.baseUnit,
        defaultSellingPrice: Number(values.defaultSellingPrice),
        defaultCostPrice: Number(values.defaultCostPrice),
        unitConversions: (values.unitConversions ?? []).map((conversion) => ({
          unit: conversion.unit,
          equals: Number(conversion.equals),
          baseUnit: conversion.baseUnit,
        })),
        quantityDiscounts: (values.quantityDiscounts ?? []).map((discount) => ({
          minQuantity: Number(discount.minQuantity),
          unit: discount.unit,
          discountType: discount.discountType,
          discount: Number(discount.discount),
        })),
        taxSchemeId: values.taxSchemeId || null,
        branchId: openingStock[0]?.branchId ?? activeBranch.id,
        openingStock: openingStock.reduce((total, row) => total + Number(row.quantity || 0), 0),
        reorderPoint: Number(values.reorderPoint),
        trackBatches: values.trackBatches,
        variants: variantNames.map((name) => {
          const override = overrides.find((entry) => entry.name === name);
          return {
            name,
            sku: override?.sku || values.sku,
            barcode: override?.barcode || values.barcode,
            costPrice: Number(override?.costPrice ?? values.defaultCostPrice),
            sellingPrice: Number(override?.sellingPrice ?? values.defaultSellingPrice),
            openingStock: Number(
              openingStock.find((row) => row.variantName === name)?.quantity ?? 0,
            ),
          };
        }),
      });

      toast.add({
        type: "success",
        title: itemId ? "Product updated" : "Product created",
        description: `${values.name} has been added to your inventory.`,
      });
      handleOpenChange(false);
      onSuccess?.();
    } catch {
      toast.add({
        type: "error",
        title: "Couldn't create product",
        description: "Something went wrong. Please check the details and try again.",
      });
    }
  }, (errors) => {
    const invalidStep = STEP_FIELDS.findIndex(fields => fields.some(field => field in errors));
    if (invalidStep >= 0) setStepIndex(invalidStep);
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={itemId ? "Edit Product" : "Add Product"}
      overlayClassName="bg-[rgb(47_47_47/30%)] supports-backdrop-filter:backdrop-blur-none"
      className="[&>[data-slot=dialog-close]]:top-6 [&>[data-slot=dialog-close]]:right-6"
      headerClassName="gap-2 border-b-0 pt-6 pr-12 pb-0 pl-4 sm:pt-8 sm:pr-14 sm:pl-8"
      titleClassName="text-2xl"
      descriptionClassName="text-sm text-ink-2 sm:text-lg"
      bodyClassName="px-4 py-6 sm:p-8"
      footerClassName="border-t-0 p-4 sm:px-8 sm:py-[18px]"
      description="Manage your products and track stock across your branches."
      footer={
        <>
          <SecondaryButton
            className="min-h-12 px-6 text-base"
            onClick={goBack}
            disabled={formState.isSubmitting}
            leftIcon={stepIndex > 0 ? <ArrowLeftIcon className="size-4" /> : undefined}
          >
            {stepIndex === 0 ? "Cancel" : "Back"}
          </SecondaryButton>

          {isLastStep ? (
            <PrimaryButton className="min-h-12 px-6 text-base" onClick={onSubmit} loading={formState.isSubmitting}>
              {itemId ? "Save Product" : "Create Product"}
            </PrimaryButton>
          ) : (
            <PrimaryButton className="min-h-12 px-6 text-base" onClick={goNext} rightIcon={<ArrowRightIcon className="size-4" />}>
              Next
            </PrimaryButton>
          )}
        </>
      }
    >
      <FormProvider {...form}>
        <div className="flex flex-col gap-6">
          <Stepper
            steps={WIZARD_STEPS}
            currentIndex={stepIndex}
            onStepSelect={setStepIndex}
            className="mb-2 min-w-[640px] overflow-x-auto pb-1 sm:min-w-0 [&_button>span:first-child]:size-[30px]"
          />

          <form className="[&_input:not([type=file])]:min-h-[50px] [&_input:not([type=file])]:text-base [&_input:not([type=file])]:shadow-none [&_select]:min-h-[50px] [&_select]:text-base [&_select]:shadow-none [&_label]:text-ink-1 [&_textarea]:text-base [&_textarea]:shadow-none [&_section>div]:gap-7" onSubmit={(event) => event.preventDefault()}>
            {stepIndex === 0 && <StepBasicInfo />}
            {stepIndex === 1 && <StepPricingUnits />}
            {stepIndex === 2 && <StepVariants />}
            {stepIndex === 3 && <StepInventory />}
            {stepIndex === 4 && <StepReview onEditStep={setStepIndex} />}
          </form>
        </div>
      </FormProvider>
    </FormDialog>
  );
}
