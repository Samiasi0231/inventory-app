const root = ["organizations"] as const;

export const organizationsKeys = {
  all: root,
  lists: () => [...root, "list"] as const,
  detail: (id: string) => [...root, "detail", id] as const,
};
