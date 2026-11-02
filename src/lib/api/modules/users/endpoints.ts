export const usersEndpoints = {
  /** GET = paginated list */
  list: "/api/users/",
  /** GET = retrieve, PUT = update */
  detail: (id: number | string) => `/api/users/${id}/`,
} as const;
