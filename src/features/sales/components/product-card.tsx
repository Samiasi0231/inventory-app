"use client";

import { Badge } from "@/components/ui/badge";
import { formatNaira, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LOW_STOCK_THRESHOLD } from "../mock-data";
import type { SellableProduct } from "../types";

function StockPill({ product }: { product: SellableProduct }) {
  if (product.isService) return <Badge variant="neutral" className="flex h-5 shrink-0 w-full justify-start rounded-full border-0 px-2.5 text-xs font-normal">Service</Badge>;
  if (product.stock === null) return null;
  if (product.stock <= 0) return <Badge variant="danger" className="flex h-5 shrink-0 w-full justify-start rounded-full border-0 px-2.5 text-xs font-normal">Out of stock</Badge>;
  if (product.stock <= LOW_STOCK_THRESHOLD) {
    return <Badge variant="warning" className="flex h-5 shrink-0 w-full justify-start rounded-full border-0 px-2.5 text-xs font-normal">Low · {product.stock} left</Badge>;
  }
  return <Badge variant="success" className="flex h-5 shrink-0 w-full justify-start rounded-full border-0 px-2.5 text-xs font-normal">{formatNumber(product.stock)} in stock</Badge>;
}

interface ProductCardProps {
  product: SellableProduct;
  onSelect: (product: SellableProduct) => void;
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  const soldOut = !product.isService && (product.stock ?? 0) <= 0;

  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => onSelect(product)}
      className={cn(
        "flex h-[145px] flex-col items-start gap-2 rounded-xl border border-[#ededed] bg-white p-4 text-left shadow-[0_1px_3px_rgba(47,47,47,0.12)] transition-[border-color,background-color,transform,box-shadow]",
        "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:outline-none",
        soldOut ? "cursor-not-allowed opacity-55" : "hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-[0_5px_14px_rgba(0,140,75,0.09)] active:translate-y-0",
      )}
    >
      <p className="max-w-full sm:max-w-[220px] shrink-0 truncate text-base leading-5 font-semibold text-ink-1">{product.name}</p>
      <p className="shrink-0 text-[13px] leading-5 text-ink-2">{product.sku}</p>
      <StockPill product={product} />
      <p className="mt-auto shrink-0 text-lg leading-6 font-semibold text-ink-1">
        {formatNaira(product.price)}
        <span className="ml-1 text-sm font-normal text-ink-3">/ {product.unit}</span>
      </p>
    </button>
  );
}
