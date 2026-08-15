"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { authStorage } from "@/lib/auth-storage";
import { queryKeys } from "@/lib/query-keys";
import { billingApi } from "./api";
import type { CheckoutStart } from "./types";

const hasToken = () => Boolean(authStorage.getAccessToken());
const token = () => authStorage.getAccessToken() as string;

export function usePlans() {
  return useQuery({ queryKey: queryKeys.billing.plans, queryFn: () => billingApi.listPlans() });
}

export function useCreditSummary(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.billing.credits(workspaceId),
    queryFn: () => billingApi.creditSummary(workspaceId, token()),
    enabled: Boolean(workspaceId) && hasToken(),
  });
}

export function useCreditHistory(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.billing.creditsHistory(workspaceId),
    queryFn: () => billingApi.creditHistory(workspaceId, token()),
    enabled: Boolean(workspaceId) && hasToken(),
  });
}

export function useUsage(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.billing.usage(workspaceId),
    queryFn: () => billingApi.usage(workspaceId, token()),
    enabled: Boolean(workspaceId) && hasToken(),
  });
}

export function useCheckout(workspaceId: string) {
  return useMutation({
    mutationFn: (body: CheckoutStart) => billingApi.checkout(workspaceId, body, token()),
    onSuccess: (response) => window.location.assign(response.checkout_url),
  });
}

export function useBillingPortal(workspaceId: string) {
  return useMutation({
    mutationFn: () => billingApi.portal(workspaceId, token()),
    onSuccess: (response) => window.location.assign(response.url),
  });
}
