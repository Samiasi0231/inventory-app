import { authEndpoints } from "./modules/auth/endpoints";
import { businessTypesEndpoints } from "./modules/bussiness-types/endpoints";
import { usersEndpoints } from "./modules/users/endpoints";
import { organizationsEndpoints } from "./modules/organizations/endpoints";
import { customersEndpoints } from "./modules/customers/endpoints";
/**
 * One-glance view of every backend path. Each module owns its own paths;
 * this only collects them.
 *
 * Still needed from the backend:
 *   forgot-password request (the "send me a code" step before reset_password_confirm),
 *   google sign-in, users/me, onboarding business details
 */
export const ENDPOINTS = {
  auth: authEndpoints,
  users: usersEndpoints,
  businessTypes: businessTypesEndpoints,
  organizations: organizationsEndpoints,
  customers: customersEndpoints,
} as const;
