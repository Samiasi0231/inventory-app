"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArchiveEntityModal } from "@/components/common/archive-entity-modal";
import { ContactInfoCard } from "@/components/common/contact-info-card";
import { EntityHeaderCard } from "@/components/common/entity-header-card";
import { InvoiceHistoryCard } from "@/components/common/invoice-history-card";
import { StatCard } from "@/components/ui/statcard";
import { SupplierFormModal } from "@/components/supliers/suplier-form-modal";
import { useSuppliers } from "@/hooks/use-suppliers";
import { formatMonthYear, formatNaira } from "@/lib/format";


export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getSupplier, updateSupplier, archiveSupplier } = useSuppliers();

  const [editing, setEditing] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const supplier = getSupplier(id);

  if (!supplier || supplier.archived) {
    return (
      <div className="p-6 text-sm text-gray-600">
        Supplier not found.{" "}
        <Link
          href="/people/suppliers"
          className="font-medium text-emerald-700 hover:underline"
        >
          Back to suppliers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 p-6">
      <EntityHeaderCard
        name={supplier.name}
        meta={`${supplier.type} • ${supplier.code}`}
        since={`Supplier since ${formatMonthYear(supplier.since)}`}
        onArchive={() => setArchiving(true)}
        onEdit={() => setEditing(true)}
      />

      <div>
        <span className="inline-block rounded-md bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
          Overview
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Purchases"
          value={formatNaira(supplier.totalPurchases)}
        />
        <StatCard
          label="Amount Paid"
          value={formatNaira(supplier.totalPurchases - supplier.outstanding)}
        />
        <StatCard
          label="Outstanding"
          value={formatNaira(supplier.outstanding)}
        />
      </div>

      <ContactInfoCard
        rows={[
          { label: "Contact Person", value: supplier.contactPerson },
          { label: "Email", value: supplier.email },
          { label: "Phone Number", value: supplier.phone },
          { label: "Address", value: supplier.address },
        ]}
      />

      {/* TODO: route to the invoice/transaction page once it exists */}
      <InvoiceHistoryCard
        title="Purchase History"
        records={supplier.purchases}
        onView={() => {}}
      />

      <SupplierFormModal
        open={editing}
        supplier={supplier}
        onClose={() => setEditing(false)}
        onSubmit={(input) => updateSupplier(supplier.id, input)}
      />
      <ArchiveEntityModal
        entityLabel="Supplier"
        entity={archiving ? supplier : null}
        onClose={() => setArchiving(false)}
        onConfirm={async (sid) => {
          await archiveSupplier(sid);
          router.push("/people/suppliers");
        }}
      />
    </div>
  );
}
