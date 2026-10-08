"use client";

import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { useBranch } from "@/context/branch-context";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_SUPPLIERS, MOCK_TAX_SCHEMES } from "../../mock-data";
import { buildVariantNames, type AddProductValues } from "./schema";

function lookup<T extends { id: string; name: string }>(list: T[], id?: string | null) {
  if (!id) return "—";
  return list.find((entry) => entry.id === id)?.name ?? "—";
}

function ReviewCard({
  title,
  onEdit,
  children,
  className,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border/70 p-5", className)}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink-1">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-semibold text-primary transition-colors hover:text-brand-700"
        >
          Edit
        </button>
      </header>
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 py-1.5">
      <dt className="text-xs text-ink-3">{label}</dt>
      <dd className="min-w-0 text-xs break-words text-ink-1">{value}</dd>
    </div>
  );
}

export function StepReview({ onEditStep }: { onEditStep: (index: number) => void }) {
  const { watch } = useFormContext<AddProductValues>();
  const { branches } = useBranch();
  const values = watch();

  const variantNames = values.hasVariants ? buildVariantNames(values.optionGroups ?? []) : [];
  const overrides = values.variantOverrides ?? [];

  return (
    <div className="flex flex-col gap-5">
      <ReviewCard title="Basic Information" onEdit={() => onEditStep(0)}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-lg bg-surface-muted">
            {values.imageDataUrl ? (
              <Image
                src={values.imageDataUrl}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-xs text-ink-4">
                No photo
              </span>
            )}
          </div>

          <dl className="min-w-0 flex-1">
            <Row label="Name" value={values.name || "—"} />
            <Row label="SKU" value={values.sku || "—"} />
            <Row label="Barcode" value={values.barcode || "—"} />
            <Row label="Category" value={lookup(MOCK_CATEGORIES, values.categoryId)} />
            <Row label="Brand" value={lookup(MOCK_BRANDS, values.brandId)} />
            <Row
              label="Type"
              value={values.type === "physical" ? "Physical Product" : "Service"}
            />
            <Row label="Description" value={values.description || "—"} />
            <Row
              label="Primary Supplier"
              value={lookup(MOCK_SUPPLIERS, values.primarySupplierId)}
            />
            <Row
              label="Additional Suppliers"
              value={
                (values.additionalSupplierIds ?? []).filter((entry) => entry.id).length > 0
                  ? (values.additionalSupplierIds ?? [])
                      .filter((entry) => entry.id)
                      .map((entry) => lookup(MOCK_SUPPLIERS, entry.id))
                      .join(", ")
                  : "—"
              }
            />
          </dl>
        </div>
      </ReviewCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <ReviewCard title="Pricing & Units" onEdit={() => onEditStep(1)}>
          <dl>
            <Row label="Base Unit" value={values.baseUnit} />
            <Row label="Default Cost Price" value={formatCurrency(Number(values.defaultCostPrice) || 0)} />
            <Row
              label="Default Selling Price"
              value={formatCurrency(Number(values.defaultSellingPrice) || 0)}
            />
            <Row
              label="Additional Units"
              value={
                (values.unitConversions ?? []).length > 0
                  ? (values.unitConversions ?? [])
                      .map((conversion) => `${conversion.unit} = ${conversion.equals} ${conversion.baseUnit}`)
                      .join(", ")
                  : "—"
              }
            />
            <Row label="Tax Scheme" value={lookup(MOCK_TAX_SCHEMES, values.taxSchemeId)} />
            <Row
              label="Quantity Discounts"
              value={
                (values.quantityDiscounts ?? []).length > 0
                  ? (values.quantityDiscounts ?? [])
                      .map(
                        (discount) =>
                          `${discount.minQuantity} ${discount.unit} = ${discount.discount}${
                            discount.discountType === "percentage" ? "%" : "₦"
                          } off`,
                      )
                      .join(", ")
                  : "—"
              }
            />
          </dl>
        </ReviewCard>

        <ReviewCard title="Inventory" onEdit={() => onEditStep(3)}>
          <dl>
            <Row label="Track Inventory" value={values.trackInventory ? "Yes" : "No"} />
            <Row
              label="Default Low Stock Alert"
              value={`${values.reorderPoint} ${values.alertUnit}`}
            />
            <Row label="Track Batch / Expiry" value={values.trackBatches ? "Yes" : "No"} />
            <Row
              label="Opening Stock"
              value={
                (values.openingStock ?? []).length > 0
                  ? (values.openingStock ?? [])
                      .map(
                        (row) =>
                          `${row.variantName}: ${row.quantity} @ ${
                            branches.find((branch) => branch.id === row.branchId)?.name ?? "—"
                          }`,
                      )
                      .join(" • ")
                  : "—"
              }
            />
          </dl>
        </ReviewCard>
      </div>

      <ReviewCard title="Variants" onEdit={() => onEditStep(2)}>
        <dl>
          <Row label="Has Variants" value={values.hasVariants ? "Yes" : "No"} />
          <Row label="Total Variants" value={values.hasVariants ? variantNames.length : 0} />
        </dl>

        {values.hasVariants && overrides.length > 0 && (
          <div className="mt-4 overflow-x-auto rounded-lg border border-border">
            <div className="grid min-w-[560px] grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-3 bg-surface-muted px-4 py-3 text-xs font-semibold text-ink-1">
              <span>Variant</span>
              <span>SKU</span>
              <span>Barcode</span>
              <span>Price (₦)</span>
              <span>Cost (₦)</span>
            </div>
            {overrides.map((override) => (
              <div
                key={override.name}
                className="grid min-w-[560px] grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-3 border-t border-border/60 px-4 py-3 text-xs text-ink-2"
              >
                <span className="truncate">{override.name}</span>
                <span>{override.sku || "Same"}</span>
                <span>{override.barcode || "Same"}</span>
                <span>{override.sellingPrice ? String(override.sellingPrice) : "Same"}</span>
                <span>{override.costPrice ? String(override.costPrice) : "Same"}</span>
              </div>
            ))}
          </div>
        )}
      </ReviewCard>
    </div>
  );
}
