"use client";

import { useMemo, useState } from "react";
import {
  DownloadIcon,
  FolderSearchIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { EmptyState } from "@/components/common/empty-state";
import { FormDialog } from "@/components/common/form-dialog";
import { StatCard, StatCardSkeleton } from "@/components/common/stat-card";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/toast";
import { useBranch } from "@/context/branch-context";
import { BranchSelector } from "@/layout/branch-selector";
import { TopbarAction } from "@/layout/app-topbar";
import { formatCurrencyCompact, formatNumber } from "@/lib/format";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { SortDirection } from "@/types/shared";
import { AddProductDialog } from "@/features/inventory/components/add-product/add-product-dialog";
import { AdjustStockDialog } from "@/features/inventory/components/adjust-stock-dialog";
import {
  DEFAULT_FILTERS,
  InventoryFilters,
  type InventoryFilterState,
} from "@/features/inventory/components/inventory-filters";
import { ProductsTable } from "@/features/inventory/components/products-table";
import type { RowAction } from "@/features/inventory/components/product-row-actions";
import { CreatePurchaseOrderDialog } from "@/features/purchasing/components/create-purchase-order-dialog";
import { TransferStockDialog } from "@/features/inventory/components/transfer-stock-dialog";
import { inventoryService } from "@/features/inventory/inventory.service";
import type { InventoryItem } from "@/features/inventory/types";
import { useInventoryList, useInventorySummary } from "@/features/inventory/use-inventory";

type DialogKind = "transfer" | "adjust" | "reorder" | "archive" | null;

interface InventoryProductsPageProps {
  /** Renders the archived list instead of the active one. */
  archived?: boolean;
  title?: string;
  description?: string;
}

export default function InventoryProductsPage({
  archived = false,
  title = "Products",
  description = "Manage your products and track stock across your branches.",
}: InventoryProductsPageProps) {
  const { activeBranch } = useBranch();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [filters, setFilters] = useState<InventoryFilterState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [activeItem, setActiveItem] = useState<InventoryItem | null>(null);
  const [dialog, setDialog] = useState<DialogKind>(null);
  // Bumped per row action so the dialog remounts and re-seeds its form.
  const [dialogKey, setDialogKey] = useState(0);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const params = useMemo(
    () => ({
      page,
      pageSize: 15,
      search: debouncedSearch || undefined,
      branchId: activeBranch.id,
      status: filters.status,
      categoryId: filters.categoryId,
      archived,
      sortBy,
      sortDirection,
    }),
    [page, debouncedSearch, activeBranch.id, filters, archived, sortBy, sortDirection],
  );

  const list = useInventoryList(params);
  const summary = useInventorySummary(activeBranch.id);

  const items = list.data?.data ?? [];
  const total = list.data?.total ?? 0;
  const hasFilters = Boolean(debouncedSearch) || filters.status !== "all" || filters.categoryId !== "all";

  function handleSortChange(column: string) {
    setPage(1);
    if (sortBy === column) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  }

  function handleRowAction(action: RowAction, item: InventoryItem) {
    setActiveItem(item);
    if (action === "view") {
      toast.add({
        type: "info",
        title: item.name,
        description: `${item.itemCode} • ${formatNumber(item.totalStock)} ${item.baseUnit.toLowerCase()}s in ${activeBranch.name}`,
      });
      return;
    }
    setDialogKey((key) => key + 1);
    setDialog(action);
  }

  async function confirmArchive() {
    if (!activeItem) return;
    setArchiving(true);
    try {
      await inventoryService.archiveItem(activeItem.id);
      toast.add({
        type: "success",
        title: "Product archived",
        description: `${activeItem.name} has been moved to Archived.`,
      });
      setDialog(null);
      list.refetch();
      summary.refetch();
    } catch {
      toast.add({
        type: "error",
        title: "Couldn't archive product",
        description: "Please try again.",
      });
    } finally {
      setArchiving(false);
    }
  }

  function handleMutationSuccess() {
    list.refetch();
    summary.refetch();
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <TopbarAction>
        <PrimaryButton
          onClick={() => setAddProductOpen(true)}
          leftIcon={<PlusIcon className="size-5" />}
          className="h-12 px-6 text-base"
        >
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </PrimaryButton>
      </TopbarAction>

      <section className="flex flex-col gap-4 rounded-xl bg-surface p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-ink-1">{title}</h1>
          <p className="mt-2 text-base text-ink-1">{description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <BranchSelector />
          <button
            type="button"
            className="flex h-8 items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold tracking-[0.14px] text-primary transition-colors hover:bg-surface-muted"
          >
            <DownloadIcon className="size-4" />
            Export
          </button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {summary.loading || !summary.data ? (
          Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
        ) : (
          <>
            <StatCard
              icon={FolderSearchIcon}
              label="Stock Value"
              value={formatCurrencyCompact(summary.data.stockValue)}
              description="Total stock worth"
              delta={summary.data.stockValueDelta}
            />
            <StatCard
              icon={FolderSearchIcon}
              label="Potential Sales Value"
              value={formatCurrencyCompact(summary.data.potentialSalesValue)}
              description="After sales of all products"
              delta={summary.data.potentialSalesValueDelta}
            />
            <StatCard
              icon={FolderSearchIcon}
              label="Profit to be made"
              value={formatCurrencyCompact(summary.data.profitToBeMade)}
              description="After sales of all products"
              delta={summary.data.profitToBeMadeDelta}
            />
            <StatCard
              icon={FolderSearchIcon}
              label="Stock Requiring Attention"
              value={formatNumber(summary.data.itemsRequiringAttention)}
              description="Low stock, expiring products"
              delta={summary.data.itemsRequiringAttentionDelta}
            />
          </>
        )}
      </section>

      <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex h-[42px] w-full items-center gap-2 rounded-lg border border-border px-4 py-2 sm:max-w-[633px]">
            <SearchIcon className="size-5 shrink-0 text-ink-4" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search in Items"
              aria-label="Search in items"
              className="min-w-0 flex-1 bg-transparent text-base text-ink-1 outline-none placeholder:text-ink-4"
            />
          </div>

          <div className="self-start sm:self-auto">
            <InventoryFilters
              value={filters}
              onChange={(next) => {
                setFilters(next);
                setPage(1);
              }}
            />
          </div>
        </div>

        {list.error ? (
          <EmptyState
            icon={TriangleAlertIcon}
            title="We couldn't load your products"
            description={list.error}
            action={<SecondaryButton onClick={list.refetch}>Try again</SecondaryButton>}
          />
        ) : !list.loading && items.length === 0 ? (
          <EmptyState
            icon={PackageIcon}
            title={hasFilters ? "No products match your filters" : "No products yet"}
            description={
              hasFilters
                ? "Try a different search term or clear your filters."
                : "Add your first product to start tracking stock across your branches."
            }
            action={
              hasFilters ? (
                <SecondaryButton
                  onClick={() => {
                    setSearch("");
                    setFilters(DEFAULT_FILTERS);
                    setPage(1);
                  }}
                >
                  Clear filters
                </SecondaryButton>
              ) : (
                <PrimaryButton
                  onClick={() => setAddProductOpen(true)}
                  leftIcon={<PlusIcon className="size-4" />}
                >
                  Add Product
                </PrimaryButton>
              )
            }
          />
        ) : (
          <>
            <ProductsTable
              items={items}
              loading={list.loading}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onSortChange={handleSortChange}
              onAction={handleRowAction}
            />
            <Pagination page={page} pageSize={15} total={total} onPageChange={setPage} />
          </>
        )}
      </section>

      {activeItem && (
        <>
          <TransferStockDialog
            key={`transfer-${dialogKey}`}
            item={activeItem}
            open={dialog === "transfer"}
            onOpenChange={(open) => setDialog(open ? "transfer" : null)}
            onSuccess={handleMutationSuccess}
          />
          <AdjustStockDialog
            key={`adjust-${dialogKey}`}
            item={activeItem}
            open={dialog === "adjust"}
            onOpenChange={(open) => setDialog(open ? "adjust" : null)}
            onSuccess={handleMutationSuccess}
          />
          <CreatePurchaseOrderDialog
            key={`reorder-${dialogKey}`}
            seedLine={{
              productName: activeItem.name,
              unitCost: activeItem.costPrice,
              quantity: Math.max(1, activeItem.reorderPoint - activeItem.totalStock),
            }}
            open={dialog === "reorder"}
            onOpenChange={(open) => setDialog(open ? "reorder" : null)}
          />
        </>
      )}

      <FormDialog
        open={dialog === "archive"}
        onOpenChange={(open) => setDialog(open ? "archive" : null)}
        title="Archive product"
        description={
          activeItem
            ? `${activeItem.name} will be hidden from the products list. You can restore it from Archived.`
            : undefined
        }
        className="sm:max-w-[440px]"
        footer={
          <>
            <SecondaryButton onClick={() => setDialog(null)} disabled={archiving}>
              Cancel
            </SecondaryButton>
            <PrimaryButton
              onClick={confirmArchive}
              loading={archiving}
              className="bg-destructive hover:bg-destructive/90 active:bg-destructive"
            >
              Archive product
            </PrimaryButton>
          </>
        }
      >
        <p className="text-sm text-ink-3">
          Archiving keeps the product&apos;s history and stock records, but removes it from day-to-day
          lists and reports.
        </p>
      </FormDialog>

      <AddProductDialog
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        onSuccess={handleMutationSuccess}
      />
    </div>
  );
}
