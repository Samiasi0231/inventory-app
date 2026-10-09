"use client";

import { useCallback, useSyncExternalStore } from "react";
import { MOCK_CUSTOMERS } from "@/lib/customer-mock-data";
import { createListStore, wait } from "@/lib/mock-api";
import type { Customer, CustomerInput } from "@/types/customer";

// Swap this file's internals for your API client / TanStack Query later; the return shape can stay.
const store = createListStore<Customer>(MOCK_CUSTOMERS);

export function useCustomers() {
  const all = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

  const addCustomer = useCallback(async (input: CustomerInput) => {
    await wait();
    const current = store.getSnapshot();
    const created: Customer = {
      ...input,
      id: crypto.randomUUID(),
      code: `CUS-${String(current.length + 1).padStart(3, "0")}`,
      branch: "Port Harcourt",
      totalSales: 0,
      outstanding: 0,
      since: new Date().toISOString(),
      archived: false,
      sales: [],
    };
    store.set([created, ...current]);
  }, []);

  const updateCustomer = useCallback(async (id: string, input: CustomerInput) => {
    await wait();
    store.set(store.getSnapshot().map((c) => (c.id === id ? { ...c, ...input } : c)));
  }, []);

  const archiveCustomer = useCallback(async (id: string) => {
    await wait();
    store.set(store.getSnapshot().map((c) => (c.id === id ? { ...c, archived: true } : c)));
  }, []);

  const getCustomer = useCallback((id: string) => all.find((c) => c.id === id), [all]);

  return { customers: all.filter((c) => !c.archived), getCustomer, addCustomer, updateCustomer, archiveCustomer };
}