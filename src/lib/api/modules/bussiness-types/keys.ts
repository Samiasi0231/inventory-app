const root = ["business-types"] as const;

export const businessTypesKeys = {
  all: root,
  lists: () => [...root, "list"] as const,
  list: (context?: string) => [...root, "list", context ?? "all"] as const,
  detail: (code: string) => [...root, "detail", code] as const,
};
