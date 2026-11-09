"use client";

import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiError } from "../../core";
import { tokenStorage } from "../../core";
import { organizationsService } from "./service";
import { organizationsKeys } from "./keys";
import type { CreateOrganizationPayload, Organization } from "./types";
import type { PaginatedResponse } from "../../core";

export function useOrganizationsList(options?: { enabled?: boolean }) {
  const hasToken =
    typeof window !== "undefined" && Boolean(tokenStorage.getAccessToken());

  return useQuery<PaginatedResponse<Organization>, ApiError>({
    queryKey: organizationsKeys.lists(),
    queryFn: () => organizationsService.list(),
    enabled: hasToken && (options?.enabled ?? true),
  });
}

const ACTIVE_ORG_KEY = "riinox.active_organization_id";

export function getStoredOrganizationId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ACTIVE_ORG_KEY);
  } catch {
    return null;
  }
}

export function setStoredOrganizationId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ACTIVE_ORG_KEY, id);
  } catch {
    // ignore
  }
}

/** Returns the active organization or the first available organization for the user. */
export function useCurrentOrganization() {
  const hasToken =
    typeof window !== "undefined" && Boolean(tokenStorage.getAccessToken());

  const { data, isLoading, error, refetch } = useOrganizationsList({
    enabled: hasToken,
  });
  const organizations = data?.results ?? [];

  const storedId = getStoredOrganizationId();
  const current =
    organizations.find((o) => o.id === storedId) ?? organizations[0] ?? null;

  const resolvedId = current?.id || storedId || "";

  return {
    organization: current,
    organizationId: resolvedId,
    organizations,
    isLoading: hasToken ? isLoading : false,
    hasToken,
    error,
    refetch,
    setActiveOrganizationId: (id: string) => {
      setStoredOrganizationId(id);
      void refetch();
    },
  };
}

export function useCreateOrganization(
  options?: Omit<
    UseMutationOptions<Organization, ApiError, CreateOrganizationPayload>,
    "mutationFn"
  >,
) {
  return useMutation<Organization, ApiError, CreateOrganizationPayload>({
    mutationFn: (payload) => organizationsService.create(payload),
    onSuccess: (data, ...rest) => {
      if (data?.id) {
        setStoredOrganizationId(data.id);
      }
      return options?.onSuccess?.(data, ...rest);
    },
    ...options,
  });
}
