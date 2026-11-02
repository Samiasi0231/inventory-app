import axios, { type AxiosError } from "axios";
import { authEndpoints } from "../modules/auth/endpoints";
import { tokenStorage } from "./token-storage";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** Do not attach the Authorization header or attempt a token refresh. */
    skipAuth?: boolean;
    /** Internal: set once a request has been retried after a refresh. */
    _retry?: boolean;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const AUTH_PREFIX = process.env.NEXT_PUBLIC_AUTH_HEADER_PREFIX ?? "Bearer";

// 60s: a sleeping Render instance can take ~50s to answer the first request.
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60_000,
  headers: { Accept: "application/json" },
});

// Bare instance (no interceptors) so a failing refresh can never loop.
const refreshClient = axios.create({ baseURL: BASE_URL, timeout: 60_000 });

let unauthorizedHandler: (() => void) | null = null;

/** Called when the session can no longer be refreshed (redirect to /login here). */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refresh = tokenStorage.getRefreshToken();
  if (!refresh) throw new Error("No refresh token available");

  const body = new FormData();
  body.append("refresh", refresh);

  const { data } = await refreshClient.post<{ access: string; refresh?: string }>(
    authEndpoints.refresh,
    body,
  );
  tokenStorage.setTokens({ access: data.access, refresh: data.refresh });
  return data.access;
}

apiClient.interceptors.request.use((config) => {
  if (config.skipAuth) return config;
  const token = tokenStorage.getAccessToken();
  if (token) config.headers.set("Authorization", `${AUTH_PREFIX} ${token}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config;

    if (
      !original ||
      error.response?.status !== 401 ||
      original.skipAuth ||
      original._retry
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      // Concurrent 401s share a single refresh request.
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const access = await refreshPromise;
      original.headers.set("Authorization", `${AUTH_PREFIX} ${access}`);
      return apiClient(original);
    } catch {
      tokenStorage.clearTokens();
      unauthorizedHandler?.();
      return Promise.reject(error);
    }
  },
);
