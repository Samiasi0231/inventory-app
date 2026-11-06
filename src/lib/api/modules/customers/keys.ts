import type { QueryParams } from "../../core";

const root = ["customers"] as const;

export const customersKeys = {
  all: root,
  lists: () => [...root, "list"] as const,
  list: (organizationId: string, params: QueryParams = {}) =>
    [...root, "list", organizationId, params] as const,
  details: () => [...root, "detail"] as const,
  detail: (organizationId: string, id: string | number) =>
    [...root, "detail", organizationId, id] as const,
  sales: (organizationId: string, id: string | number) =>
    [...root, "sales", organizationId, id] as const,
};
