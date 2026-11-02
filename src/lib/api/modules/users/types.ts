import type { PaginationParams } from "../../core";

export interface User {
  id: number;
  name: string;
  is_active: boolean;
  email: string;
}

export interface UsersListParams extends PaginationParams {
  [key: string]: unknown;
}

/** PUT /api/users/{id}/ — email is required, there is no PATCH. */
export interface UpdateUserPayload {
  name?: string;
  is_active?: boolean;
  email: string;
}
