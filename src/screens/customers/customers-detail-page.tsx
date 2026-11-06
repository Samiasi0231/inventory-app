"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { CustomerFormModal } from "@/components/customers/customer-form-modal";
import { AdjustCreditModal } from "@/components/customers/adjust-credit-modal";
import { ArchiveEntityModal } from "@/components/common/archive-entity-modal";
import { ContactInfoCard } from "@/components/common/contact-info-card";
import { EntityHeaderCard } from "@/components/common/entity-header-card";
import { InvoiceHistoryCard } from "@/components/common/invoice-history-card";
import { StatCard } from "@/components/ui/statcard";
import {
  useCustomers,
  useCustomerDetail,
  useCustomerSalesHistory,
} from "@/hooks/use-customer";
import { formatMonthYear, formatNaira } from "@/lib/format";
import { CreditCard } from "lucide-react";
import { SecondaryButton } from "@/components/button";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // Primary live fetch for this customer
  const {
    customer: liveCustomer,
    isLoading: isCustomerLoading,
    isError: isCustomerError,
  } = useCustomerDetail(id);

  // Live sales history from the backend
  const {
    sales,
    isLoading: _isSalesLoading,
  } = useCustomerSalesHistory(id);

  const { updateCustomer, archiveCustomer, adjustCredit } = useCustomers();

  const [editing, setEditing] = useState(false);
  const [adjustingCredit, setAdjustingCredit] = useState(false);
  const [archiving, setArchiving] = useState(false);

  if (isCustomerLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-6 text-sm text-gray-500">
        Loading customer details...
      </div>
    );
  }

  if (isCustomerError || !liveCustomer || liveCustomer.archived) {
    return (
      <div className="p-6 text-sm text-gray-600">
        Customer not found or has been deactivated.{" "}
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
    <div className="min-w-0 space-y-6">
      <div className="relative">
        <EntityHeaderCard
          name={liveCustomer.name}
          meta={`${liveCustomer.type} • ${liveCustomer.code}`}
          since={`Customer since ${formatMonthYear(liveCustomer.since)}`}
          onArchive={() => setArchiving(true)}
          onEdit={() => setEditing(true)}
        />
        <div className="mt-3 flex justify-end gap-2">
          <SecondaryButton
            type="button"
            onClick={() => setAdjustingCredit(true)}
          >
            <span className="flex items-center gap-1.5 text-xs">
              <CreditCard size={14} />
              Adjust Credit Policy
            </span>
          </SecondaryButton>
        </div>
      </div>

      <div>
        <span className="inline-block rounded-md bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
          Overview
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Sales"
          value={formatNaira(liveCustomer.totalSales)}
        />
        <StatCard
          label="Amount Paid"
          value={formatNaira(
            Math.max(0, liveCustomer.totalSales - liveCustomer.outstanding),
          )}
        />
        <StatCard
          label="Outstanding"
          value={formatNaira(liveCustomer.outstanding)}
        />
        <StatCard
          label="Credit Limit"
          value={
            liveCustomer.creditLimit === null
              ? "No Limit"
              : formatNaira(liveCustomer.creditLimit)
          }
        />
      </div>

      <ContactInfoCard
        rows={[
          {
            label: "Contact Person / Company",
            value: liveCustomer.contactPerson || "--",
          },
          { label: "Email", value: liveCustomer.email || "--" },
          { label: "Phone Number", value: liveCustomer.phone || "--" },
          { label: "Address", value: liveCustomer.address || "--" },
          {
            label: "Payment Terms",
            value: liveCustomer.paymentTermsDays
              ? `${liveCustomer.paymentTermsDays} days`
              : "Net 0 (Immediate)",
          },
        ]}
      />

      {/* Real Sales History from backend */}
      <InvoiceHistoryCard
        title="Sales History"
        records={sales}
        onView={() => {}}
      />

      <CustomerFormModal
        open={editing}
        customer={liveCustomer}
        onClose={() => setEditing(false)}
        onSubmit={async (input) => {
          await updateCustomer(liveCustomer.id, input);
          setEditing(false);
        }}
      />

      <AdjustCreditModal
        open={adjustingCredit}
        customer={liveCustomer}
        onClose={() => setAdjustingCredit(false)}
        onSubmit={async (input) => {
          await adjustCredit(liveCustomer.id, input);
          setAdjustingCredit(false);
        }}
      />

      <ArchiveEntityModal
        entityLabel="Customer"
        entity={archiving ? liveCustomer : null}
        onClose={() => setArchiving(false)}
        onConfirm={async (cid) => {
          await archiveCustomer(cid);
          router.push("/people/customers");
        }}
      />
    </div>
  );
}
