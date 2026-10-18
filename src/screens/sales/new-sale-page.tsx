"use client";

import { useMemo, useState } from "react";
import { PlusIcon, SearchIcon } from "lucide-react";
import { PrimaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { TopbarAction } from "@/layout/app-topbar";
import { cn } from "@/lib/utils";
import { PackageIcon } from "lucide-react";
import { CartPanel } from "@/features/sales/components/cart-panel";
import { InvoicePreviewDialog } from "@/features/sales/components/invoice-preview-dialog";
import { ProductCard } from "@/features/sales/components/product-card";
import { SALE_CATEGORIES } from "@/features/sales/mock-data";
import { salesService } from "@/features/sales/sales.service";
import {
  calculateCartTotals,
  type CartLine,
  type DiscountMode,
  type Invoice,
  type SalePayment,
  type SellableProduct,
} from "@/features/sales/types";
import { useSaleCatalog } from "@/features/sales/use-sales";

export default function NewSalePage() {
  const { activeBranch } = useBranch();
  const toast = useToast();
  const { products, customers, loading, setCustomers } = useSaleCatalog(activeBranch.id);

  const [customerId, setCustomerId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");

  const [lines, setLines] = useState<CartLine[]>([]);
  const [discountMode, setDiscountMode] = useState<DiscountMode>("amount");
  const [discountValue, setDiscountValue] = useState(0);
  const [payments, setPayments] = useState<SalePayment[]>([]);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<SalePayment["method"]>("cash");

  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState<{ invoice: Invoice; message: string } | null>(null);

  const visibleProducts = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return products.filter((product) => {
      if (categoryId !== "all" && product.categoryId !== categoryId) return false;
      if (!needle) return true;
      return `${product.name} ${product.sku}`.toLowerCase().includes(needle);
    });
  }, [products, search, categoryId]);

  const totals = calculateCartTotals(lines, discountMode, discountValue);
  const paid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  function addProduct(product: SellableProduct) {
    setLines((current) => {
      const existing = current.find((line) => line.productId === product.id);
      if (existing) {
        return current.map((line) =>
          line.productId === product.id ? { ...line, quantity: line.quantity + 1 } : line,
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

  function changeQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      setLines((current) => current.filter((line) => line.productId !== productId));
      return;
    }
    setLines((current) =>
      current.map((line) => (line.productId === productId ? { ...line, quantity } : line)),
    );
  }

  function resetSale() {
    setLines([]);
    setPayments([]);
    setDiscountValue(0);
    setPaymentAmount("");
    setCustomerId("");
  }

  function addPayment() {
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) return;
    setPayments((current) => [...current, { method: paymentMethod, amount }]);
    setPaymentAmount("");
  }

  function payRemaining() {
    const outstanding = Math.max(0, totals.total - paid);
    if (outstanding <= 0) return;
    setPayments((current) => [...current, { method: paymentMethod, amount: outstanding }]);
    setPaymentAmount("");
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
      });

      const invoice = await salesService.getInvoice(result.invoiceId);
      if (invoice) {
        setCompleted({
          invoice,
          message: `${result.invoiceNumber} created. Stock updated, ledger written, audit event recorded.`,
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

  async function addCustomer() {
    const name = window.prompt("Customer name");
    if (!name?.trim()) return;
    const created = await salesService.createCustomer(name.trim());
    setCustomers((current) => [created, ...current]);
    setCustomerId(created.id);
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
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

      <header>
        <h1 className="text-xl font-semibold text-ink-1">New sale</h1>
        <p className="mt-1 text-base text-ink-1">
          Pick items, take payment, and confirm. The invoice and receipt are created together.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <label htmlFor="customer" className="text-sm text-ink-2">
                Customer
              </label>
              <select
                id="customer"
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                className="h-[42px] w-full rounded-lg border border-border bg-surface px-4 text-sm text-ink-1 outline-none focus-visible:border-primary"
              >
                <option value="">Walk-in customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={addCustomer}
              className="flex h-[42px] shrink-0 items-center gap-1 rounded-lg border border-border px-4 text-sm font-semibold text-primary transition-colors hover:bg-surface-muted"
            >
              <PlusIcon className="size-4" />
              New
            </button>
          </div>

          <div className="flex h-[42px] items-center gap-2 rounded-lg border border-border px-4">
            <SearchIcon className="size-5 shrink-0 text-ink-4" />
            <input
              id="sale-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, or type or scan a SKU and press Enter"
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink-1 outline-none placeholder:text-ink-4"
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
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} onSelect={addProduct} />
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

      <InvoicePreviewDialog
        invoice={completed?.invoice ?? null}
        open={Boolean(completed)}
        onOpenChange={(open) => !open && setCompleted(null)}
        confirmation={completed?.message}
      />
    </div>
  );
}
