"use client";

import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InfoIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Field, SelectInput, TextInput } from "@/components/form/app-fields";
import { useBranch } from "@/context/branch-context";
import { MOCK_UNITS } from "../../mock-data";
import { StepSection, StepSubsection } from "./step-section";
import { buildVariantNames, type AddProductValues } from "./schema";

/** Variants the stock rows are built from; a product without variants gets one row. */
function useStockRowNames() {
  const { watch } = useFormContext<AddProductValues>();
  const hasVariants = watch("hasVariants");
  const optionGroups = watch("optionGroups") ?? [];

  if (!hasVariants) return ["Default"];
  const names = buildVariantNames(optionGroups);
  return names.length > 0 ? names : ["Default"];
}

export function StepInventory() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AddProductValues>();

  const { branches, activeBranch } = useBranch();
  const rowNames = useStockRowNames();
  const trackInventory = watch("trackInventory");
  const trackBatches = watch("trackBatches");
  const baseUnit = watch("baseUnit");

  // Rebuild the opening-stock and batch rows whenever the variant set changes.
  useEffect(() => {
    const currentStock = watch("openingStock") ?? [];
    const nextStock = rowNames.map(
      (variantName) =>
        currentStock.find((row) => row.variantName === variantName) ?? {
          variantName,
          branchId: activeBranch.id,
          quantity: 0,
        },
    );

    const stockUnchanged =
      nextStock.length === currentStock.length &&
      nextStock.every((row, index) => row.variantName === currentStock[index]?.variantName);

    if (!stockUnchanged) setValue("openingStock", nextStock);

    const currentBatches = watch("batches") ?? [];
    const nextBatches = rowNames.map(
      (variantName) =>
        currentBatches.find((row) => row.variantName === variantName) ?? {
          variantName,
          branchId: activeBranch.id,
          batchNumber: "",
          quantity: 0,
          expiryDate: "",
        },
    );

    const batchesUnchanged =
      nextBatches.length === currentBatches.length &&
      nextBatches.every((row, index) => row.variantName === currentBatches[index]?.variantName);

    if (!batchesUnchanged) setValue("batches", nextBatches);
  }, [rowNames, activeBranch.id, setValue, watch]);

  const openingStock = watch("openingStock") ?? [];
  const batches = watch("batches") ?? [];

  return (
    <StepSection
      title="4. Inventory Configuration"
      description="Manage stock levels and alerts for this product."
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink-1">Track Inventory</p>
            <p className="text-xs text-ink-3">Keep track of stock levels for this product.</p>
          </div>
          <Controller
            control={control}
            name="trackInventory"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Track inventory"
              />
            )}
          />
        </div>

        {trackInventory && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Default Low Stock Alert"
                htmlFor="reorderPoint"
                error={errors.reorderPoint?.message}
                hint="Applied to all variants unless overridden"
              >
                <TextInput
                  id="reorderPoint"
                  type="number"
                  min={0}
                  placeholder="10"
                  invalid={!!errors.reorderPoint}
                  {...register("reorderPoint")}
                />
              </Field>

              <Field label="Alert Unit" htmlFor="alertUnit" error={errors.alertUnit?.message}>
                <SelectInput id="alertUnit" invalid={!!errors.alertUnit} {...register("alertUnit")}>
                  {MOCK_UNITS.map((unit) => (
                    <option key={unit.id} value={unit.name}>
                      {unit.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </div>

            <StepSubsection
              title="Opening Stock"
              description="Set initial stock levels across variants and locations."
            >
              <div className="overflow-x-auto rounded-lg border border-border">
                <div className="grid min-w-[560px] grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-3 bg-surface-muted px-4 py-3 text-xs font-semibold text-ink-1">
                  <span>Variant</span>
                  <span>Location</span>
                  <span>Quantity</span>
                  <span>Base Unit</span>
                </div>

                {openingStock.map((row, index) => (
                  <div
                    key={row.variantName}
                    className="grid min-w-[560px] grid-cols-[1.2fr_1fr_1fr_0.8fr] items-center gap-3 border-t border-border/60 px-4 py-3"
                  >
                    <p className="truncate text-sm text-ink-2">{row.variantName}</p>
                    <SelectInput
                      aria-label={`Location for ${row.variantName}`}
                      className="h-9 text-sm"
                      {...register(`openingStock.${index}.branchId`)}
                    >
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </SelectInput>
                    <TextInput
                      aria-label={`Quantity for ${row.variantName}`}
                      type="number"
                      min={0}
                      className="h-9 text-sm"
                      invalid={!!errors.openingStock?.[index]?.quantity}
                      {...register(`openingStock.${index}.quantity`)}
                    />
                    <p className="text-sm text-ink-2">{baseUnit}</p>
                  </div>
                ))}
              </div>
            </StepSubsection>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink-1">Track Batch / Expiry</p>
                <p className="text-xs text-ink-3">
                  Enable to track batches and expiry dates for this product.
                </p>
              </div>
              <Controller
                control={control}
                name="trackBatches"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Track batch and expiry"
                  />
                )}
              />
            </div>

            {trackBatches && (
              <div className="flex flex-col gap-3">
                <p className="flex items-start gap-2 rounded-lg bg-surface-muted px-4 py-3 text-xs text-ink-3">
                  <InfoIcon className="mt-0.5 size-4 shrink-0" />
                  Batch details (e.g. batch label, expiry date) will be added when receiving stock
                  or during stock adjustments.
                </p>

                <p className="text-sm text-ink-2">Add batch details for your opening stock.</p>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <div className="grid min-w-[720px] grid-cols-[1.1fr_1fr_1fr_0.8fr_0.7fr_1fr] gap-3 bg-surface-muted px-4 py-3 text-xs font-semibold text-ink-1">
                    <span>Variant</span>
                    <span>Location</span>
                    <span>Batch No.</span>
                    <span>Quantity</span>
                    <span>Unit</span>
                    <span>Expiry Date</span>
                  </div>

                  {batches.map((row, index) => (
                    <div
                      key={row.variantName}
                      className="grid min-w-[720px] grid-cols-[1.1fr_1fr_1fr_0.8fr_0.7fr_1fr] items-center gap-3 border-t border-border/60 px-4 py-3"
                    >
                      <p className="truncate text-sm text-ink-2">{row.variantName}</p>
                      <SelectInput
                        aria-label={`Batch location for ${row.variantName}`}
                        className="h-9 text-sm"
                        {...register(`batches.${index}.branchId`)}
                      >
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </SelectInput>
                      <TextInput
                        aria-label={`Batch number for ${row.variantName}`}
                        placeholder="CHC-B-001"
                        className="h-9 text-sm"
                        {...register(`batches.${index}.batchNumber`)}
                      />
                      <TextInput
                        aria-label={`Batch quantity for ${row.variantName}`}
                        type="number"
                        min={0}
                        className="h-9 text-sm"
                        {...register(`batches.${index}.quantity`)}
                      />
                      <p className="text-sm text-ink-2">{baseUnit}</p>
                      <TextInput
                        aria-label={`Expiry date for ${row.variantName}`}
                        type="date"
                        className="h-9 text-sm"
                        {...register(`batches.${index}.expiryDate`)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </StepSection>
  );
}
