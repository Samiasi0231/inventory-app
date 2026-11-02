"use client";

import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import type { ApiError } from "../errors";
import { fetcher } from "../fetcher";
import type { QueryParams } from "../types";

interface UseApiQueryArgs<TData, TSelected> {
  queryKey: QueryKey;
  url: string;
  params?: QueryParams;
  config?: AxiosRequestConfig;
  options?: Omit<
    UseQueryOptions<TData, ApiError, TSelected, QueryKey>,
    "queryKey" | "queryFn"
  >;
}

/** Generic GET hook for any endpoint. */
export function useApiQuery<TData, TSelected = TData>({
  queryKey,
  url,
  params,
  config,
  options,
}: UseApiQueryArgs<TData, TSelected>) {
  return useQuery<TData, ApiError, TSelected, QueryKey>({
    queryKey,
    queryFn: ({ signal }) =>
      fetcher.get<TData>(url, { ...config, params, signal }),
    ...options,
  });
}
