"use client";

import { useMemo, useState } from "react";
import { CheckIcon } from "lucide-react";
import { PrimaryButton } from "@/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNaira } from "@/lib/format";
import type { SellableProduct } from "../types";

interface ProductConfigurationProps {
  product: SellableProduct;
  onAdd: (selection: { quantity: number; unit: string; price: number }) => void;
}

export function ProductConfiguration({ product, onAdd }: ProductConfigurationProps) {
  const options = product.options;
  const [size, setSize] = useState(options?.sizes?.[0] ?? "");
  const [type, setType] = useState(options?.types?.[0] ?? "");
  const [unit, setUnit] = useState(options?.units?.[0]?.name ?? product.unit);
  const [quantity, setQuantity] = useState(1);

  const selectedUnit = useMemo(
    () => options?.units?.find((entry) => entry.name === unit),
    [options?.units, unit],
  );
  const price = selectedUnit?.price ?? product.price;
  const unitLabel = options?.smallestUnit ?? product.unit;
  const unitPrice = options?.smallestUnitPrice ?? price;

  if (!options) return null;

  return (
    <section className="new-sale-configurator" aria-label={`Configure ${product.name}`}>
      <div className="new-sale-config-grid">
        <ConfigurationSelect label="Size" value={size} onChange={setSize} values={options.sizes ?? []} />
        <ConfigurationSelect label="Type" value={type} onChange={setType} values={options.types ?? []} />
        <ConfigurationSelect label="Unit" value={unit} onChange={setUnit} values={(options.units ?? []).map((entry) => entry.name)} />
      </div>

      <p className="mt-2 text-xs text-ink-4">No data for this variant</p>

      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            aria-label="Quantity"
            type="number"
            min={1}
            max={selectedUnit?.stock ?? undefined}
            value={quantity}
            onChange={(event) => {
              const maximum = selectedUnit?.stock ?? Number.POSITIVE_INFINITY;
              setQuantity(Math.min(maximum, Math.max(1, Number(event.target.value) || 1)));
            }}
            className="h-10 w-12 rounded-lg border-0 bg-surface-muted px-3 text-center text-sm font-semibold outline-none"
          />
          <span className="text-sm text-ink-2">*{formatNaira(unitPrice)} per {unitLabel}</span>
        </div>
        <PrimaryButton className="h-11 px-6" onClick={() => onAdd({ quantity, unit, price })}>
          Add to cart
        </PrimaryButton>
      </div>

      <div className="new-sale-stock-note">
        <CheckIcon className="mt-0.5 size-4 shrink-0" />
        <span>Smart stock depletion: selling sachets auto-converts from Rolls/Cartons when there&apos;s a low - no manual recalculation</span>
      </div>
    </section>
  );
}

function ConfigurationSelect({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-0 flex-col gap-2 text-sm text-ink-3">
      {label}
      <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
        <SelectTrigger className="h-[50px] w-full text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start">
          {values.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
        </SelectContent>
      </Select>
    </label>
  );
}
