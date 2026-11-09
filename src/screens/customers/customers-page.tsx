"use client";

import { useMemo, useState } from "react";
import { TopbarAction } from "@/layout/app-topbar";
import { useRouter, useSearchParams } from "next/navigation";
import type { CustomerAction } from "@/components/customers/customer-action-menu";
import { CustomerFormModal } from "@/components/customers/customer-form-modal";
import { AdjustCreditModal } from "@/components/customers/adjust-credit-modal";
import { CustomersTable } from "@/components/customers/customer-table";
import { ArchiveEntityModal } from "@/components/common/archive-entity-modal";
import { Panel } from "@/components/common/panel";
import { FilterMenu } from "@/components/common/filter-menu";
import { ListPageHeader } from "@/components/common/list-page-header";
import { ListToolbar } from "@/components/common/list-toolbar";
import { useCustomers } from "@/hooks/use-customer";
import { exportCsv } from "@/lib/utils";
import { ROUTES } from "@/lib/routes";
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

export default function CustomersPage({ title: _title, description: _description }: CustomersPageProps) {
  const router = useRouter();
  const adding = useSearchParams().get("add") === "1";

  const {
    customers,
    isLoading,
    isError,
    error,
    hasToken,
    organizationId,
    addCustomer,
    updateCustomer,
    archiveCustomer,
    adjustCredit,
  } = useCustomers();

  const [branch, setBranch] = useState<Branch>("Port Harcourt");
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All types");
  const [modal, setModal] = useState<CustomerModalState>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      if (typeFilter !== "All types" && c.type !== typeFilter) return false;
      if (!q) return true;
      return [c.name, c.email, c.phone, c.code, c.contactPerson].some((v) =>
        v.toLowerCase().includes(q),
      );
    });
  }, [customers, typeFilter, query]);

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

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <p className="font-semibold">Unable to load customers from server</p>
          <p className="mt-1 text-xs">{error?.message || "Please check your network connection and session."}</p>
        </div>
      )}

      {!hasToken && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-white p-8 text-center shadow-xs">
          <p className="text-base font-semibold text-gray-900">Sign in required</p>
          <p className="mt-1 max-w-sm text-xs text-gray-500">
            You must be logged in to access and sync real customers with the live database.
          </p>
          <button
            type="button"
            onClick={() => router.push(ROUTES.signIn)}
            className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-white transition hover:opacity-90"
          >
            Go to Sign In
          </button>
        </div>
      )}

      {hasToken && !organizationId && !isLoading && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-white p-8 text-center shadow-xs">
          <p className="text-base font-semibold text-gray-900">No active organization</p>
          <p className="mt-1 max-w-sm text-xs text-gray-500">
            You don't have an active business organization yet. Complete business onboarding to start managing customers.
          </p>
          <button
            type="button"
            onClick={() => router.push(ROUTES.businessType)}
            className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-white transition hover:opacity-90"
          >
            Complete Business Setup
          </button>
        </div>
      )}

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

        {isLoading ? (
          <div className="flex h-48 items-center justify-center text-sm text-gray-500">
            Loading customers from database...
          </div>
        ) : (
          <CustomersTable customers={visible} onAction={handleAction} />
        )}
      </Panel>

      <CustomerFormModal
        open={adding}
        onClose={() => router.replace("/people/customers")}
        onSubmit={async (input) => {
          await addCustomer(input);
        }}
      />

      <CustomerFormModal
        open={modal?.type === "edit"}
        customer={modal?.type === "edit" ? modal.customer : null}
        onClose={closeModal}
        onSubmit={async (input) => {
          if (modal?.type === "edit") {
            await updateCustomer(modal.customer.id, input);
          }
        }}
      />

      <AdjustCreditModal
        open={modal?.type === "adjust-credit"}
        customer={modal?.type === "adjust-credit" ? modal.customer : null}
        onClose={closeModal}
        onSubmit={async (input) => {
          if (modal?.type === "adjust-credit") {
            await adjustCredit(modal.customer.id, input);
          }
        }}
      />

      <ArchiveEntityModal
        entityLabel="Customer"
        entity={modal?.type === "archive" ? modal.customer : null}
        onClose={closeModal}
        onConfirm={async (id) => {
          await archiveCustomer(id);
        }}
      />
    </div>
  );
}
