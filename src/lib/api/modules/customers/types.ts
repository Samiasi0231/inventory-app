import type { PaginationParams } from "../../core";

// ─── Enums (match backend exactly) ───────────────────────────────────────────

/** `individual` | `business` — lowercase as the API sends them */
export type CustomerTypeEnum = "individual" | "business";

/** Customer lifecycle status */
export type CustomerStatus = "active" | "inactive" | "blocked";

/** Address classification */
export type AddressTypeEnum = "billing" | "shipping" | "other" | string;

// ─── Nested: CustomerAddress (read) ──────────────────────────────────────────

export interface CustomerAddress {
  id: string;
  address_type?: AddressTypeEnum;
  street: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  is_default?: boolean;
  created_at: string;
}

// ─── Nested: CustomerAddressRequest (write) ───────────────────────────────────

export interface CustomerAddressRequest {
  address_type?: AddressTypeEnum;
  street: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  is_default?: boolean;
}

// ─── Customer (read / response) ───────────────────────────────────────────────

/**
 * Full customer record returned by GET list / GET detail / POST / PUT / PATCH.
 * Matches `Customer` schema in the backend OpenAPI spec.
 */
export interface ApiCustomer {
  id: string;
  organization: string;
  customer_type?: CustomerTypeEnum;
  name: string;
  /** Registered legal company name for B2B clients. */
  company_name?: string;
  email?: string;
  phone?: string;
  tax_id?: string;
  /**
   * Decimal string from the backend, e.g. "5000.00".
   * Parse with parseFloat() when you need arithmetic.
   */
  credit_limit?: string;
  /** Current outstanding receivable balance; read-only computed field. */
  balance: string;
  payment_terms_days?: number;
  status?: CustomerStatus;
  notes?: string | null;
  metadata?: unknown;
  addresses: CustomerAddress[];
  created_at: string;
  updated_at: string;
}

// ─── Paginated list wrapper ───────────────────────────────────────────────────

export interface PaginatedCustomerList {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiCustomer[];
}

// ─── List params ─────────────────────────────────────────────────────────────

export interface CustomersListParams extends PaginationParams {
  search?: string;
  customer_type?: CustomerTypeEnum;
  status?: CustomerStatus;
  [key: string]: unknown;
}

// ─── Create / Update payload (POST + PUT) ────────────────────────────────────

/**
 * Body for POST /api/organizations/{organization_id}/customers/
 * and PUT /api/organizations/{organization_id}/customers/{id}/
 *
 * Matches `CustomerCreateRequest` schema. Only `name` is required.
 */
export interface CreateCustomerPayload {
  name: string;
  customer_type?: CustomerTypeEnum;
  company_name?: string;
  email?: string;
  phone?: string;
  tax_id?: string;
  /** Decimal string, e.g. "5000.00". Defaults to "0.00". */
  credit_limit?: string;
  payment_terms_days?: number;
  status?: CustomerStatus;
  notes?: string | null;
  metadata?: unknown;
  addresses?: CustomerAddressRequest[];
}

/** Alias — PUT uses the same shape as POST */
export type UpdateCustomerPayload = CreateCustomerPayload;

// ─── Partial Update (PATCH) ───────────────────────────────────────────────────

/**
 * Body for PATCH /api/organizations/{organization_id}/customers/{id}/
 * Matches `PatchedCustomerCreateRequest` — all fields optional.
 */
export type PatchCustomerPayload = Partial<CreateCustomerPayload>;

// ─── Adjust Credit ────────────────────────────────────────────────────────────

/**
 * Body for POST /api/organizations/{organization_id}/customers/{id}/adjust_credit/
 * Matches `CustomerCreditAdjustmentRequest`.
 *
 * `credit_limit` is required; `payment_terms_days` and `reason` are optional.
 */
export interface AdjustCreditPayload {
  /** Decimal string, e.g. "10000.00". Required. */
  credit_limit: string;
  payment_terms_days?: number;
  /** Audit justification — max 255 chars. */
  reason?: string;
}

export type AdjustCreditResponse = ApiCustomer;

// ─── Customer Sales History ───────────────────────────────────────────────────

/** One record in the GET /customers/{id}/sales/ response. */
export interface CustomerSaleRecord {
  id: string;
  date: string;
  invoice_no?: string;
  amount: number | string;
  status: string;
}
