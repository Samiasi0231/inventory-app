import type { AxiosRequestConfig } from "axios";
import { fetcher } from "../../core";
import { organizationsEndpoints } from "./endpoints";
import type { CreateOrganizationPayload, Organization } from "./types";

export const organizationsService = {
  /** The caller becomes the Owner. One transaction: no half-created organization can exist. */
  create(payload: CreateOrganizationPayload, config?: AxiosRequestConfig) {
    return fetcher.post<Organization, CreateOrganizationPayload>(
      organizationsEndpoints.list,
      payload,
      config,
    );
  },
};