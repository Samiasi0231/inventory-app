import type { AxiosRequestConfig } from "axios";
import { fetcher, type PaginatedResponse } from "../../core";
import { organizationsEndpoints } from "./endpoints";
import type { CreateOrganizationPayload, Organization } from "./types";

export const organizationsService = {
  /** GET /api/organizations/ — List organizations the user belongs to */
  list(config?: AxiosRequestConfig) {
    return fetcher.get<PaginatedResponse<Organization>>(
      organizationsEndpoints.list,
      config,
    );
  },

  /** GET /api/organizations/{id}/ — Retrieve organization details */
  retrieve(id: string, config?: AxiosRequestConfig) {
    return fetcher.get<Organization>(
      `${organizationsEndpoints.list}${id}/`,
      config,
    );
  },

  /** The caller becomes the Owner. One transaction: no half-created organization can exist. */
  create(payload: CreateOrganizationPayload, config?: AxiosRequestConfig) {
    return fetcher.post<Organization, CreateOrganizationPayload>(
      organizationsEndpoints.list,
      payload,
      config,
    );
  },
};
