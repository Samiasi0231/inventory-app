"use client";

import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosRequestConfig } from "axios";
import type { ApiError } from "../errors";
import { request, toFormData } from "../fetcher";

type MutationMethod = "post" | "put" | "patch" | "delete";

interface UseApiMutationArgs<TData, TVariables> {
  /** A string, or a function of the variables (e.g. v => `/api/users/${v.id}/`). */
  url: string | ((variables: TVariables) => string);
  method?: MutationMethod;
  /** Choose what is sent as the body. Defaults to the variables themselves. */
  getBody?: (variables: TVariables) => object | undefined;
  /** Send the body as multipart/form-data. */
  asFormData?: boolean;
  /** Query keys to invalidate after a successful mutation. */
  invalidateKeys?: QueryKey[];
  config?: AxiosRequestConfig;
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables>, "mutationFn">;
}

/** Generic POST/PUT/PATCH/DELETE hook for any endpoint. */
export function useApiMutation<TData = unknown, TVariables = void>({
  url,
  method = "post",
  getBody,
  asFormData = false,
  invalidateKeys = [],
  config,
  options,
}: UseApiMutationArgs<TData, TVariables>) {
  const queryClient = useQueryClient();

  type SuccessArgs = Parameters<
    NonNullable<UseMutationOptions<TData, ApiError, TVariables>["onSuccess"]>
  >;

  return useMutation<TData, ApiError, TVariables>({
    ...options,
    mutationFn: (variables) => {
      const resolvedUrl = typeof url === "function" ? url(variables) : url;

      if (method === "delete") {
        return request<TData>({ ...config, url: resolvedUrl, method });
      }

      const body = getBody
        ? getBody(variables)
        : (variables as unknown as object | undefined);

      return request<TData>({
        ...config,
        url: resolvedUrl,
        method,
        data: asFormData && body ? toFormData(body) : body,
      });
    },
    onSuccess: async (...args: SuccessArgs) => {
      await Promise.all(
        invalidateKeys.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
      );
      await options?.onSuccess?.(...args);
    },
  });
}
