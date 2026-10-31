
"use client";

import { useMemo, useState } from "react";
import { ChevronDownIcon, PlusIcon, PackageIcon } from "lucide-react";
import { PrimaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { TopbarAction } from "@/layout/app-topbar";
import { cn } from "@/lib/utils";
import { CartPanel } from "@/features/sales/components/cart-panel";
import { InvoicePreviewDialog } from "@/features/sales/components/invoice-preview-dialog";
import type { Invoice } from "@/features/sales/types";
import { ProductCard } from "@/features/sales/components/product-card";
import { ProductConfiguration } from "@/features/sales/components/product-configuration";
import { SALE_CATEGORIES } from "@/features/sales/mock-data";
import { salesService } from "@/features/sales/sales.service";
import {
  calculateCartTotals,
  type CartLine,
  type DiscountMode,
  type SalePayment,
  type SellableProduct,
} from "@/features/sales/types";
import { useSaleCatalog } from "@/features/sales/use-sales";

type ProductSelection = {
  quantity: number;
  unit: string;
  price: number;
  size: string;
  type: string;
  maximum: number;
};

export default function NewSalePage() {
  const { activeBranch } = useBranch();
  const toast = useToast();
  const { products, customers, loading } = useSaleCatalog(activeBranch.id);

  const [customerId, setCustomerId] = useState("");
  const [customerOpen, setCustomerOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [selectedProduct, setSelectedProduct] =
    useState<SellableProduct | null>(null);
  const [editingLine, setEditingLine] = useState<CartLine | null>(null);

  const [lines, setLines] = useState<CartLine[]>([]);
  const [discountMode, setDiscountMode] =
    useState<DiscountMode>("amount");
  const [discountValue, setDiscountValue] = useState(0);
  const [payments, setPayments] = useState<SalePayment[]>([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<SalePayment["method"]>("cash");

  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState<Invoice | null>(null);

  const visibleProducts = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return products.filter((product) => {
      if (categoryId !== "all" && product.categoryId !== categoryId) {
        return false;
      }

      if (!needle) return true;

      return `${product.name} ${product.sku}`
        .toLowerCase()
        .includes(needle);
    });
  }, [products, search, categoryId]);

  const totals = calculateCartTotals(
    lines,
    discountMode,
    discountValue,
    0,
  );

  const paid = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  function addProduct(product: SellableProduct) {
    setEditingLine(null);
    setSelectedProduct(product);
  }

  function addConfiguredProduct(
    product: SellableProduct,
    selection: ProductSelection,
  ) {
    const normalizedUnit = selection.unit.toLowerCase();

    const lineId = [
      product.id,
      selection.size,
      selection.type,
      normalizedUnit,
    ].join(":");

    const maximum = Math.max(0, selection.maximum);
    const quantity = Math.min(
      Math.max(1, selection.quantity),
      maximum,
    );

    if (quantity <= 0) {
      toast.add({
        type: "error",
        title: "Insufficient stock",
        description: "This product has no available stock for the selected unit.",
      });
      return;
    }

    setLines((previous) => {
      // When editing, remove the old line before updating or adding
      // the newly configured line.
      const current = editingLine
        ? previous.filter(
            (line) =>
              (line.lineId ?? line.productId) !==
              (editingLine.lineId ?? editingLine.productId),
          )
        : previous;

      const existing = current.find(
        (line) => line.lineId === lineId,
      );

      if (existing) {
        return current.map((line) =>
          line.lineId === lineId
            ? {
                ...line,
                quantity: Math.min(
                  maximum,
                  line.quantity + quantity,
                ),
              }
            : line,
        );
      }

      return [
        ...current,
        {
          lineId,
          productId: product.id,
          name: [product.name, selection.size, selection.type]
            .filter(Boolean)
            .join(" · "),
          sku: product.sku,
          size: selection.size,
          variant: selection.type,
          maximum,
          unit: normalizedUnit,
          unitPrice: selection.price,
          quantity,
        },
      ];
    });

    setSelectedProduct(null);
    setEditingLine(null);
  }

  function changeQuantity(lineIdOrProductId: string, quantity: number) {
    if (quantity <= 0) {
      setLines((current) =>
        current.filter(
          (line) =>
            (line.lineId ?? line.productId) !== lineIdOrProductId,
        ),
      );
      return;
    }

    setLines((current) =>
      current.map((line) => {
        if (
          (line.lineId ?? line.productId) !== lineIdOrProductId
        ) {
          return line;
        }

        const product = products.find(
          (entry) => entry.id === line.productId,
        );

        const maximum =
          line.maximum ?? product?.stock ?? Number.POSITIVE_INFINITY;

        return {
          ...line,
          quantity: Math.min(quantity, maximum),
        };
      }),
    );
  }

  function resetSale() {
    setEditingLine(null);
    setLines([]);
    setPayments([]);
    setDiscountValue(0);
    setPaymentAmount("");
    setCustomerId("");
    setSelectedProduct(null);
  }

  function addPayment() {
    const amount = Number(paymentAmount);
    const outstanding = Math.max(0, totals.total - paid);

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > outstanding
    ) {
      return;
    }

    setPayments((current) => [
      ...current,
      { method: paymentMethod, amount },
    ]);
    setPaymentAmount("");
  }

  function payRemaining() {
    const outstanding = Math.max(0, totals.total - paid);

    if (outstanding <= 0) return;

    setPayments((current) => [
      ...current,
      { method: paymentMethod, amount: outstanding },
    ]);
    setPaymentAmount("");
  }

  async function confirmSale() {
    if (lines.length === 0 || submitting) return;

    if (paid > totals.total + 0.01) {
      toast.add({
        type: "error",
        title: "Update payments",
        description:
          "Payments exceed the total. Remove a payment before confirming.",
      });
      return;
    }

    if (!customerId && paid + 0.01 < totals.total) {
      toast.add({
        type: "error",
        title: "Payment required",
        description:
          "Pay in full or choose a customer to sell on credit.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const result = await salesService.createSale({
        branchId: activeBranch.id,
        customerId: customerId || null,
        lines,
        discountMode,
        discountValue,
        payments,
        vatRate: 0,
      });

      const invoice = await salesService.getInvoice(result.invoiceId);

      if (invoice) {
        setCompleted(invoice);
      }

      toast.add({
        type: "success",
        title: "Sale confirmed",
        description: `${result.invoiceNumber} · receipt ${result.receiptNumber}`,
      });
    } catch {
      toast.add({
        type: "error",
        title: "Couldn't confirm sale",
        description: "Nothing was charged. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="sale-workspace flex min-w-0 flex-col gap-6 2xl:ml-2">
      <TopbarAction>
        <PrimaryButton
          onClick={() =>
            document.getElementById("sale-search")?.focus()
          }
          leftIcon={<PlusIcon className="size-5" />}
          className="h-12 px-6 text-base"
        >
          <span className="hidden sm:inline">Add New Sales</span>
          <span className="sm:hidden">New</span>
        </PrimaryButton>
      </TopbarAction>

      <header className="px-0.5">
        <h1 className="text-[28px] leading-9 font-semibold text-ink-1">
          New sale
        </h1>
        <p className="mt-0.5 text-base text-ink-1">
          Pick items, take payment, and confirm. The invoice and receipt
          are created together.
        </p>
      </header>

      <div className="sale-columns -mt-[3px] grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_430px] 2xl:max-w-[1233px] 2xl:grid-cols-[763px_430px] 2xl:gap-10">
        <section className="sale-catalog flex min-w-0 flex-col gap-[11px] overflow-visible rounded-xl bg-surface px-5 pt-[18px] pb-10 xl:min-h-[1424px]">
          <div className="flex min-w-0 flex-col gap-1">
            <label
              htmlFor="customer"
              className="text-sm font-semibold text-ink-2"
            >
              Customer
            </label>

            <div className="overflow-hidden rounded-xl border border-[#ededed] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
              <button
                id="customer"
                type="button"
                aria-expanded={customerOpen}
                aria-controls="sale-customer-options"
                onClick={() => setCustomerOpen((open) => !open)}
                className="flex h-[42px] w-full items-center justify-between px-4 text-left text-base text-ink-3"
              >
                <span>
                  {customerId
                    ? customers.find(
                        (customer) => customer.id === customerId,
                      )?.name
                    : "Walk-in customer"}
                </span>

                <ChevronDownIcon
                  className={`size-5 transition-transform ${
                    customerOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {customerOpen && (
                <div
                  id="sale-customer-options"
                  role="listbox"
                  aria-label="Customers"
                >
                  {customers.map((customer) => (
                    <button
                      key={customer.id}
                      type="button"
                      role="option"
                      aria-selected={customerId === customer.id}
                      onClick={() => {
                        setCustomerId(customer.id);
                        setCustomerOpen(false);
                      }}
                      className="flex h-[42px] w-full items-center border-t border-[#e5e5e5] bg-[#f7f7f7] px-4 text-left text-base text-ink-2 transition-colors hover:bg-surface-muted"
                    >
                      {customer.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex h-[50px] items-center gap-2 rounded-xl border border-[#ededed] px-3 shadow-[0_1px_3px_rgba(0,0,0,0.10)]">
            <input
              id="sale-search"
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelectedProduct(null);
                setEditingLine(null);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;

                const normalizedSearch = search.trim().toLowerCase();

                const match =
                  visibleProducts.find(
                    (product) =>
                      product.sku.toLowerCase() === normalizedSearch,
                  ) ??
                  (visibleProducts.length === 1
                    ? visibleProducts[0]
                    : null);

                if (
                  match &&
                  (match.isService || (match.stock ?? 0) > 0)
                ) {
                  setEditingLine(null);
                  setSelectedProduct(match);
                }
              }}
              placeholder="Search by name, or type or scan a SKU and press Enter"
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {SALE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-pressed={categoryId === category.id}
                onClick={() => {
                  setCategoryId(category.id);
                  setSelectedProduct(null);
                  setEditingLine(null);
                }}
                className={cn(
                  "h-8 rounded-full border px-[15px] text-sm font-normal shadow-[0_1px_3px_rgba(0,0,0,0.10)] transition-colors",
                  categoryId === category.id
                    ? "border-[#e9e9e9] bg-[#f5f5f5] text-primary"
                    : "border-[#e9e9e9] bg-white text-ink-2 hover:bg-surface-muted",
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          {selectedProduct ? (
            <ProductConfiguration
              key={`${selectedProduct.id}-${editingLine?.lineId ?? "new"}`}
              product={selectedProduct}
              initialLine={editingLine}
              onBack={() => {
                setSelectedProduct(null);
                setEditingLine(null);
              }}
              onAdd={(selection) =>
                addConfiguredProduct(selectedProduct, selection)
              }
            />
          ) : loading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[132px] rounded-xl"
                />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <EmptyState
              icon={PackageIcon}
              title="No products match"
              description="Try a different search term or category."
            />
          ) : (
            <div className="grid gap-x-[14px] gap-y-[14px] sm:grid-cols-2">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={addProduct}
                />
              ))}
            </div>
          )}
        </section>

        <CartPanel
          lines={lines}
          discountMode={discountMode}
          discountValue={discountValue}
          payments={payments}
          paymentAmount={paymentAmount}
          paymentMethod={paymentMethod}
          submitting={submitting}
          onQuantityChange={changeQuantity}
          onRemoveLine={(lineIdOrProductId) =>
            setLines((current) =>
              current.filter(
                (line) =>
                  (line.lineId ?? line.productId) !== lineIdOrProductId,
              ),
            )
          }
          onClear={resetSale}
          onEditLine={(line) => {
            setEditingLine(line);
            setSelectedProduct(
              products.find(
                (product) => product.id === line.productId,
              ) ?? null,
            );
          }}
          onDiscountModeChange={setDiscountMode}
          onDiscountValueChange={setDiscountValue}
          onPaymentAmountChange={setPaymentAmount}
          onPaymentMethodChange={setPaymentMethod}
          onAddPayment={addPayment}
          onPayRemaining={payRemaining}
          onRemovePayment={(index) =>
            setPayments((current) =>
              current.filter((_, position) => position !== index),
            )
          }
          onConfirm={confirmSale}
        />
      </div>

      <InvoicePreviewDialog
        invoice={completed}
        open={Boolean(completed)}
        onOpenChange={(open) => {
          if (!open) {
            setCompleted(null);
            resetSale();
          }
        }}
      />
    </div>
  );
}
