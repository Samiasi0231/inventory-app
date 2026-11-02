import axios, { type AxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import { ApiError } from "./errors";

const STATUS_MESSAGES: Record<number, string> = {
  400: "Please check the information you entered.",
  401: "Your session has expired. Please log in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  429: "Too many requests. Please wait a moment and try again.",
};

/** Top-level keys that are not field errors. */
const RESERVED_KEYS = new Set(["detail", "message", "code", "errors"]);

function addFieldErrors(target: Record<string, string[]>, source: Record<string, unknown>) {
  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) target[key] = value.map(String);
    else if (typeof value === "string") target[key] = [value];
  }
}

/**
 * Understands both error shapes the backend uses:
 *   { "detail": "...", "email": ["..."] }                                    (Django REST default)
 *   { "code": "VALIDATION_ERROR", "detail": "...", "errors": { "staff_size": ["..."] } }
 */
function parseErrorBody(data: unknown): {
  message?: string;
  code?: string;
  fieldErrors: Record<string, string[]>;
} {
  const fieldErrors: Record<string, string[]> = {};
  if (!data || typeof data !== "object") return { fieldErrors };

  const body = data as Record<string, unknown>;

  addFieldErrors(
    fieldErrors,
    Object.fromEntries(Object.entries(body).filter(([key]) => !RESERVED_KEYS.has(key))),
  );

  // nested shape: { errors: { field: [...] } } or { errors: ["..."] }
  if (Array.isArray(body.errors)) {
    fieldErrors.non_field_errors = body.errors.map(String);
  } else if (body.errors && typeof body.errors === "object") {
    addFieldErrors(fieldErrors, body.errors as Record<string, unknown>);
  }

  const message =
    (typeof body.detail === "string" && body.detail) ||
    (typeof body.message === "string" && body.message) ||
    fieldErrors.non_field_errors?.[0] ||
    Object.values(fieldErrors)[0]?.[0] ||
    undefined;

  const code = typeof body.code === "string" ? body.code : undefined;

  return { message, code, fieldErrors };
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return new ApiError({
        message: "Unable to reach the server. Check your connection.",
        status: null,
        code: error.code,
      });
    }

    const status = error.response.status;
    const { message, code, fieldErrors } = parseErrorBody(error.response.data);

    return new ApiError({
      message:
        message ??
        STATUS_MESSAGES[status] ??
        (status >= 500
          ? "Something went wrong on our end. Please try again."
          : "Request failed."),
      status,
      code: code ?? error.code, // the backend's own code wins over the transport code
      fieldErrors,
      details: error.response.data,
    });
  }

  return new ApiError({
    message: error instanceof Error ? error.message : "Unexpected error.",
  });
}

/** Builds multipart/form-data (the auth endpoints expect it). */
export function toFormData(payload: object): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;
    if (value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) =>
        formData.append(key, item instanceof Blob ? item : String(item)),
      );
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }
  return formData;
}

export async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    // Let react-query handle aborted requests untouched.
    if (axios.isCancel(error)) throw error;
    throw normalizeError(error);
  }
}

export const fetcher = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, method: "GET" }),

  post: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, method: "POST", data: body }),

  postForm: <T, B extends object = object>(
    url: string,
    body: B,
    config?: AxiosRequestConfig,
  ) => request<T>({ ...config, url, method: "POST", data: toFormData(body) }),

  put: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, method: "PUT", data: body }),

  patch: <T, B = unknown>(url: string, body?: B, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, method: "PATCH", data: body }),

  delete: <T = void>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, url, method: "DELETE" }),
};