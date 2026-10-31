
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ArchiveEntityModal } from "@/components/common/archive-entity-modal";
import { Panel } from "@/components/common/panel";
import { FilterMenu } from "@/components/common/filter-menu";
import { ListPageHeader } from "@/components/common/list-page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { TopbarAction } from "@/layout/app-topbar";

import type { SupplierAction } from "@/components/supliers/supplier-actions-menu";
import { SupplierFormModal } from "@/components/supliers/suplier-form-modal";
import { SuppliersTable } from "@/components/supliers/suppliers-table";

import { useSuppliers } from "@/hooks/use-suppliers";
import { exportCsv } from "@/lib/utils";
import { BRANCHES, type Branch } from "@/types/staff";

import {
  SUPPLIER_TYPES,
  type Supplier,
  type SupplierModalState,
} from "@/types/suppliers";

interface SuppliersPageProps {
  title: string;
  description: string;
}

const TYPE_FILTERS = ["All types", ...SUPPLIER_TYPES] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

export default function SuppliersPage({
  title,
  description,
}: SuppliersPageProps) {
  const router = useRouter();

  const { suppliers, addSupplier, updateSupplier, archiveSupplier } =
    useSuppliers();

  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [branch, setBranch] = useState<Branch>("Port Harcourt");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] =
    useState<TypeFilter>("All types");
  const [modal, setModal] = useState<SupplierModalState>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      const matchesBranch = supplier.branch === branch;

      const matchesType =
        typeFilter === "All types" ||
        supplier.type === typeFilter;

      const matchesSearch =
        !q ||
        [
          supplier.name,
          supplier.email,
          supplier.phone,
          supplier.code,
        ].some((value) => value.toLowerCase().includes(q));

      return matchesBranch && matchesType && matchesSearch;
    });
  }, [suppliers, branch, typeFilter, query]);

  const handleAction = (
    action: SupplierAction,
    supplier: Supplier,
  ) => {
    if (action === "view") {
      router.push(`/people/suppliers/${supplier.id}`);
      return;
    }

    setModal({ type: action, supplier });
  };

  const closeModal = () => setModal(null);

  const handleExport = () =>
    exportCsv(
      visible,
      [
        { header: "ID", value: (supplier) => supplier.code },
        { header: "Vendor", value: (supplier) => supplier.name },
        { header: "Email", value: (supplier) => supplier.email },
        { header: "Phone", value: (supplier) => supplier.phone },
        {
          header: "Total Purchase",
          value: (supplier) => supplier.totalPurchases,
        },
        {
          header: "Outstanding",
          value: (supplier) => supplier.outstanding,
        },
      ],
      "suppliers.csv",
    );

  return (
    <div className="min-w-0 space-y-6">
      <TopbarAction>
        <button
          type="button"
          onClick={() => setIsAddSupplierOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          <span className="text-lg leading-none">+</span>
          Add Supplier
        </button>
      </TopbarAction>

      <ListPageHeader
        title={title}
        description={description}
        branch={branch}
        branches={BRANCHES}
        onBranchChange={setBranch}
        onExport={handleExport}
      />

      <Panel>
        <ListToolbar
          search={query}
          onSearchChange={setQuery}
          placeholder="Search in Supplier List"
        >
          <FilterMenu
            label="Filter"
            value={typeFilter}
            options={TYPE_FILTERS}
            defaultValue="All types"
            defaultLabel="All types"
            onChange={(value) => setTypeFilter(value as TypeFilter)}
          />
        </ListToolbar>

        <SuppliersTable
          suppliers={visible}
          onAction={handleAction}
        />
      </Panel>

      {/* Add Supplier */}
      <SupplierFormModal
        open={isAddSupplierOpen}
        onClose={() => setIsAddSupplierOpen(false)}
        onSubmit={addSupplier}
      />

      {/* Edit Supplier */}
      <SupplierFormModal
        open={modal?.type === "edit"}
        supplier={modal?.type === "edit" ? modal.supplier : null}
        onClose={closeModal}
        onSubmit={async (input) => {
          if (modal?.type !== "edit") return;

          await updateSupplier(modal.supplier.id, input);
        }}
      />

      {/* Archive Supplier */}
      <ArchiveEntityModal
        entityLabel="Supplier"
        entity={modal?.type === "archive" ? modal.supplier : null}
        onClose={closeModal}
        onConfirm={archiveSupplier}
      />
    </div>
  );
}
