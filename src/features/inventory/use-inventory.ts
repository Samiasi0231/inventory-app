"use client";

import { useCallback, useEffect, useState } from "react";
import type { Paginated } from "@/types/shared";
import { inventoryService } from "./inventory.service";
import type { InventoryItem, InventoryListParams, InventorySummary } from "./types";

/** Server-state hooks for Inventory: fetch, loading and error only. */

interface Resolved<T> {
  /** The request this result belongs to. */
  key: string;
  data: T | undefined;
  error: string | null;
}

export function useInventoryList(params: InventoryListParams) {
  const [reloadToken, setReloadToken] = useState(0);
  // Params are a fresh object each render, so key the request on its value.
  const requestKey = `${JSON.stringify(params)}::${reloadToken}`;

  const [result, setResult] = useState<Resolved<Paginated<InventoryItem>>>({
    key: "",
    data: undefined,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    inventoryService
      .listItems(params)
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data, error: null });
      })
      .catch(() => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            data: undefined,
            error: "We couldn't load your products. Please try again.",
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

export function useInventorySummary(branchId?: string) {
  const [reloadToken, setReloadToken] = useState(0);
  const requestKey = `${branchId ?? ""}::${reloadToken}`;

  const [result, setResult] = useState<Resolved<InventorySummary>>({
    key: "",
    data: undefined,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    inventoryService
      .getSummary({ branchId })
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data, error: null });
      })
      .catch(() => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            data: undefined,
            error: "We couldn't load your stock summary.",
          });
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
