"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {  authSession, setUnauthorizedHandler } from "@/lib/api/";
import { ApiError } from "@/lib/api/core/errors";
import { ROUTES } from "@/lib/routes";

const LOGIN_ROUTE = ROUTES.signIn;

function shouldRetry(failureCount: number, error: unknown) {
  // Never retry client errors (except timeouts / rate limits).
  if (error instanceof ApiError && error.status !== null) {
    const retryable =
      error.status >= 500 || error.status === 408 || error.status === 429;
    if (!retryable) return false;
  }
  return failureCount < 2;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        refetchOnWindowFocus: false,
        retry: shouldRetry,
      },
      mutations: { retry: false },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);
  const router = useRouter();

  useEffect(() => {
    // Runs when a refresh fails: the session is over.
    setUnauthorizedHandler(() => {
      authSession.clear();
      queryClient.clear();
      router.replace(LOGIN_ROUTE);
    });
    return () => setUnauthorizedHandler(null);
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
