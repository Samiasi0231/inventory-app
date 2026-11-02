import type { AxiosRequestConfig } from "axios";
import { fetcher } from "../../core";
import { businessTypesEndpoints } from "./endpoints";
import type { BusinessType, BusinessTypeContext } from "./types";

export const businessTypesService = {
  /** Without `context`, returns every active type (for the "edit business types" screen). */
  list(context?: BusinessTypeContext, config?: AxiosRequestConfig) {
    return fetcher.get<BusinessType[]>(businessTypesEndpoints.list, {
      ...config,
      params: context ? { context } : undefined,
    });
  },

  retrieve(code: string, config?: AxiosRequestConfig) {
    return fetcher.get<BusinessType>(businessTypesEndpoints.detail(code), config);
  },
};
