"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { PrimaryButton } from "@/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CartLine, SellableProduct } from "../types";

interface ProductConfigurationProps {
  product: SellableProduct;
  initialLine?: CartLine | null;
  onAdd: (selection: { quantity: number; unit: string; price: number; size: string; type: string; maximum: number }) => void;
  onBack: () => void;
}

export function ProductConfiguration({ product, onAdd, onBack, initialLine }: ProductConfigurationProps) {
  const options = product.options;
  const [size, setSize] = useState(initialLine?.size ?? options?.sizes?.[0] ?? "");
  const [type, setType] = useState(initialLine?.variant ?? options?.types?.[0] ?? "");
  const [unit, setUnit] = useState(options?.units?.find((entry) => entry.name.toLowerCase() === initialLine?.unit)?.name ?? options?.units?.[0]?.name ?? product.unit);
  const [quantity, setQuantity] = useState(initialLine?.quantity ?? 1);

  const selectedUnit = options?.units?.find((entry) => entry.name === unit);
  const price = selectedUnit?.price ?? product.price;
  const maximum = selectedUnit?.stock ?? product.stock ?? Number.POSITIVE_INFINITY;
  const safeQuantity = Math.min(quantity, maximum);
  const units = options?.units?.map((entry) => entry.name) ?? [product.unit];

  return (
    <section className="relative pt-1" aria-label={`Configure ${product.name}`}>
      <div className="flex flex-col gap-4 sm:flex-row">
        <button type="button" onClick={onBack} aria-label="Back to all products" title="Back to all products" className="h-[154px] w-[154px] shrink-0 rounded-xl bg-[#caffE8] focus-visible:outline-2 focus-visible:outline-primary" />
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl leading-8 text-ink-1">{product.name.replace(/ \(.*$/, "")}</h2>
          <p className="mt-2 text-base text-ink-1">{product.sku}</p>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {options?.sizes?.length ? <ConfigurationSelect label="Size" value={size} onChange={setSize} values={options.sizes} /> : null}
            {options?.types?.length ? <ConfigurationSelect label="Flavor" value={type} onChange={setType} values={options.types} /> : null}
            <div className={options?.sizes?.length ? "" : "sm:col-span-3"}>
              <ConfigurationSelect label="Unit" value={unit} onChange={setUnit} values={units} />
              <p className="mt-2 text-xs text-ink-4">{product.isService ? "Service" : `${Number.isFinite(maximum) ? maximum : "Available"} ${unit.toLowerCase()}${maximum === 1 ? "" : "s"} in stock`}</p>
            </div>
          </div>
          <div className="mt-3 flex w-fit h-5 items-center gap-2 rounded border border-[#dedede] px-[3px]">
            <button type="button" aria-label="Decrease quantity" disabled={safeQuantity <= 1} onClick={() => setQuantity(safeQuantity - 1)} className="rounded bg-primary text-white disabled:opacity-40"><MinusIcon className="size-3" /></button>
            <span className="min-w-3 text-center text-sm font-semibold">{safeQuantity}</span>
            <button type="button" aria-label="Increase quantity" disabled={safeQuantity >= maximum} onClick={() => setQuantity(safeQuantity + 1)} className="rounded bg-primary text-white disabled:opacity-40"><PlusIcon className="size-3" /></button>
          </div>
          <PrimaryButton fullWidth className="mt-5 h-12" disabled={safeQuantity < 1} onClick={() => onAdd({ quantity: safeQuantity, unit, price, size, type, maximum })}>Add to cart</PrimaryButton>
        </div>
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
    <label className="flex min-w-0 flex-col gap-2 text-sm text-ink-2">
      {label}
      <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
        <SelectTrigger className="h-[50px]! w-full rounded-lg text-base font-normal shadow-none [&_svg]:size-5">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start">
          {values.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
        </SelectContent>
      </Select>
    </label>
  );
}
