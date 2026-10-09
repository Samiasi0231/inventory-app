"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CustomerFormModal } from "@/components/customers/customer-form-modal";
import { ArchiveEntityModal } from "@/components/common/archive-entity-modal";
import { ContactInfoCard } from "@/components/common/contact-info-card";
import { EntityHeaderCard } from "@/components/common/entity-header-card";
import { InvoiceHistoryCard } from "@/components/common/invoice-history-card";
import { StatCard } from "@/components/ui/statcard";
import { useCustomers } from "@/hooks/use-customer";
import { formatMonthYear, formatNaira } from "@/lib/format";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getCustomer, updateCustomer, archiveCustomer } = useCustomers();

  const [editing, setEditing] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const customer = getCustomer(id);

  if (!customer || customer.archived) {
    return (
      <div className="p-6 text-sm text-gray-600">
        Customer not found.{" "}
        <Link
          href="/people/customers"
          className="font-medium text-emerald-700 hover:underline"
        >
          Back to customers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      <EntityHeaderCard
        name={customer.name}
        meta={`${customer.type} • ${customer.code}`}
        since={`Customer since ${formatMonthYear(customer.since)}`}
        onArchive={() => setArchiving(true)}
        onEdit={() => setEditing(true)}
      />

      <div>
        <span className="inline-block rounded-md bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
          Overview
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Sales"
          value={formatNaira(customer.totalSales)}
        />
        <StatCard
          label="Amount Paid"
          value={formatNaira(customer.totalSales - customer.outstanding)}
        />
        <StatCard
          label="Outstanding"
          value={formatNaira(customer.outstanding)}
        />
        <StatCard
          label="Credit Limit"
          value={
            customer.creditLimit === null
              ? "No Limit"
              : formatNaira(customer.creditLimit)
          }
        />
      </div>

      <ContactInfoCard
        rows={[
          { label: "Contact Person", value: customer.contactPerson },
          { label: "Email", value: customer.email },
          { label: "Phone Number", value: customer.phone },
          { label: "Address", value: customer.address },
        ]}
      />

      {/* TODO: route to the invoice/transaction page once it exists */}
      <InvoiceHistoryCard
        title="Sales History"
        records={customer.sales}
        onView={() => {}}
      />

      <CustomerFormModal
        open={editing}
        customer={customer}
        onClose={() => setEditing(false)}
        onSubmit={(input) => updateCustomer(customer.id, input)}
      />
      <ArchiveEntityModal
        entityLabel="Customer"
        entity={archiving ? customer : null}
        onClose={() => setArchiving(false)}
        onConfirm={async (cid) => {
          await archiveCustomer(cid);
          router.push("/people/customers");
        }}
      />
    </div>
  );
}
