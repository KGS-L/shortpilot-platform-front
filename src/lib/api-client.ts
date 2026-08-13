import { publicEnv } from "@/lib/env";

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

type ErrorPayload = { detail?: string | Array<{ loc?: Array<string | number>; msg?: string }> };

function errorMessage(status: number, payload: ErrorPayload | null): string {
  if (typeof payload?.detail === "string") return payload.detail;
  if (Array.isArray(payload?.detail)) {
    const messages = payload.detail.map((item) => item.msg).filter(Boolean);
    if (messages.length) return messages.join(" ");
  }
  return ({
    401: "Votre session a expiré. Reconnectez-vous.",
    403: "Vous n’avez pas la permission d’effectuer cette action.",
    404: "La ressource demandée est introuvable.",
    409: "Cette action entre en conflit avec l’état actuel du contenu.",
    422: "Les informations envoyées ne sont pas valides.",
    429: "Trop de requêtes ont été envoyées. Réessayez dans un instant.",
  } as Record<number, string>)[status] ?? "La requête a échoué.";
}

export async function parseApiError(response: Response): Promise<ApiError> {
  const payload = await response.json().catch(() => null) as ErrorPayload | null;
  return new ApiError(response.status, errorMessage(response.status, payload));
}

export async function apiRequest<T>(path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type") && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  const response = await fetch(`${publicEnv.NEXT_PUBLIC_API_URL}${path}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    throw await parseApiError(response);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
