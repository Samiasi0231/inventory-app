"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useApiQuery, usePaginatedQuery, type ApiError } from "../../core";
import { usersEndpoints } from "./endpoints";
import { usersKeys } from "./keys";
import { usersService } from "./service";
import type { UpdateUserPayload, User, UsersListParams } from "./types";

export function useUsers(params: UsersListParams = {}) {
  return usePaginatedQuery<User>({
    queryKey: usersKeys.list(params),
    url: usersEndpoints.list,
    params,
  });
}

export function useUser(id: number | string | undefined) {
  return useApiQuery<User>({
    queryKey: usersKeys.detail(id ?? ""),
    url: usersEndpoints.detail(id ?? ""),
    options: { enabled: id !== undefined && id !== "" },
  });
}

interface UpdateUserVariables {
  id: number | string;
  data: UpdateUserPayload;
}

export function useUpdateUser(
  options?: Omit<
    UseMutationOptions<User, ApiError, UpdateUserVariables>,
    "mutationFn"
  >,
) {
  const queryClient = useQueryClient();

  type SuccessArgs = Parameters<
    NonNullable<UseMutationOptions<User, ApiError, UpdateUserVariables>["onSuccess"]>
  >;

  return useMutation<User, ApiError, UpdateUserVariables>({
    ...options,
    mutationFn: ({ id, data }) => usersService.update(id, data),
    onSuccess: async (...args: SuccessArgs) => {
      const [user] = args;
      queryClient.setQueryData(usersKeys.detail(user.id), user);
      await queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      await options?.onSuccess?.(...args);
    },
  });
}
