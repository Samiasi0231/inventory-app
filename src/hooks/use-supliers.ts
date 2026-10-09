// "use client";

// import { useCallback, useSyncExternalStore } from "react";
// import { MOCK_SUPPLIERS } from "@/lib/supplier-mock-data";
// import { createListStore, wait } from "@/lib/mock-api";
// import type { Supplier, SupplierInput } from "@/types/suppliers";

// // Swap this file's internals for your API client / TanStack Query later; the return shape can stay.
// const store = createListStore<Supplier>(MOCK_SUPPLIERS);

// export function useSuppliers() {
//   const all = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);

//   const addSupplier = useCallback(async (input: SupplierInput) => {
//     await wait();
//     const current = store.getSnapshot();
//     const created: Supplier = {
//       ...input,
//       id: crypto.randomUUID(),
//       code: `SUP-${String(current.length + 1).padStart(3, "0")}`,
//       branch: "Port Harcourt",
//       totalPurchases: 0,
//       outstanding: 0,
//       since: new Date().toISOString(),
//       archived: false,
//       purchases: [],
//     };
//     store.set([created, ...current]);
//   }, []);

//   const updateSupplier = useCallback(async (id: string, input: SupplierInput) => {
//     await wait();
//     store.set(store.getSnapshot().map((s) => (s.id === id ? { ...s, ...input } : s)));
//   }, []);

//   const archiveSupplier = useCallback(async (id: string) => {
//     await wait();
//     store.set(store.getSnapshot().map((s) => (s.id === id ? { ...s, archived: true } : s)));
//   }, []);

//   const getSupplier = useCallback((id: string) => all.find((s) => s.id === id), [all]);

//   return { suppliers: all.filter((s) => !s.archived), getSupplier, addSupplier, updateSupplier, archiveSupplier };
// }