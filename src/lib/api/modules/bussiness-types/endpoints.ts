export const businessTypesEndpoints = {
  list: "/api/business-type/",
  detail: (code: string) => `/api/business-type/${code}/`,
} as const;
