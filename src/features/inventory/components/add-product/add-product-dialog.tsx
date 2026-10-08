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
}

export function AddProductDialog({ open, onOpenChange, onSuccess }: AddProductDialogProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const { activeBranch } = useBranch();
  const toast = useToast();

  const form = useForm<AddProductValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: ADD_PRODUCT_DEFAULTS,
    mode: "onTouched",
  });

  const { handleSubmit, trigger, reset, formState } = form;

  /** Clear the wizard on close so the next one starts from a blank form. */
  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset(ADD_PRODUCT_DEFAULTS);
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

      await inventoryService.createProduct({
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
        title: "Product created",
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
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Add Product"
      description="Manage your products and track stock across your branches."
      className="sm:max-w-[950px]"
      footer={
        <>
          <SecondaryButton
            onClick={goBack}
            disabled={formState.isSubmitting}
            leftIcon={stepIndex > 0 ? <ArrowLeftIcon className="size-4" /> : undefined}
          >
            {stepIndex === 0 ? "Cancel" : "Back"}
          </SecondaryButton>

          {isLastStep ? (
            <PrimaryButton onClick={onSubmit} loading={formState.isSubmitting}>
              Create Product
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={goNext} rightIcon={<ArrowRightIcon className="size-4" />}>
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
            className="overflow-x-auto pb-1"
          />

          <form onSubmit={(event) => event.preventDefault()}>
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
