"use client";

import { useMemo, useState } from "react";
import { TopbarAction } from "@/layout/app-topbar";
import { useRouter, useSearchParams } from "next/navigation";
import type { CustomerAction } from "@/components/customers/customer-action-menu";
import { CustomerFormModal } from "@/components/customers/customer-form-modal";
import { CustomersTable } from "@/components/customers/customer-table";
import { ArchiveEntityModal } from "@/components/common/archive-entity-modal";
import { Panel } from "@/components/common/panel";
import { FilterMenu } from "@/components/common/filter-menu";
import { ListPageHeader } from "@/components/common/list-page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { useCustomers } from "@/hooks/use-customer";
import { exportCsv } from "@/lib/utils";
import { BRANCHES, type Branch } from "@/types/staff";
import {
  CUSTOMER_TYPES,
  type Customer,
  type CustomerModalState,
} from "@/types/customer";
interface CustomersPageProps {
  title: string;
  description: string;
}

const TYPE_FILTERS = ["All types", ...CUSTOMER_TYPES] as const;
type TypeFilter = (typeof TYPE_FILTERS)[number];

export default function CustomersPage({ title, description }: CustomersPageProps) {
  const router = useRouter();
  // The header's "Add Customer" button navigates to /people/customers?add=1 to open the modal.
  const adding = useSearchParams().get("add") === "1";
  const { customers, addCustomer, updateCustomer, archiveCustomer } =
    useCustomers();

  const [branch, setBranch] = useState<Branch>("Port Harcourt");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All types");
  const [modal, setModal] = useState<CustomerModalState>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      if (c.branch !== branch) return false;
      if (typeFilter !== "All types" && c.type !== typeFilter) return false;
      if (!q) return true;
      return [c.name, c.email, c.phone, c.code].some((v) =>
        v.toLowerCase().includes(q),
      );
    });
  }, [customers, branch, typeFilter, query]);

  const handleAction = (action: CustomerAction, customer: Customer) => {
    if (action === "view") {
      router.push(`/people/customers/${customer.id}`);
      return;
    }
    setModal({ type: action, customer });
  };

  const closeModal = () => setModal(null);

  const handleExport = () =>
    exportCsv(
      visible,
      [
        { header: "ID", value: (c) => c.code },
        { header: "Customer", value: (c) => c.name },
        { header: "Email", value: (c) => c.email },
        { header: "Phone", value: (c) => c.phone },
        { header: "Total Sales", value: (c) => c.totalSales },
        { header: "Outstanding", value: (c) => c.outstanding },
      ],
      "customers.csv",
    );

  return (
   <div className="min-w-0 space-y-6">
    <TopbarAction>
      <button
        type="button"
        onClick={() => router.push("/people/customers?add=1")}
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:opacity-90"
      >
        <span className="text-lg leading-none">+</span>
        Add Customer
      </button>
    </TopbarAction>

    <ListPageHeader
      title="Customer"
      description="Manage customer records, balances and sales history"
      branch={branch}
      branches={BRANCHES}
      onBranchChange={setBranch}
      onExport={handleExport}
    />

      <Panel>
        <ListToolbar
          search={query}
          onSearchChange={setQuery}
          placeholder="Search customers"
        >
          <FilterMenu
            value={typeFilter}
            options={TYPE_FILTERS}
            onChange={setTypeFilter}
            defaultValue="All types"
          />
        </ListToolbar>
        <CustomersTable customers={visible} onAction={handleAction} />
      </Panel>

      <CustomerFormModal
        open={adding}
        onClose={() => router.replace("/people/customers")}
        onSubmit={addCustomer}
      />
      <CustomerFormModal
        open={modal?.type === "edit"}
        customer={modal?.type === "edit" ? modal.customer : null}
        onClose={closeModal}
        onSubmit={(input) =>
          updateCustomer((modal as { customer: Customer }).customer.id, input)
        }
      />
      <ArchiveEntityModal
        entityLabel="Customer"
        entity={modal?.type === "archive" ? modal.customer : null}
        onClose={closeModal}
        onConfirm={archiveCustomer}
      />
    </div>
  );
}