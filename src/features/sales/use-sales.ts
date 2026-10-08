"use client";

import { useCallback, useEffect, useState } from "react";
import type { Paginated } from "@/types/shared";
import { salesService } from "./sales.service";
import type {
  Customer,
  Invoice,
  InvoiceListParams,
  InvoiceSummary,
  SellableProduct,
} from "./types";

/** Server-state hooks for Sales: fetch, loading and error only. */

interface Resolved<T> {
  /** The request this result belongs to. */
  key: string;
  data: T | undefined;
  error: string | null;
}

export function useInvoiceList(params: InvoiceListParams) {
  const [reloadToken, setReloadToken] = useState(0);
  // Params are a fresh object each render, so key the request on its value.
  const requestKey = `${JSON.stringify(params)}::${reloadToken}`;

  const [result, setResult] = useState<Resolved<Paginated<Invoice>>>({
    key: "",
    data: undefined,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    salesService
      .listInvoices(params)
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data, error: null });
      })
      .catch(() => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            data: undefined,
            error: "We couldn't load your invoices. Please try again.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- requestKey serialises params
  }, [requestKey]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);
  const loading = result.key !== requestKey;

  return {
    data: loading ? undefined : result.data,
    loading,
    error: loading ? null : result.error,
    refetch,
  };
}

export function useInvoiceSummary(branchId?: string) {
  const [reloadToken, setReloadToken] = useState(0);
  const requestKey = `${branchId ?? ""}::${reloadToken}`;

  const [result, setResult] = useState<Resolved<InvoiceSummary>>({
    key: "",
    data: undefined,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    salesService
      .getInvoiceSummary({ branchId })
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data, error: null });
      })
      .catch(() => {
        if (!cancelled) {
          setResult({ key: requestKey, data: undefined, error: "We couldn't load your totals." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey, branchId]);

  const refetch = useCallback(() => setReloadToken((token) => token + 1), []);
  const loading = result.key !== requestKey;

  return {
    data: loading ? undefined : result.data,
    loading,
    error: loading ? null : result.error,
    refetch,
  };
}

/** Catalog and customers for the sale screen, loaded once per branch. */
export function useSaleCatalog(branchId: string) {
  const [products, setProducts] = useState<SellableProduct[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      salesService.listSellableProducts({ branchId }),
      salesService.listCustomers(),
    ]).then(([nextProducts, nextCustomers]) => {
      if (cancelled) return;
      setProducts(nextProducts);
      setCustomers(nextCustomers);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [branchId]);

  return { products, customers, loading, setCustomers };
}
