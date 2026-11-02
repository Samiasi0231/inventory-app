"use client";

import {
  keepPreviousData,
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { ApiError } from "../errors";
import { fetcher } from "../fetcher";
import type { PaginatedResponse, PaginationParams, QueryParams } from "../types";

interface UsePaginatedQueryArgs<T> {
  queryKey: QueryKey;
  url: string;
  params?: PaginationParams & QueryParams;
  options?: Omit<
    UseQueryOptions<PaginatedResponse<T>, ApiError>,
    "queryKey" | "queryFn"
  >;
}

/** Generic GET hook for DRF-style paginated list endpoints. */
export function usePaginatedQuery<T>({
  queryKey,
  url,
  params,
  options,
}: UsePaginatedQueryArgs<T>) {
  const query = useQuery<PaginatedResponse<T>, ApiError>({
    queryKey,
    queryFn: ({ signal }) =>
      fetcher.get<PaginatedResponse<T>>(url, { params, signal }),
    placeholderData: keepPreviousData,
    ...options,
  });

  const data = query.data;

  return {
    ...query,
    items: data?.results ?? [],
    pagination: {
      count: data?.count ?? 0,
      totalPages: data?.total_pages ?? 0,
      currentPage: data?.current_page ?? params?.page ?? 1,
      pageSize: data?.page_size ?? params?.page_size ?? 10,
      hasNext: Boolean(data?.next),
      hasPrevious: Boolean(data?.previous),
    },
  };
}
