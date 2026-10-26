"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { TopbarAction, TopbarBreadcrumb } from "@/layout/app-topbar";
import { useBranch } from "@/context/branch-context";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import { inventoryService } from "../inventory.service";
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_SUPPLIERS, MOCK_TAX_SCHEMES } from "../mock-data";
import { getStockStatus, type InventoryItem } from "../types";
import { ProductDataTable } from "./product-data-table";
import { StockStatusBadge } from "./stock-status-badge";
import { AddProductDialog } from "./add-product/add-product-dialog";
import { ADD_PRODUCT_DEFAULTS, buildVariantNames, type AddProductValues } from "./add-product/schema";

function Panel({ title, description, action, children }: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="mt-1 text-xs text-ink-4">{description}</p>}
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
function Rows({ rows }: { rows: [string, ReactNode][] }) {
  return <dl className="space-y-3">{rows.map(([label, value]) => <div key={label} className="grid grid-cols-2 gap-5 text-sm"><dt className="text-xs text-ink-4">{label}</dt><dd className="text-right">{value ?? "—"}</dd></div>)}</dl>;
}
const lookup = (list: { id: string; name: string }[], id?: string) => list.find(entry => entry.id === id)?.name ?? "—";

export function ProductDetails({ item, onBack, onSuccess }: { item: InventoryItem; onBack: () => void; onSuccess: () => void }) {
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const { activeBranch, branches } = useBranch();
  const values: AddProductValues = inventoryService.getProductDetails(item.id, item.branchId) ?? {
    ...ADD_PRODUCT_DEFAULTS, name: item.name, sku: item.itemCode, categoryId: item.categoryId,
    defaultCostPrice: item.costPrice, defaultSellingPrice: item.sellingPrice, baseUnit: item.baseUnit,
    reorderPoint: item.reorderPoint, openingStock: [{ variantName: "Default", branchId: item.branchId, quantity: item.totalStock }],
  };
  const names = values.hasVariants ? buildVariantNames(values.optionGroups ?? []) : [];
  const stocks = values.openingStock ?? [];
  const batches = (values.batches ?? []).filter(batch => batch.branchId === item.branchId);
  const attention = stocks.filter(stock => stock.branchId === item.branchId && Number(stock.quantity) <= Number(values.reorderPoint)).length;
  const expiryDates = batches.map(batch => batch.expiryDate).filter((date): date is string => Boolean(date)).sort();
  const location = (id: string) => branches.find(branch => branch.id === id)?.name ?? activeBranch.name;
  return <div className="flex min-w-0 flex-col gap-6">
    <TopbarBreadcrumb section="Inventory / Products" page={item.name} />
    <TopbarAction><PrimaryButton className="h-12 px-6" onClick={() => setAdding(true)}>＋ Add Product</PrimaryButton></TopbarAction>
    <button className="flex w-fit items-center gap-2 px-3 text-sm font-semibold text-primary" onClick={onBack}><span aria-hidden>←</span> Back to Products</button>
    <section className="rounded-xl bg-surface p-6">
      <div className="flex flex-wrap items-center gap-5 border-b border-border/30 pb-6">
        {values.imageDataUrl && <Image src={values.imageDataUrl} alt={item.name} width={60} height={60} unoptimized className="size-15 rounded-lg object-cover" />}
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-semibold">{item.name}</h1><StockStatusBadge status={getStockStatus(item)} /></div><p className="mt-2 text-xs text-ink-3">SKU: {values.sku} <span className="px-3">|</span> Barcode: {values.barcode || "—"}</p></div>
        <SecondaryButton onClick={() => setEditing(true)}>Edit Product</SecondaryButton>
      </div>
      <div className="grid grid-cols-2 gap-6 pt-6 lg:grid-cols-4">{[["Total stock", `${item.totalStock} ${item.baseUnit}s`, activeBranch.name], ["Variants", names.length, (values.optionGroups ?? []).map(g => `${g.values.split(',').length} ${g.name.toLowerCase()}`).join(" · ") || "No variants"], ["Batch / expiry tracking", values.trackBatches ? "Enabled" : "Disabled", `${batches.length} batches recorded`], ["Default low stock alert", `${values.reorderPoint} ${values.alertUnit}s`, "Applied to all variants"]].map(([label, value, hint]) => <div key={String(label)}><p className="text-xs text-ink-4">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p><p className="mt-1 text-xs text-ink-4">{hint}</p></div>)}</div>
    </section>
    <div className="grid gap-6 md:grid-cols-2">
      <Panel title="Product Information"><Rows rows={[["Product name", values.name], ["Product type", values.type === "physical" ? "Physical Product" : "Service"], ["Category", lookup(MOCK_CATEGORIES, values.categoryId)], ["Brand", lookup(MOCK_BRANDS, values.brandId)], ["Description", values.description]]} /><div className="mt-5 border-t border-border/60 pt-5"><h3 className="text-sm font-semibold">Suppliers</h3><p className="mb-5 mt-1 text-xs text-ink-4">Linked suppliers for this product.</p><Rows rows={[["Primary supplier", lookup(MOCK_SUPPLIERS, values.primarySupplierId)], ["Additional suppliers", (values.additionalSupplierIds ?? []).map(s => lookup(MOCK_SUPPLIERS, s.id)).join(", ")]]} /></div></Panel>
      <Panel title="Pricing & Units"><Rows rows={[["Base unit (smallest unit)", values.baseUnit], ["Default selling price / base unit", formatCurrency(Number(values.defaultSellingPrice))], ["Default cost price / base unit", formatCurrency(Number(values.defaultCostPrice))]]} /><div className="mt-5 border-t border-border/60 pt-5"><h3 className="mb-3 text-sm font-semibold">Additional Units & Conversions</h3><ProductDataTable headers={["Unit", "Equals", "Base unit"]} rows={(values.unitConversions ?? []).map(u => [u.unit, String(u.equals), u.baseUnit])} /></div><h3 className="mb-3 mt-5 text-sm font-semibold">Quantity Discounts</h3>{(values.quantityDiscounts ?? []).map((d, i) => <p key={i} className="mb-2 rounded-lg bg-success-bg p-3 text-sm text-success-fg">{String(d.discount)}{d.discountType === "percentage" ? "%" : "₦"} off when buying {String(d.minQuantity)} {d.unit}s or more</p>)}<p className="mt-4 text-xs text-ink-4">Tax scheme</p><p className="mt-2 text-sm">{lookup(MOCK_TAX_SCHEMES, values.taxSchemeId)}</p><p className="mt-1 text-xs text-ink-4">Applies globally to all {names.length || 1} variants.</p></Panel>
    </div>
    <Panel
        title={`Variants (${names.length})`}
        description="Each variant inherits the product SKU and barcode unless overridden."
        action={<span className="shrink-0 rounded-full bg-surface-muted px-3 py-1.5 text-xs text-ink-4">Has variants · {values.hasVariants ? "Yes" : "No"}</span>}
      >
        {(values.optionGroups ?? []).length > 0 && <div className="mb-5 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink-4">
          {(values.optionGroups ?? []).map((group) => (
            <p key={group.name}>
              {group.name}: {group.values.split(",").map((value) => value.trim()).filter(Boolean).join(", ")}
            </p>
          ))}
        </div>}
        <ProductDataTable
          label="Product variants"
          headers={["Variant", "SKU", "Barcode", "Selling price (₦)", "Cost price (₦)"]}
          columnClasses={["w-[23%]", "w-[18%]", "w-[23%]", "w-[18%] text-right tabular-nums", "w-[18%] text-right tabular-nums"]}
          rows={names.map((name) => {
            const variant = values.variantOverrides?.find((entry) => entry.name === name);
            return [
              name,
              variant?.sku || values.sku,
              variant?.barcode || values.barcode || "—",
              formatNumber(Number(variant?.sellingPrice ?? values.defaultSellingPrice)),
              formatNumber(Number(variant?.costPrice ?? values.defaultCostPrice)),
            ];
          })}
        />
        {names.length === 0 && <p className="py-6 text-center text-sm text-ink-4">No variants configured for this product.</p>}
    </Panel>
    <Panel title="Branch Stock" description="Opening stock across the assigned branch.">
      <dl className="mb-5 grid gap-4 sm:grid-cols-3">
        {[
          ["Track inventory", values.trackInventory ? "Yes" : "No"],
          ["Default low stock alert", `${values.reorderPoint} ${values.alertUnit}s`],
          ["Track batch / expiry", values.trackBatches ? "Yes" : "No"],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-ink-4">{label}</dt>
            <dd className="mt-2 text-sm">{value}</dd>
          </div>
        ))}
      </dl>
      <ProductDataTable
        headers={["Branch", "Variants", "Total stock", "Stock attention"]}
        rows={[[
          activeBranch.name,
          names.length || 1,
          `${item.totalStock} ${item.baseUnit}s`,
          <span key="attention" className={`rounded-full px-3 py-1 text-xs ${attention ? "bg-danger-bg text-danger-fg" : "bg-success-bg text-success-fg"}`}>
            {attention ? `${attention} ${attention === 1 ? "variant" : "variants"} at or below alert` : "All stock above alert"}
          </span>,
        ]]}
      />
      <p className="mt-5 text-xs text-ink-4">The default alert applies to all variants unless overridden.</p>
    </Panel>
    {values.trackBatches && <Panel title="Batch & Expiry Details" description="Each variant has a specific batch number and expiry date for its location."><ProductDataTable headers={["Variant", "Location", "Batch no.", "Quantity", "Unit", "Expiry date", "Stock status"]} rows={batches.map(b => [b.variantName, location(b.branchId), b.batchNumber || "—", String(b.quantity ?? 0), values.baseUnit, b.expiryDate ? formatDate(b.expiryDate) : "—", <StockStatusBadge key="status" status={getStockStatus({ totalStock: Number(stocks.find(s => s.variantName === b.variantName && s.branchId === b.branchId)?.quantity ?? 0), reorderPoint: Number(values.reorderPoint) })} />])} /><div className="mt-5 flex justify-between text-xs text-ink-4"><span>{batches.length} batches{expiryDates[0] ? ` · Earliest expiry: ${formatDate(expiryDates[0])}` : ""}</span><span className="font-semibold text-ink-2">Total: {item.totalStock} {item.baseUnit}s</span></div></Panel>}
    <AddProductDialog key={`${item.id}-${editing}`} open={editing} onOpenChange={setEditing} initialValues={values} itemId={item.id} onSuccess={onSuccess} />
    <AddProductDialog open={adding} onOpenChange={setAdding} onSuccess={onSuccess} />
  </div>;
}
