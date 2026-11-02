/**
 * Also in the backend docs, not wired yet:
 *   PUT   /api/organizations/{id}/business-types/   add more business types later
 *   PATCH /api/organizations/{id}/                   branding and templates
 */
export const organizationsEndpoints = {
  /** POST = create an organization (onboarding) */
  list: "/api/organizations/",
} as const;