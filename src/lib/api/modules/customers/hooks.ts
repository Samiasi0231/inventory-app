"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import {
  useApiQuery,
  usePaginatedQuery,
  type ApiError,
} from "../../core";
import { customersEndpoints } from "./endpoints";
import { customersKeys } from "./keys";
import { customersService } from "./service";
import type {
  AdjustCreditPayload,
  AdjustCreditResponse,
  ApiCustomer,
  CreateCustomerPayload,
  CustomerSaleRecord,
  CustomersListParams,
  PatchCustomerPayload,
  UpdateCustomerPayload,
} from "./types";
import type { PaginatedResponse } from "../../core";

// ─── List ─────────────────────────────────────────────────────────────────────

/** GET /api/organizations/{organization_id}/customers/ — List all Customers */
export function useCustomersList(
  organizationId: string,
  params: CustomersListParams = {},
) {
  return usePaginatedQuery<ApiCustomer>({
    queryKey: customersKeys.list(organizationId, params),
    url: organizationId ? customersEndpoints.list(organizationId) : "",
    params,
    options: {
      enabled: Boolean(organizationId),
    },
  });
}

// ─── Retrieve ─────────────────────────────────────────────────────────────────

/** GET /api/organizations/{organization_id}/customers/{id}/ — Retrieve Customer Details */
export function useCustomer(
  organizationId: string,
  id: string | number | undefined,
) {
  return useApiQuery<ApiCustomer>({
    queryKey: customersKeys.detail(organizationId, id ?? ""),
    url: organizationId && id ? customersEndpoints.detail(organizationId, id) : "",
    options: {
      enabled: Boolean(organizationId) && id !== undefined && id !== "",
    },
  });
}

// ─── Create ───────────────────────────────────────────────────────────────────

interface CreateCustomerVariables {
  organizationId: string;
  data: CreateCustomerPayload;
}

/** POST /api/organizations/{organization_id}/customers/ — Create a Customer */
export function useCreateCustomer(
  options?: Omit<
    UseMutationOptions<ApiCustomer, ApiError, CreateCustomerVariables>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  type SuccessArgs = Parameters<
    NonNullable<
      UseMutationOptions<ApiCustomer, ApiError, CreateCustomerVariables>["onSuccess"]
    >
  >;

  return useMutation<ApiCustomer, ApiError, CreateCustomerVariables>({
    ...options,
    mutationFn: ({ organizationId, data }) =>
      customersService.create(organizationId, data),
    onSuccess: async (...args: SuccessArgs) => {
      const [, variables] = args;
      await queryClient.invalidateQueries({
        queryKey: customersKeys.lists(),
      });
      await options?.onSuccess?.(...args);
      void variables; // suppress unused-var
    },
  });
}

// ─── Update (PUT) ─────────────────────────────────────────────────────────────

interface UpdateCustomerVariables {
  organizationId: string;
  id: string | number;
  data: UpdateCustomerPayload;
}

/** PUT /api/organizations/{organization_id}/customers/{id}/ — Update a Customer */
export function useUpdateCustomer(
  options?: Omit<
    UseMutationOptions<ApiCustomer, ApiError, UpdateCustomerVariables>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  type SuccessArgs = Parameters<
    NonNullable<
      UseMutationOptions<ApiCustomer, ApiError, UpdateCustomerVariables>["onSuccess"]
    >
  >;

  return useMutation<ApiCustomer, ApiError, UpdateCustomerVariables>({
    ...options,
    mutationFn: ({ organizationId, id, data }) =>
      customersService.update(organizationId, id, data),
    onSuccess: async (...args: SuccessArgs) => {
      const [customer, variables] = args;
      queryClient.setQueryData(
        customersKeys.detail(variables.organizationId, customer.id),
        customer,
      );
      await queryClient.invalidateQueries({ queryKey: customersKeys.lists() });
      await options?.onSuccess?.(...args);
    },
  });
}

// ─── Partial Update (PATCH) ───────────────────────────────────────────────────

interface PatchCustomerVariables {
  organizationId: string;
  id: string | number;
  data: PatchCustomerPayload;
}

/** PATCH /api/organizations/{organization_id}/customers/{id}/ — Partial Update Customer */
export function usePatchCustomer(
  options?: Omit<
    UseMutationOptions<ApiCustomer, ApiError, PatchCustomerVariables>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  type SuccessArgs = Parameters<
    NonNullable<
      UseMutationOptions<ApiCustomer, ApiError, PatchCustomerVariables>["onSuccess"]
    >
  >;

  return useMutation<ApiCustomer, ApiError, PatchCustomerVariables>({
    ...options,
    mutationFn: ({ organizationId, id, data }) =>
      customersService.patch(organizationId, id, data),
    onSuccess: async (...args: SuccessArgs) => {
      const [customer, variables] = args;
      queryClient.setQueryData(
        customersKeys.detail(variables.organizationId, customer.id),
        customer,
      );
      await queryClient.invalidateQueries({ queryKey: customersKeys.lists() });
      await options?.onSuccess?.(...args);
    },
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

interface DeleteCustomerVariables {
  organizationId: string;
  id: string | number;
}

/** DELETE /api/organizations/{organization_id}/customers/{id}/ — Delete or Soft-Deactivate Customer */
export function useDeleteCustomer(
  options?: Omit<
    UseMutationOptions<void, ApiError, DeleteCustomerVariables>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  type SuccessArgs = Parameters<
    NonNullable<
      UseMutationOptions<void, ApiError, DeleteCustomerVariables>["onSuccess"]
    >
  >;

  return useMutation<void, ApiError, DeleteCustomerVariables>({
    ...options,
    mutationFn: ({ organizationId, id }) =>
      customersService.delete(organizationId, id),
    onSuccess: async (...args: SuccessArgs) => {
      const [, variables] = args;
      queryClient.removeQueries({
        queryKey: customersKeys.detail(variables.organizationId, variables.id),
      });
      await queryClient.invalidateQueries({ queryKey: customersKeys.lists() });
      await options?.onSuccess?.(...args);
    },
  });
}

// ─── Adjust Credit ────────────────────────────────────────────────────────────

interface AdjustCreditVariables {
  organizationId: string;
  id: string | number;
  data: AdjustCreditPayload;
}

/** POST /api/organizations/{organization_id}/customers/{id}/adjust_credit/ — Adjust Customer Credit Policy */
export function useAdjustCustomerCredit(
  options?: Omit<
    UseMutationOptions<ApiCustomer, ApiError, AdjustCreditVariables>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  type SuccessArgs = Parameters<
    NonNullable<
      UseMutationOptions<ApiCustomer, ApiError, AdjustCreditVariables>["onSuccess"]
    >
  >;

  return useMutation<ApiCustomer, ApiError, AdjustCreditVariables>({
    ...options,
    mutationFn: ({ organizationId, id, data }) =>
      customersService.adjustCredit(organizationId, id, data),
    onSuccess: async (...args: SuccessArgs) => {
      const [customer, variables] = args;
      queryClient.setQueryData(
        customersKeys.detail(variables.organizationId, customer.id),
        customer,
      );
      await queryClient.invalidateQueries({
        queryKey: customersKeys.detail(variables.organizationId, variables.id),
      });
      await queryClient.invalidateQueries({
        queryKey: customersKeys.lists(),
      });
      await options?.onSuccess?.(...args);
    },
  });
}

// ─── Sales History ────────────────────────────────────────────────────────────

/** GET /api/organizations/{organization_id}/customers/{id}/sales/ — Customer Sales History */
export function useCustomerSales(
  organizationId: string,
  id: string | number | undefined,
  params?: { page?: number; page_size?: number },
) {
  return useApiQuery<PaginatedResponse<CustomerSaleRecord>>({
    queryKey: customersKeys.sales(organizationId, id ?? ""),
    url: organizationId && id ? customersEndpoints.sales(organizationId, id) : "",
    params,
    options: {
      enabled: Boolean(organizationId) && id !== undefined && id !== "",
    },
  });
}
