export const customersEndpoints = {
  /** GET = paginated list, POST = create */
  list: (organizationId: string) =>
    `/api/organizations/${organizationId}/customers/`,

  /** GET = retrieve, PUT = update, PATCH = partial update, DELETE = delete/soft-deactivate */
  detail: (organizationId: string, id: string | number) =>
    `/api/organizations/${organizationId}/customers/${id}/`,

  /** POST = adjust customer credit policy */
  adjustCredit: (organizationId: string, id: string | number) =>
    `/api/organizations/${organizationId}/customers/${id}/adjust_credit/`,

  /** GET = customer sales history */
  sales: (organizationId: string, id: string | number) =>
    `/api/organizations/${organizationId}/customers/${id}/sales/`,
} as const;
