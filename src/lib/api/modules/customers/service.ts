import type { AxiosRequestConfig } from "axios";
import { fetcher, type PaginatedResponse } from "../../core";
import { customersEndpoints } from "./endpoints";
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

export const customersService = {
  /** GET /api/organizations/{organization_id}/customers/ — List all Customers */
  list(
    organizationId: string,
    params?: CustomersListParams,
    config?: AxiosRequestConfig,
  ) {
    return fetcher.get<PaginatedResponse<ApiCustomer>>(
      customersEndpoints.list(organizationId),
      { ...config, params },
    );
  },

  /** POST /api/organizations/{organization_id}/customers/ — Create a Customer */
  create(
    organizationId: string,
    payload: CreateCustomerPayload,
    config?: AxiosRequestConfig,
  ) {
    return fetcher.post<ApiCustomer, CreateCustomerPayload>(
      customersEndpoints.list(organizationId),
      payload,
      config,
    );
  },

  /** GET /api/organizations/{organization_id}/customers/{id}/ — Retrieve Customer Details */
  retrieve(
    organizationId: string,
    id: string | number,
    config?: AxiosRequestConfig,
  ) {
    return fetcher.get<ApiCustomer>(
      customersEndpoints.detail(organizationId, id),
      config,
    );
  },

  /** PUT /api/organizations/{organization_id}/customers/{id}/ — Update a Customer */
  update(
    organizationId: string,
    id: string | number,
    payload: UpdateCustomerPayload,
    config?: AxiosRequestConfig,
  ) {
    return fetcher.put<ApiCustomer, UpdateCustomerPayload>(
      customersEndpoints.detail(organizationId, id),
      payload,
      config,
    );
  },

  /** PATCH /api/organizations/{organization_id}/customers/{id}/ — Partial Update Customer */
  patch(
    organizationId: string,
    id: string | number,
    payload: PatchCustomerPayload,
    config?: AxiosRequestConfig,
  ) {
    return fetcher.patch<ApiCustomer, PatchCustomerPayload>(
      customersEndpoints.detail(organizationId, id),
      payload,
      config,
    );
  },

  /** DELETE /api/organizations/{organization_id}/customers/{id}/ — Delete or Soft-Deactivate Customer */
  delete(
    organizationId: string,
    id: string | number,
    config?: AxiosRequestConfig,
  ) {
    return fetcher.delete<void>(
      customersEndpoints.detail(organizationId, id),
      config,
    );
  },

  /** POST /api/organizations/{organization_id}/customers/{id}/adjust_credit/ — Adjust Customer Credit Policy */
  adjustCredit(
    organizationId: string,
    id: string | number,
    payload: AdjustCreditPayload,
    config?: AxiosRequestConfig,
  ) {
    return fetcher.post<ApiCustomer, AdjustCreditPayload>(
      customersEndpoints.adjustCredit(organizationId, id),
      payload,
      config,
    );
  },

  /** GET /api/organizations/{organization_id}/customers/{id}/sales/ — Customer Sales History */
  getSales(
    organizationId: string,
    id: string | number,
    params?: { page?: number; page_size?: number },
    config?: AxiosRequestConfig,
  ) {
    return fetcher.get<PaginatedResponse<CustomerSaleRecord>>(
      customersEndpoints.sales(organizationId, id),
      { ...config, params },
    );
  },
};
