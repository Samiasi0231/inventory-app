"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { ArchiveEntityModal } from "@/components/common/archive-entity-modal";
import { Panel} from "@/components/common/panel";
import { FilterDropdown } from "@/components/common/filter-dropdwon";
import { ListPageHeader } from "@/components/common/list-page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
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

interface StaffPageProps {
  title: string;
  description: string;
}
const TYPE_FILTERS = ["All types", ...SUPPLIER_TYPES] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

interface SuppliersPageProps {
  title: string;
  description: string;
}

export default function SuppliersPage({
  title,
  description,
}: SuppliersPageProps) {
  const router = useRouter();
  // The header's "Add Supplier" button navigates to /people/suppliers?add=1 to open the modal.
  const adding = useSearchParams().get("add") === "1";
  const { suppliers, addSupplier, updateSupplier, archiveSupplier } =
    useSuppliers();

  const [branch, setBranch] = useState<Branch>("Port Harcourt");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All types");
  const [modal, setModal] = useState<SupplierModalState>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suppliers.filter((s) => {
      if (s.branch !== branch) return false;
      if (typeFilter !== "All types" && s.type !== typeFilter) return false;
      if (!q) return true;
      return [s.name, s.email, s.phone, s.code].some((v) =>
        v.toLowerCase().includes(q),
      );
    });
  }, [suppliers, branch, typeFilter, query]);

  const handleAction = (action: SupplierAction, supplier: Supplier) => {
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
        { header: "ID", value: (s) => s.code },
        { header: "Vendor", value: (s) => s.name },
        { header: "Email", value: (s) => s.email },
        { header: "Phone", value: (s) => s.phone },
        { header: "Total Purchase", value: (s) => s.totalPurchases },
        { header: "Outstanding", value: (s) => s.outstanding },
      ],
      "suppliers.csv",
    );

  return (
    <div className="space-y-5 p-6">
      <ListPageHeader
        title="Suppliers"
        description="Gives product prices and terms"
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
          <FilterDropdown
            value={typeFilter}
            options={TYPE_FILTERS}
            onChange={setTypeFilter}
            icon={<Filter size={13} />}
            label={typeFilter === "All types" ? "Filter" : typeFilter}
          />
        </ListToolbar>
        <SuppliersTable suppliers={visible} onAction={handleAction} />
      </Panel>

      <SupplierFormModal
        open={adding}
        onClose={() => router.replace("/people/suppliers")}
        onSubmit={addSupplier}
      />
      <SupplierFormModal
        open={modal?.type === "edit"}
        supplier={modal?.type === "edit" ? modal.supplier : null}
        onClose={closeModal}
        onSubmit={(input) =>
          updateSupplier((modal as { supplier: Supplier }).supplier.id, input)
        }
      />
      <ArchiveEntityModal
        entityLabel="Supplier"
        entity={modal?.type === "archive" ? modal.supplier : null}
        onClose={closeModal}
        onConfirm={archiveSupplier}
      />
    </div>
  );
}
