/**
 * Entities shared across domains.
 *
 * Ids are strings, money is in major units (naira, not kobo) and timestamps are
 * ISO-8601 strings.
 */

export type ID = string;

/** ISO-8601, e.g. "2026-10-07T09:30:00.000Z". */
export type ISODateString = string;

export interface Category {
  id: ID;
  name: string;
  parentId?: ID | null;
}

export interface Brand {
  id: ID;
  name: string;
}

/** A physical location that holds stock. */
export interface Branch {
  id: ID;
  name: string;
}

/** A unit of measure. */
export interface Unit {
  id: ID;
  name: string;
  /** Short form shown in dense UI, e.g. "pcs". */
  abbreviation?: string;
}

export interface TaxScheme {
  id: ID;
  name: string;
  /** Percentage, e.g. 7.5 for "Standard VAT (7.5%)". */
  rate: number;
}

export interface Supplier {
  id: ID;
  name: string;
}

export type UserRole = "owner" | "manager" | "inventory_manager" | "staff";

export interface User {
  id: ID;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
}

export type ProductType = "physical" | "service";

export interface ProductVariant {
  id: ID;
  /** Human label built from the option values, e.g. "Large / Milk". */
  name: string;
  sku: string;
  barcode?: string;
  costPrice: number;
  sellingPrice: number;
}

/** Catalog product. */
export interface Product {
  id: ID;
  name: string;
  type: ProductType;
  sku: string;
  barcode?: string;
  categoryId: ID;
  brandId?: ID | null;
  imageUrl?: string | null;
  baseUnitId: ID;
  taxSchemeId?: ID | null;
  variants: ProductVariant[];
  createdAt: ISODateString;
}

/* -- Collection conventions ------------------------------------------------ */

/** Envelope returned by list endpoints. */
export interface Paginated<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export type SortDirection = "asc" | "desc";

export interface ListParams {
  page?: number;
  pageSize?: number;
  /** Free-text search. */
  search?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
}
