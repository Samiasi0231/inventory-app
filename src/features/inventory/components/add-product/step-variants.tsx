"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Field, TextInput } from "@/components/form/app-fields";
import { EmptyState } from "@/components/common/empty-state";
import { LayersIcon } from "lucide-react";
import { StepSection, StepSubsection } from "./step-section";
import { buildVariantNames, type AddProductValues } from "./schema";

export function StepVariants() {
  const [addingOption, setAddingOption] = useState<number | null>(null);
  const [optionDraft, setOptionDraft] = useState("");
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AddProductValues>();

  const hasVariants = watch("hasVariants");
  const optionGroups = watch("optionGroups");
  const groups = useFieldArray({ control, name: "optionGroups" });

  // Memoised so the effect below does not see a new array every render.
  const variantNames = useMemo(
    () => (hasVariants ? buildVariantNames(optionGroups ?? []) : []),
    [hasVariants, optionGroups],
  );

  // Keep override rows in step with the generated combinations, preserving
  // anything already typed for a variant whose name has not changed.
  useEffect(() => {
    const current = watch("variantOverrides") ?? [];
    const next = variantNames.map(
      (name) =>
        current.find((override) => override.name === name) ?? {
          name,
          sku: "",
          barcode: "",
          sellingPrice: undefined,
          costPrice: undefined,
        },
    );

    const unchanged =
      next.length === current.length &&
      next.every((override, index) => override.name === current[index]?.name);

    if (!unchanged) setValue("variantOverrides", next);
  }, [variantNames, setValue, watch]);

  const overrides = watch("variantOverrides") ?? [];

  return (
    <StepSection
      title="3. Product Variations"
      description="Add the options this product comes in, such as size or flavour."
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink-1">Has Variants</p>
            <p className="text-xs text-ink-3">
              Turn this on if the product is sold in more than one option.
            </p>
          </div>
          <Controller
            control={control}
            name="hasVariants"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Has variants"
              />
            )}
          />
        </div>

        {!hasVariants ? (
          <EmptyState
            icon={LayersIcon}
            title="No variants"
            description="This product will be tracked as a single item. Turn on variants if it comes in different sizes, colours or flavours."
          />
        ) : (
          <>
            <StepSubsection
              title="Variant Attributes"
              description="Define the attributes that will create your variants."
              className="rounded-xl border border-border p-4"
            >
              {groups.fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 items-start gap-6 rounded-lg border border-border p-5 sm:grid-cols-[1fr_1.1fr_auto]">
                  <Field
                    label={`Attribute ${index + 1}`}
                    htmlFor={`option-name-${index}`}
                    error={errors.optionGroups?.[index]?.name?.message}
                    className="flex-1"
                  >
                    <TextInput
                      id={`option-name-${index}`}
                      placeholder="Size"
                      invalid={!!errors.optionGroups?.[index]?.name}
                      {...register(`optionGroups.${index}.name`)}
                    />
                  </Field>
                  <Field
                    label="Options"
                    htmlFor={`option-values-${index}`}
                    error={errors.optionGroups?.[index]?.values?.message}
                    className="flex-[2]"
                  >
                    <div className="flex min-h-[50px] flex-wrap items-center gap-3">
                      {(optionGroups?.[index]?.values ?? "").split(",").map(v => v.trim()).filter(Boolean).map(value => <button key={value} type="button" aria-label={`Remove ${value}`} onClick={() => setValue(`optionGroups.${index}.values`, (optionGroups?.[index]?.values ?? "").split(",").map(v => v.trim()).filter(v => v !== value).join(", "))} className="rounded-full bg-success-bg px-4 py-2 text-sm text-success-fg">{value}<span className="ml-2" aria-hidden>×</span></button>)}
                    </div>
                    {addingOption === index ? <div className="mt-2 flex gap-2"><TextInput autoFocus aria-label="New option" value={optionDraft} onChange={e => setOptionDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (optionDraft.trim()) { setValue(`optionGroups.${index}.values`, [optionGroups?.[index]?.values, optionDraft.trim()].filter(Boolean).join(", ")); setOptionDraft(""); setAddingOption(null); } } }} /><button type="button" className="text-sm text-primary" onClick={() => { if (optionDraft.trim()) setValue(`optionGroups.${index}.values`, [optionGroups?.[index]?.values, optionDraft.trim()].filter(Boolean).join(", ")); setOptionDraft(""); setAddingOption(null); }}>Add</button></div> : <button type="button" className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary" onClick={() => { setAddingOption(index); setOptionDraft(""); }}><PlusIcon className="size-4" />Add Option</button>}
                  </Field>
                  <button
                    type="button"
                    onClick={() => groups.remove(index)}
                    aria-label="Remove option"
                    className="mb-1 shrink-0 rounded-md p-2 text-ink-4 transition-colors hover:bg-danger-bg hover:text-danger-fg"
                  >
                    <Trash2Icon className="size-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => groups.append({ name: "", values: "" })}
                className="flex w-fit items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-brand-700"
              >
                <PlusIcon className="size-4" />
                Add Another Attribute
              </button>
            </StepSubsection>

            <StepSubsection
              title={`Generated Variants (${variantNames.length})`}
              className="rounded-lg bg-success-bg p-4"
              description="Each variant inherits the product SKU, barcode and pricing unless overridden."
            >
              {variantNames.length === 0 ? (
                <p className="rounded-lg bg-surface-muted px-4 py-3 text-sm text-ink-3">
                  Add an option above to generate variants.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <div className="grid min-w-[640px] grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-3 bg-surface-muted px-4 py-3 text-xs font-semibold text-ink-1">
                    <span>Variant</span>
                    <span>SKU</span>
                    <span>Barcode</span>
                    <span>Price (₦)</span>
                    <span>Cost (₦)</span>
                  </div>

                  {overrides.map((override, index) => (
                    <div
                      key={override.name}
                      className="grid min-w-[640px] grid-cols-[1.2fr_1fr_1fr_1fr_1fr] items-center gap-3 border-t border-border/60 px-4 py-3"
                    >
                      <p className="truncate text-sm text-ink-2">{override.name}</p>
                      <TextInput
                        aria-label={`SKU for ${override.name}`}
                        placeholder="Same"
                        className="h-9 text-sm"
                        {...register(`variantOverrides.${index}.sku`)}
                      />
                      <TextInput
                        aria-label={`Barcode for ${override.name}`}
                        placeholder="Same"
                        className="h-9 text-sm"
                        {...register(`variantOverrides.${index}.barcode`)}
                      />
                      <TextInput
                        aria-label={`Price for ${override.name}`}
                        type="number"
                        min={0}
                        placeholder="Same"
                        className="h-9 text-sm"
                        {...register(`variantOverrides.${index}.sellingPrice`)}
                      />
                      <TextInput
                        aria-label={`Cost for ${override.name}`}
                        type="number"
                        min={0}
                        placeholder="Same"
                        className="h-9 text-sm"
                        {...register(`variantOverrides.${index}.costPrice`)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </StepSubsection>
          </>
        )}
      </div>
    </StepSection>
  );
}
