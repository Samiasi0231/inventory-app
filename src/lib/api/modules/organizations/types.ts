/** POST /api/organizations/ — the two onboarding screens submitted together. */
export interface CreateOrganizationPayload {
  /** Business type `code` from GET /api/business-type/?context=onboarding, e.g. "retail". */
  business_type: string;
  name: string;
  registration_number?: string;
  /** ISO country code, e.g. "NG". Fixed after creation. */
  country: string;
  /** Must match one of the states listed for the country (when the list is not empty). */
  state: string;
  address: string;
  postal_code?: string;
  tax_id?: string;
  /** ISO currency code, e.g. "NGN". Fixed after creation, so it must be right the first time. */
  currency: string;
  /** e.g. "1-5", "6-10". Must match the backend's allowed values. */
  staff_size: string;
  /** Optional; normalised to international format using the organization's country. */
  phone?: string;
}

export interface OrganizationBusinessType {
  id: string;
  code: string;
  name: string;
  is_primary: boolean;
}

export interface OrganizationPlan {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
}

export interface Organization {
  id: string;
  name: string;
  legal_name: string;
  business_types: OrganizationBusinessType[];
  primary_business_type: string;
  registration_number: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  staff_size: string;
  country: string;
  currency: string;
  timezone: string;
  domain: string;
  logo: string;
  plan: OrganizationPlan;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}