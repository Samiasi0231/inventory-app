"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Field, SelectInput, TextInput } from "@/components/form/app-fields";
import { MOCK_TAX_SCHEMES, MOCK_UNITS } from "../../mock-data";
import { StepSection, StepSubsection } from "./step-section";
import type { AddProductValues } from "./schema";

export function StepPricingUnits() {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<AddProductValues>();

  const baseUnit = watch("baseUnit");

  const conversions = useFieldArray({ control, name: "unitConversions" });
  const discounts = useFieldArray({ control, name: "quantityDiscounts" });

  return (
    <StepSection
      title="2. Pricing & Units"
      description="Set your base unit (smallest unit), pricing and unit conversions."
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Base Unit (smallest unit)"
            htmlFor="baseUnit"
            required
            error={errors.baseUnit?.message}
          >
            <SelectInput id="baseUnit" invalid={!!errors.baseUnit} {...register("baseUnit")}>
              {MOCK_UNITS.map((unit) => (
                <option key={unit.id} value={unit.name}>
                  {unit.name}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field
            label="Default Selling Price / Base Unit"
            htmlFor="defaultSellingPrice"
            required
            error={errors.defaultSellingPrice?.message}
          >
            <TextInput
              id="defaultSellingPrice"
              type="number"
              min={0}
              step="0.01"
              placeholder="4000"
              invalid={!!errors.defaultSellingPrice}
              {...register("defaultSellingPrice")}
            />
          </Field>

          <Field
            label="Default Cost Price / Base Unit"
            htmlFor="defaultCostPrice"
            required
            error={errors.defaultCostPrice?.message}
            className="sm:col-span-2"
          >
            <TextInput
              id="defaultCostPrice"
              type="number"
              min={0}
              step="0.01"
              placeholder="6000"
              invalid={!!errors.defaultCostPrice}
              {...register("defaultCostPrice")}
            />
          </Field>
        </div>

        <StepSubsection
          title="Additional Units & Conversions"
          description="Add other larger units you buy or sell this product in."
        >
          {conversions.fields.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="hidden grid-cols-[1fr_1fr_1fr_auto] gap-3 px-4 py-3 text-sm text-ink-2 sm:grid">
                <span>Unit</span>
                <span>Equals</span>
                <span>Base Unit</span>
                <span className="w-8" />
              </div>

              {conversions.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 items-center gap-3 border-t border-border/60 px-4 py-3 sm:grid-cols-[1fr_1fr_1fr_auto]"
                >
                  <TextInput
                    aria-label="Unit name"
                    placeholder="Carton"
                    className="h-10"
                    invalid={!!errors.unitConversions?.[index]?.unit}
                    {...register(`unitConversions.${index}.unit`)}
                  />
                  <TextInput
                    aria-label="Equals how many base units"
                    type="number"
                    min={1}
                    placeholder="24"
                    className="h-10"
                    invalid={!!errors.unitConversions?.[index]?.equals}
                    {...register(`unitConversions.${index}.equals`)}
                  />
                  <TextInput
                    aria-label="Base unit"
                    readOnly
                    value={baseUnit}
                    className="h-10 bg-surface-muted"
                    {...register(`unitConversions.${index}.baseUnit`)}
                  />
                  <button
                    type="button"
                    onClick={() => conversions.remove(index)}
                    aria-label="Remove unit"
                    className="justify-self-end rounded-md p-2 text-ink-4 transition-colors hover:bg-danger-bg hover:text-danger-fg"
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => conversions.append({ unit: "", equals: 1, baseUnit })}
            className="flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-700"
          >
            <PlusIcon className="size-4" />
            Add Unit
          </button>
        </StepSubsection>

        <StepSubsection
          title="Quantity Discounts (Optional)"
          description="Offer discounts when customers buy more."
        >
          {discounts.fields.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 bg-surface-muted px-4 py-3 text-sm text-ink-2 sm:grid">
                <span>Min. Quantity</span>
                <span>Unit</span>
                <span>Discount Type</span>
                <span>Discount</span>
                <span className="w-8" />
              </div>

              {discounts.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 items-center gap-3 border-t border-border/60 px-4 py-3 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]"
                >
                  <TextInput
                    aria-label="Minimum quantity"
                    type="number"
                    min={1}
                    placeholder="4"
                    className="h-10"
                    invalid={!!errors.quantityDiscounts?.[index]?.minQuantity}
                    {...register(`quantityDiscounts.${index}.minQuantity`)}
                  />
                  <SelectInput
                    aria-label="Unit"
                    className="h-10"
                    {...register(`quantityDiscounts.${index}.unit`)}
                  >
                    <option value={baseUnit}>{baseUnit}</option>
                    {conversions.fields.map((conversion, conversionIndex) => (
                      <option key={conversion.id} value={watch(`unitConversions.${conversionIndex}.unit`)}>
                        {watch(`unitConversions.${conversionIndex}.unit`) || "Unnamed unit"}
                      </option>
                    ))}
                  </SelectInput>
                  <SelectInput
                    aria-label="Discount type"
                    className="h-10"
                    {...register(`quantityDiscounts.${index}.discountType`)}
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </SelectInput>
                  <TextInput
                    aria-label="Discount"
                    type="number"
                    min={0}
                    placeholder="10"
                    className="h-10"
                    invalid={!!errors.quantityDiscounts?.[index]?.discount}
                    {...register(`quantityDiscounts.${index}.discount`)}
                  />
                  <button
                    type="button"
                    onClick={() => discounts.remove(index)}
                    aria-label="Remove discount"
                    className="justify-self-end rounded-md p-2 text-ink-4 transition-colors hover:bg-danger-bg hover:text-danger-fg"
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              discounts.append({
                minQuantity: 1,
                unit: baseUnit,
                discountType: "percentage",
                discount: 0,
              })
            }
            className="flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-700"
          >
            <PlusIcon className="size-4" />
            Add Discount
          </button>
        </StepSubsection>

        <StepSubsection
          title="Pricing Tax Application"
          description="Choose the tax scheme that will apply globally to all variants in this product."
        >
          <Field label="Tax Scheme" htmlFor="taxSchemeId">
            <SelectInput id="taxSchemeId" {...register("taxSchemeId")}>
              <option value="">No tax scheme</option>
              {MOCK_TAX_SCHEMES.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>
                  {scheme.name}
                </option>
              ))}
            </SelectInput>
          </Field>
        </StepSubsection>
      </div>
    </StepSection>
  );
}
