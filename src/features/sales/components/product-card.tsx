"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LOW_STOCK_THRESHOLD } from "../mock-data";
import type { SellableProduct } from "../types";

/** Stock pill: services carry no stock, so they read as "Service". */
function StockPill({ product }: { product: SellableProduct }) {
  if (product.isService) return <Badge variant="neutral">Service</Badge>;
  if (product.stock === null) return null;
  if (product.stock <= 0) return <Badge variant="danger">Out of stock</Badge>;
  if (product.stock <= LOW_STOCK_THRESHOLD) {
    return <Badge variant="warning">Low · {product.stock} left</Badge>;
  }
  return <Badge variant="success">{formatNumber(product.stock)} in stock</Badge>;
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
        "flex flex-col items-start gap-2 rounded-xl border border-border/70 bg-surface p-4 text-left transition-colors",
        "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:outline-none",
        soldOut ? "cursor-not-allowed opacity-55" : "hover:border-primary/50 hover:bg-accent/40",
      )}
    >
      <p className="line-clamp-2 text-sm font-semibold text-ink-1">{product.name}</p>
      <p className="text-xs text-ink-4">{product.sku}</p>
      <StockPill product={product} />
      <p className="mt-1 text-base font-semibold text-ink-1">
        {formatCurrency(product.price)}
        <span className="ml-1 text-xs font-normal text-ink-3">/ {product.unit}</span>
      </p>
    </button>
  );
}
