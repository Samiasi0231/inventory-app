"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { ApiError } from "../../core";
import { organizationsService } from "./service";
import type { CreateOrganizationPayload, Organization } from "./types";

export function useCreateOrganization(
  options?: Omit<
    UseMutationOptions<Organization, ApiError, CreateOrganizationPayload>,
    "mutationFn"
  >,
) {
  return useMutation<Organization, ApiError, CreateOrganizationPayload>({
    mutationFn: (payload) => organizationsService.create(payload),
    ...options,
  });
}