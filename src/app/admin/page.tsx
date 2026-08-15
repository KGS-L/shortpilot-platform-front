"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, FileClock, Film, Send, Workflow, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { publicEnv } from "@/lib/env";
import { authStorage } from "@/lib/auth-storage";
import { formatDateTime } from "@/lib/format";
import { auditApi } from "@/features/audit";
import { useSession } from "@/features/auth/session-gate";
import { usePublications } from "@/features/publications";
import { useWorkspaceJobs } from "@/features/jobs";
import { useVideos } from "@/features/videos";

type Health = { status: string };

export default function AdminDashboard() {
  const { workspace, user } = useSession();
  const workspaceId = workspace?.id ?? "";

  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: () => apiRequest<Health>("/health"),
    refetchInterval: 60_000,
  });
  const videosQuery = useVideos(workspaceId);
  const publicationsQuery = usePublications(workspaceId);
  const jobsQuery = useWorkspaceJobs(workspaceId);
  const auditQuery = useQuery({
    queryKey: ["workspaces", workspaceId, "audit-events"],
    queryFn: () => auditApi.list(workspaceId, authStorage.getAccessToken() as string),
    enabled: Boolean(workspaceId) && (workspace?.role === "owner" || workspace?.role === "admin"),
  });

  const jobs = jobsQuery.data ?? [];
  const failedJobs = jobs.filter((job) => job.status === "failed");
  const runningJobs = jobs.filter((job) => job.status === "running" || job.status === "queued");
  const auditEvents = auditQuery.data ?? [];
  const apiHealthy = healthQuery.data?.status === "ok";

  const stats = [
    { label: "Vidéos de l’espace", value: `${videosQuery.data?.length ?? 0}`, note: "Toutes sources et clips", icon: Film, href: "/admin/jobs" },
    { label: "Publications de l’espace", value: `${publicationsQuery.data?.length ?? 0}`, note: "Tous statuts", icon: Send, href: "/admin/jobs" },
    { label: "Jobs actifs", value: `${runningJobs.length}`, note: `${failedJobs.length} en échec`, icon: Workflow, href: "/admin/jobs" },
    { label: "État de l’API", value: apiHealthy ? "Opérationnelle" : healthQuery.isPending ? "…" : "Hors ligne", note: "Sonde /health automatique", icon: apiHealthy ? CheckCircle2 : XCircle, href: "/admin/health" },
  ];

  return (
    <div className="mx-auto max-w-[1500px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[.15em] text-red-600">Centre de contrôle</p>
          <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Bonjour, {user.display_name ?? "administrateur"}.</h1>
          <p className="mt-2 text-slate-500">État technique de l’espace « {workspace?.name ?? "—"} » et de la plateforme.</p>
        </div>
        <span className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${apiHealthy ? "bg-lime-100 text-lime-800" : "bg-red-100 text-red-800"}`}>
          <span className={`h-2 w-2 rounded-full ${apiHealthy ? "bg-lime-600" : "bg-red-600"}`}/> API {apiHealthy ? "opérationnelle" : "injoignable"}
        </span>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon, href }) => (
          <Link key={label} href={href} className="rounded-3xl border bg-white p-5 transition hover:border-slate-300">
            <Icon className="text-red-500"/>
            <p className="mt-5 text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-black">{value}</p>
            <p className="mt-2 text-xs text-slate-400">{note}</p>
          </Link>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-3xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Actions requises</h2>
              <p className="text-sm text-slate-500">Jobs en échec nécessitant une relance.</p>
            </div>
            <Link href="/admin/jobs" className="text-sm font-black text-red-600">Tous les jobs</Link>
          </div>
          {failedJobs.length ? (
            <div className="mt-5 space-y-3">
              {failedJobs.slice(0, 5).map((job) => (
                <article key={job.id} className="flex items-center gap-4 rounded-2xl border p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-700"><AlertTriangle size={19}/></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">Job {job.type} — tentative {job.attempts}/{job.max_attempts}</p>
                    <p className="truncate text-sm text-slate-500">{job.error_message ?? "Erreur inconnue"}</p>
                  </div>
                  <Link href="/admin/jobs" className="text-sm font-black">Examiner →</Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
              <CheckCircle2 className="text-lime-600"/>
              <div>
                <p className="font-bold">Aucun job en échec</p>
                <p className="text-sm text-slate-500">Les traitements de cet espace se déroulent normalement.</p>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-[#172033] p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Journal d’audit</h2>
            <FileClock className="text-lime-400"/>
          </div>
          {auditQuery.isPending ? (
            <p className="mt-6 text-sm text-slate-300">Chargement…</p>
          ) : auditQuery.error ? (
            <p className="mt-6 text-sm text-slate-300">
              {auditQuery.error instanceof Error && auditQuery.error.message.includes("permission")
                ? "Le journal d’audit nécessite un rôle propriétaire ou administrateur sur cet espace."
                : "Journal d’audit indisponible pour cet espace."}
            </p>
          ) : auditEvents.length === 0 ? (
            <p className="mt-6 text-sm text-slate-300">Aucun événement enregistré récemment.</p>
          ) : (
            <div className="mt-6 max-h-80 space-y-3 overflow-y-auto">
              {auditEvents.slice(0, 10).map((event) => (
                <div key={event.id} className="rounded-2xl bg-white/5 p-3 text-sm">
                  <p className="font-bold">{event.action}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-400">{event.resource_path}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDateTime(event.created_at)} · HTTP {event.response_status ?? "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
          <p className="mt-6 text-xs text-slate-400">
            Les indicateurs globaux de la plateforme (utilisateurs, revenus) nécessitent des endpoints d’administration dédiés, pas encore exposés par l’API ({publicEnv.NEXT_PUBLIC_API_URL}).
          </p>
        </section>
      </div>
    </div>
  );
}
