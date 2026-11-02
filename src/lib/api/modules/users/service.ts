import type { AxiosRequestConfig } from "axios";
import { fetcher, request, toFormData, type PaginatedResponse } from "../../core";
import { usersEndpoints } from "./endpoints";
import type { UpdateUserPayload, User, UsersListParams } from "./types";

export const usersService = {
  list(params?: UsersListParams, config?: AxiosRequestConfig) {
    return fetcher.get<PaginatedResponse<User>>(usersEndpoints.list, {
      ...config,
      params,
    });
  },

  retrieve(id: number | string, config?: AxiosRequestConfig) {
    return fetcher.get<User>(usersEndpoints.detail(id), config);
  },

  update(
    id: number | string,
    payload: UpdateUserPayload,
    config?: AxiosRequestConfig,
  ) {
    return request<User>({
      ...config,
      url: usersEndpoints.detail(id),
      method: "PUT",
      data: toFormData(payload),
    });
  },
};
