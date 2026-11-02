"use client";

import { useApiQuery } from "../../core";
import { businessTypesEndpoints } from "./endpoints";
import { businessTypesKeys } from "./keys";
import type { BusinessType, BusinessTypeContext } from "./types";

const CATALOG_STALE_TIME = 10 * 60_000; // the catalog rarely changes

/** Pass "onboarding" for the onboarding cards; omit for every active type. */
export function useBusinessTypes(context?: BusinessTypeContext) {
  return useApiQuery<BusinessType[]>({
    queryKey: businessTypesKeys.list(context),
    url: businessTypesEndpoints.list,
    params: context ? { context } : undefined,
    options: { staleTime: CATALOG_STALE_TIME },
  });
}

export function useBusinessType(code: string | undefined) {
  return useApiQuery<BusinessType>({
    queryKey: businessTypesKeys.detail(code ?? ""),
    url: businessTypesEndpoints.detail(code ?? ""),
    options: { enabled: Boolean(code), staleTime: CATALOG_STALE_TIME },
  });
}
