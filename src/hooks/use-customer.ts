"use client";

import { useCallback, useMemo } from "react";
import {
  useCustomersList,
  useCustomer as useApiCustomerDetail,
  useCreateCustomer,
  useUpdateCustomer,
  usePatchCustomer,
  useDeleteCustomer,
  useAdjustCustomerCredit,
  useCustomerSales,
  type ApiCustomer,
  type CreateCustomerPayload,
  type CustomerSaleRecord,
} from "@/lib/api/modules/customers";
import { useCurrentOrganization } from "@/lib/api/modules/organizations";
import type { Customer, CustomerInput, AdjustCreditInput } from "@/types/customer";
import type { InvoiceRecord, InvoiceStatus } from "@/features/sales/types";

export function apiCustomerToCustomer(api: ApiCustomer): Customer {
  const primaryAddress = api.addresses?.[0];
  const formattedAddress = primaryAddress
    ? [primaryAddress.street, primaryAddress.city, primaryAddress.state]
        .filter(Boolean)
        .join(", ")
    : "";

  const creditNum = api.credit_limit ? parseFloat(api.credit_limit) : 0;
  const balanceNum = api.balance ? parseFloat(api.balance) : 0;

  return {
    id: api.id,
    code: api.tax_id || `CUS-${api.id.slice(0, 6).toUpperCase()}`,
    name: api.name,
    type: api.customer_type === "business" ? "Business" : "Individual",
    contactPerson: api.company_name || "",
    email: api.email || "",
    phone: api.phone || "",
    address: formattedAddress,
    creditLimit: Number.isNaN(creditNum) || creditNum === 0 ? null : creditNum,
    paymentTermsDays: api.payment_terms_days ?? 0,
    notes: api.notes || "",
    branch: primaryAddress?.city || "Main",
    totalSales: 0,
    outstanding: Number.isNaN(balanceNum) ? 0 : balanceNum,
    since: api.created_at,
    archived: api.status === "inactive" || api.status === "blocked",
    sales: [],
  };
}

export function customerInputToPayload(input: CustomerInput): CreateCustomerPayload {
  const isBusiness = input.type === "Business";
  const limit = input.creditLimit !== null ? input.creditLimit.toFixed(2) : "0.00";

  return {
    name: input.name.trim(),
    customer_type: isBusiness ? "business" : "individual",
    company_name: isBusiness ? input.contactPerson.trim() : undefined,
    email: input.email.trim() || undefined,
    phone: input.phone.trim() || undefined,
    credit_limit: limit,
    notes: input.notes.trim() || undefined,
    addresses: input.address.trim()
      ? [
          {
            street: input.address.trim(),
            is_default: true,
          },
        ]
      : undefined,
  };
}

export function customerSaleToInvoiceRecord(sale: CustomerSaleRecord): InvoiceRecord {
  const amountNum = typeof sale.amount === "number" ? sale.amount : parseFloat(String(sale.amount) || "0");
  return {
    id: sale.id,
    date: sale.date,
    invoiceNo: sale.invoice_no || `INV-${sale.id.slice(0, 8).toUpperCase()}`,
    amount: Number.isNaN(amountNum) ? 0 : amountNum,
    status: (sale.status as InvoiceStatus) || "completed",
  };
}

export function useCustomers() {
  const { organizationId, hasToken, isLoading: isOrgLoading } = useCurrentOrganization();

  const {
    items: apiCustomers,
    isLoading: isCustomersLoading,
    isError,
    error,
    refetch,
    pagination,
  } = useCustomersList(organizationId);

  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
  const patchCustomerMutation = usePatchCustomer();
  const deleteCustomerMutation = useDeleteCustomer();
  const adjustCreditMutation = useAdjustCustomerCredit();

  const customers = useMemo(() => {
    return apiCustomers.map(apiCustomerToCustomer);
  }, [apiCustomers]);

  const addCustomer = useCallback(
    async (input: CustomerInput) => {
      if (!organizationId) throw new Error("No organization selected");
      const payload = customerInputToPayload(input);
      const created = await createCustomerMutation.mutateAsync({
        organizationId,
        data: payload,
      });
      return apiCustomerToCustomer(created);
    },
    [organizationId, createCustomerMutation],
  );

  const updateCustomer = useCallback(
    async (id: string, input: CustomerInput) => {
      if (!organizationId) throw new Error("No organization selected");
      const payload = customerInputToPayload(input);
      const updated = await updateCustomerMutation.mutateAsync({
        organizationId,
        id,
        data: payload,
      });
      return apiCustomerToCustomer(updated);
    },
    [organizationId, updateCustomerMutation],
  );

  const patchCustomer = useCallback(
    async (id: string, partial: Partial<CustomerInput>) => {
      if (!organizationId) throw new Error("No organization selected");
      const data: Partial<CreateCustomerPayload> = {
        ...(partial.name ? { name: partial.name } : {}),
        ...(partial.type ? { customer_type: partial.type === "Business" ? "business" : "individual" } : {}),
        ...(partial.contactPerson ? { company_name: partial.contactPerson } : {}),
        ...(partial.email !== undefined ? { email: partial.email } : {}),
        ...(partial.phone !== undefined ? { phone: partial.phone } : {}),
        ...(partial.creditLimit !== undefined
          ? { credit_limit: partial.creditLimit !== null ? partial.creditLimit.toFixed(2) : "0.00" }
          : {}),
        ...(partial.notes !== undefined ? { notes: partial.notes } : {}),
      };
      const patched = await patchCustomerMutation.mutateAsync({
        organizationId,
        id,
        data,
      });
      return apiCustomerToCustomer(patched);
    },
    [organizationId, patchCustomerMutation],
  );

  const archiveCustomer = useCallback(
    async (id: string) => {
      if (!organizationId) throw new Error("No organization selected");
      await deleteCustomerMutation.mutateAsync({
        organizationId,
        id,
      });
    },
    [organizationId, deleteCustomerMutation],
  );

  const adjustCredit = useCallback(
    async (id: string, input: AdjustCreditInput) => {
      if (!organizationId) throw new Error("No organization selected");
      const adjusted = await adjustCreditMutation.mutateAsync({
        organizationId,
        id,
        data: {
          credit_limit: input.creditLimit.toFixed(2),
          payment_terms_days: input.paymentTermsDays,
          reason: input.reason,
        },
      });
      return apiCustomerToCustomer(adjusted);
    },
    [organizationId, adjustCreditMutation],
  );

  const getCustomer = useCallback(
    (id: string) => customers.find((c) => c.id === id),
    [customers],
  );

  return {
    organizationId,
    hasToken,
    customers: customers.filter((c) => !c.archived),
    allCustomers: customers,
    isLoading: isOrgLoading || (Boolean(organizationId) && isCustomersLoading),
    isError,
    error,
    refetch,
    pagination,
    getCustomer,
    addCustomer,
    updateCustomer,
    patchCustomer,
    archiveCustomer,
    adjustCredit,
  };
}

/** Hook to fetch a single customer directly by ID from the API with live cache */
export function useCustomerDetail(id: string | undefined) {
  const { organizationId } = useCurrentOrganization();
  const query = useApiCustomerDetail(organizationId, id);

  const customer = useMemo(() => {
    return query.data ? apiCustomerToCustomer(query.data) : null;
  }, [query.data]);

  return {
    ...query,
    customer,
    organizationId,
  };
}

/** Hook to fetch sales history for a specific customer */
export function useCustomerSalesHistory(id: string | undefined) {
  const { organizationId } = useCurrentOrganization();
  const query = useCustomerSales(organizationId, id);

  const sales = useMemo<InvoiceRecord[]>(() => {
    const results = query.data?.results ?? [];
    return results.map(customerSaleToInvoiceRecord);
  }, [query.data]);

  return {
    ...query,
    sales,
    organizationId,
  };
}
