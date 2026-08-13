import { publicEnv } from "@/lib/env";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type") && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  const response = await fetch(`${publicEnv.NEXT_PUBLIC_API_URL}${path}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new ApiError(response.status, payload?.detail ?? "La requête a échoué.");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
