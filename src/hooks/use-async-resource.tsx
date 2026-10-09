"use client";

import { useCallback, useEffect, useState } from "react";

interface Resolved<T> {
  /** The request this result belongs to. */
  key: string;
  data: T | undefined;
  error: string | null;
}

/**
 * Loads an async resource and derives `loading` by comparing the resolved
 * request against the current one, so nothing has to be set during the effect.
 *
 * `key` must serialise every input `load` depends on.
 */
export function useAsyncResource<T>(key: string, load: () => Promise<T>, errorMessage: string) {
  const [reloadToken, setReloadToken] = useState(0);
  const requestKey = `${key}::${reloadToken}`;

  const [result, setResult] = useState<Resolved<T>>({
    key: "",
    data: undefined,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    load()
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data, error: null });
      })
      .catch(() => {
        if (!cancelled) setResult({ key: requestKey, data: undefined, error: errorMessage });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- requestKey serialises the inputs
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
