"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { PrimaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { TopbarAction } from "@/layout/app-topbar";
import { cn } from "@/lib/utils";
import { PackageIcon } from "lucide-react";
import { CartPanel } from "@/features/sales/components/cart-panel";
import { ReceiptDialog } from "@/features/sales/components/receipt-dialog";
import type { Receipt } from "@/features/sales/receipts.service";
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

export default function NewSalePage() {
  const router = useRouter();
  const { activeBranch } = useBranch();
  const toast = useToast();
  const { products, customers, loading } = useSaleCatalog(activeBranch.id);

  const [customerId, setCustomerId] = useState<string>("");
  const [customerOpen, setCustomerOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<SellableProduct | null>(null);

  const [lines, setLines] = useState<CartLine[]>([]);
  const [discountMode, setDiscountMode] = useState<DiscountMode>("amount");
  const [discountValue, setDiscountValue] = useState(0);
  const [payments, setPayments] = useState<SalePayment[]>([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<SalePayment["method"]>("cash");

  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState<Receipt | null>(null);

  const visibleProducts = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return products.filter((product) => {
      if (categoryId !== "all" && product.categoryId !== categoryId) return false;
      if (!needle) return true;
      return `${product.name} ${product.sku}`.toLowerCase().includes(needle);
    });
  }, [products, search, categoryId]);

  const totals = calculateCartTotals(lines, discountMode, discountValue, 0);
  const paid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  function addProduct(product: SellableProduct) {
    setSelectedProduct(product.options ? product : null);
    setLines((current) => {
      const existing = current.find((line) => line.productId === product.id);
      if (existing) {
        return current.map((line) =>
          line.productId === product.id
            ? { ...line, quantity: Math.min(line.quantity + 1, product.stock ?? Number.POSITIVE_INFINITY) }
            : line,
        );
      }
      return [
        ...current,
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          unit: product.unit,
          unitPrice: product.price,
          quantity: 1,
        },
      ];
    });
  }

  function addConfiguredProduct(
    product: SellableProduct,
    selection: { quantity: number; unit: string; price: number },
  ) {
    setLines((current) => {
      const existing = current.find((line) => line.productId === product.id);
      if (existing) {
        return current.map((line) =>
          line.productId === product.id
            ? { ...line, unit: selection.unit.toLowerCase(), unitPrice: selection.price, quantity: existing.quantity + selection.quantity }
            : line,
        );
      }
      return [...current, { productId: product.id, name: product.name, sku: product.sku, unit: selection.unit.toLowerCase(), unitPrice: selection.price, quantity: selection.quantity }];
    });
  }

  function changeQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      setLines((current) => current.filter((line) => line.productId !== productId));
      return;
    }
    setLines((current) => current.map((line) => {
      if (line.productId !== productId) return line;
      const product = products.find((entry) => entry.id === productId);
      const maximum = product?.stock ?? Number.POSITIVE_INFINITY;
      return { ...line, quantity: Math.min(quantity, maximum) };
    }));
  }

  function resetSale() {
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
    if (!amount || amount <= 0 || amount > outstanding) return;
    setPayments((current) => [...current, { method: paymentMethod, amount }]);
  }

  function payRemaining() {
    const outstanding = Math.max(0, totals.total - paid);
    if (outstanding <= 0) return;
    setPayments((current) => [...current, { method: paymentMethod, amount: outstanding }]);
    setPaymentAmount(String(outstanding));
  }

  async function confirmSale() {
    if (lines.length === 0) return;
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
        const primaryMethod = payments[0]?.method ?? "credit";
        setCompleted({
          id: `receipt_${result.invoiceId}`,
          number: result.receiptNumber,
          issuedAt: invoice.issueDate,
          invoiceNumber: invoice.number,
          customerName: invoice.customerName,
          method: primaryMethod,
          receivedBy: "Amaka Obi",
          amount: invoice.amountPaid,
          invoiceTotal: invoice.total,
          lines: invoice.lines.map((line) => ({
            description: `${line.quantity} × ${line.name}`,
            quantity: line.quantity,
            amount: line.amount,
          })),
          branchId: invoice.branchId,
        });
      }

      toast.add({
        type: "success",
        title: "Sale confirmed",
        description: `${result.invoiceNumber} · receipt ${result.receiptNumber}`,
      });
      resetSale();
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
    <div className="new-sale-page flex min-w-0 flex-col gap-6">
      <TopbarAction>
        <PrimaryButton
          onClick={() => document.getElementById("sale-search")?.focus()}
          leftIcon={<PlusIcon className="size-5" />}
          className="h-12 px-6 text-base"
        >
          <span className="hidden sm:inline">Add New Sales</span>
          <span className="sm:hidden">New</span>
        </PrimaryButton>
      </TopbarAction>

      <header className="px-0.5">
        <h1 className="text-xl font-semibold text-ink-1">New sale</h1>
        <p className="mt-1 text-base text-ink-1">
          Pick items, take payment, and confirm. The invoice and receipt are created together.
        </p>
      </header>

      <div className="new-sale-layout grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
        <section className="new-sale-catalog flex min-w-0 flex-col gap-3 rounded-xl bg-surface p-5">
          <div className="new-sale-customer flex min-w-0 flex-col gap-1">
              <label htmlFor="customer" className="text-sm text-ink-2">
                Customer
              </label>
              <div className="overflow-hidden rounded-lg border border-border bg-white">
                <button
                  id="customer"
                  type="button"
                  aria-expanded={customerOpen}
                  aria-controls="sale-customer-options"
                  onClick={() => setCustomerOpen((open) => !open)}
                  className="flex h-11 w-full items-center justify-between px-4 text-left text-base text-ink-3"
                >
                  <span>{customerId ? customers.find((customer) => customer.id === customerId)?.name : "Walk-in customer"}</span>
                  <ChevronDownIcon className={`size-5 transition-transform ${customerOpen ? "rotate-180" : ""}`} />
                </button>
                {customerOpen && (
                  <div id="sale-customer-options" role="listbox" aria-label="Customers">
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
                        className="flex h-11 w-full items-center border-t border-[#dedede] px-4 text-left text-base text-ink-2 transition-colors hover:bg-surface-muted"
                      >
                        {customer.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
          </div>

          <div className="flex h-[50px] items-center gap-2 rounded-lg border border-border px-4">
            <input
              id="sale-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, or type or scan a SKU and press Enter"
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {SALE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-pressed={categoryId === category.id}
                onClick={() => setCategoryId(category.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  categoryId === category.id
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border text-ink-2 hover:bg-surface-muted",
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="new-sale-product-grid grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 9 }).map((_, index) => (
                <Skeleton key={index} className="h-[132px] rounded-xl" />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <EmptyState
              icon={PackageIcon}
              title="No products match"
              description="Try a different search term or category."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} onSelect={addProduct} />
              ))}
            </div>
          )}

          {selectedProduct?.options && (
            <ProductConfiguration
              key={selectedProduct.id}
              product={selectedProduct}
              onAdd={(selection) => addConfiguredProduct(selectedProduct, selection)}
            />
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
          onRemoveLine={(productId) =>
            setLines((current) => current.filter((line) => line.productId !== productId))
          }
          onClear={resetSale}
          onDiscountModeChange={setDiscountMode}
          onDiscountValueChange={setDiscountValue}
          onPaymentAmountChange={setPaymentAmount}
          onPaymentMethodChange={setPaymentMethod}
          onAddPayment={addPayment}
          onPayRemaining={payRemaining}
          onRemovePayment={(index) =>
            setPayments((current) => current.filter((_, position) => position !== index))
          }
          onConfirm={confirmSale}
        />
      </div>

      <ReceiptDialog
        receipt={completed}
        open={Boolean(completed)}
        onOpenChange={(open) => !open && setCompleted(null)}
        title="Sale confirmed"
        onViewSale={() => {
          setCompleted(null);
          router.push("/sales/invoices");
        }}
      />
    </div>
  );
}
