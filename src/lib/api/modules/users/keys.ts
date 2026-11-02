import type { QueryParams } from "../../core";

const root = ["users"] as const;

export const usersKeys = {
  all: root,
  lists: () => [...root, "list"] as const,
  list: (params: QueryParams = {}) => [...root, "list", params] as const,
  detail: (id: number | string) => [...root, "detail", id] as const,
};
