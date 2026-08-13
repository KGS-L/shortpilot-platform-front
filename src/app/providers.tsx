"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ApiError } from "@/lib/api-client";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => !(error instanceof ApiError && [401, 403, 404, 422, 429].includes(error.status)) && failureCount < 1,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  }));
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
