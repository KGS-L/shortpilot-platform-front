"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { AsyncState } from "@/components/ui/async-state";
import type { Space } from "@/components/layout/sidebar";
import { ApiError, apiRequest } from "@/lib/api-client";
import { authStorage } from "@/lib/auth-storage";
import { queryKeys } from "@/lib/query-keys";

export type User = {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  email_verified: boolean;
  platform_role: "user" | "admin";
  partner_status: "pending" | "active" | "suspended" | "closed" | null;
};

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "admin" | "member";
  created_at: string;
};

export type Session = { user: User; workspaces: Workspace[]; workspace: Workspace | null };

type SessionContextValue = Session & { selectWorkspace: (workspaceId: string) => void };
const SessionContext = createContext<SessionContextValue | null>(null);

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession doit être utilisé dans SessionGate.");
  return session;
}

async function fetchSession(token: string): Promise<Session> {
  const [user, workspaces] = await Promise.all([
    apiRequest<User>("/v1/users/me", {}, token),
    apiRequest<Workspace[]>("/v1/workspaces", {}, token),
  ]);
  const savedWorkspaceId = authStorage.getWorkspaceId();
  const workspace = workspaces.find((item) => item.id === savedWorkspaceId) ?? workspaces[0] ?? null;
  if (workspace) authStorage.setWorkspaceId(workspace.id);
  return { user, workspaces, workspace };
}

export function SessionGate({ space, children }: { space: Space; children: (session: Session) => ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const token = authStorage.getAccessToken();
  const sessionQuery = useQuery({
    queryKey: queryKeys.session,
    queryFn: () => fetchSession(token as string),
    enabled: Boolean(token),
  });

  const unauthorized = sessionQuery.error instanceof ApiError && sessionQuery.error.status === 401;
  const forbidden = sessionQuery.data && (
    (space === "admin" && sessionQuery.data.user.platform_role !== "admin") ||
    (space === "partner" && sessionQuery.data.user.partner_status !== "active")
  );

  useEffect(() => {
    if (!token || unauthorized) {
      authStorage.clearSession();
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (forbidden) {
      router.replace(space === "partner" ? "/partners" : "/dashboard");
    }
  }, [forbidden, pathname, router, space, token, unauthorized]);

  if (!token || sessionQuery.isPending || unauthorized || forbidden) {
    return <div className="mx-auto mt-20 max-w-xl"><AsyncState kind="loading" description="Vérification de votre session et de vos permissions." /></div>;
  }
  if (sessionQuery.error || !sessionQuery.data) {
    return <div className="mx-auto mt-20 max-w-xl"><AsyncState kind="error" description={sessionQuery.error instanceof Error ? sessionQuery.error.message : "Session indisponible."} action={<button onClick={() => sessionQuery.refetch()} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-black text-white">Réessayer</button>} /></div>;
  }

  const session = sessionQuery.data;
  const selectWorkspace = (workspaceId: string) => {
    const workspace = session.workspaces.find((item) => item.id === workspaceId);
    if (!workspace) return;
    authStorage.setWorkspaceId(workspace.id);
    queryClient.setQueryData<Session>(queryKeys.session, { ...session, workspace });
  };

  return <SessionContext.Provider value={{ ...session, selectWorkspace }}>{children(session)}</SessionContext.Provider>;
}
