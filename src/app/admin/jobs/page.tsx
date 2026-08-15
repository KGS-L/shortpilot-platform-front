"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, LoaderCircle, RefreshCcw, RotateCcw, Workflow, XCircle } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";
import { useSession } from "@/features/auth/session-gate";
import { jobStatusLabels, jobTypeLabels, useJobAction, useWorkspaceJobs } from "@/features/jobs";
import { formatDateTime, formatRelativeTime } from "@/lib/format";

const statusFilters = [
  { key: "", label: "Tous" },
  { key: "queued", label: "En attente" },
  { key: "running", label: "En cours" },
  { key: "failed", label: "Échecs" },
  { key: "succeeded", label: "Réussis" },
] as const;

export default function AdminJobs() {
  const { workspace } = useSession();
  const workspaceId = workspace?.id ?? "";
  const [status, setStatus] = useState<string>("");
  const jobsQuery = useWorkspaceJobs(workspaceId, status || undefined);
  const { cancel, retry } = useJobAction(workspaceId);

  const jobs = jobsQuery.data ?? [];
  const busy = cancel.isPending || retry.isPending;
  const actionError = cancel.error ?? retry.error;

  const counters = [
    { icon: Workflow, label: "En attente", value: jobs.filter((job) => job.status === "queued").length },
    { icon: Clock3, label: "En cours", value: jobs.filter((job) => job.status === "running").length },
    { icon: CheckCircle2, label: "Réussis", value: jobs.filter((job) => job.status === "succeeded").length },
    { icon: AlertTriangle, label: "Échecs", value: jobs.filter((job) => job.status === "failed").length },
  ];

  return (
    <div className="mx-auto max-w-[1500px]">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-red-600">Opérations</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Jobs et publications.</h1>
        <p className="mt-2 text-slate-500">Diagnostiquez les traitements de l’espace « {workspace?.name ?? "—"} » sans masquer les erreurs.</p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {counters.map(({ icon: Icon, label, value }) => (
          <article key={label} className="rounded-3xl border bg-white p-5">
            <Icon className="text-red-500"/>
            <p className="mt-5 text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-3xl font-black">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 overflow-hidden rounded-3xl border bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatus(filter.key)}
                className={`rounded-full px-4 py-2 text-xs font-black ${status === filter.key ? "bg-slate-900 text-white" : "text-slate-500"}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <button onClick={() => jobsQuery.refetch()} className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black">
            <RefreshCcw size={15}/> Actualiser
          </button>
        </div>

        {jobsQuery.isPending ? (
          <div className="p-6"><AsyncState kind="loading" description="Chargement des jobs…"/></div>
        ) : jobsQuery.error ? (
          <div className="p-6">
            <AsyncState
              kind="error"
              description={jobsQuery.error instanceof Error ? jobsQuery.error.message : "Chargement impossible."}
              action={<button onClick={() => jobsQuery.refetch()} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-black text-white">Réessayer</button>}
            />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-6"><AsyncState kind="empty" title="Aucun job" description="Aucun traitement ne correspond à ce filtre pour cet espace."/></div>
        ) : (
          <div>
            {jobs.map((job) => (
              <div key={job.id} className="grid grid-cols-[1fr_auto] items-center gap-4 border-b px-5 py-4 last:border-0 sm:grid-cols-[1.1fr_110px_110px_150px_190px]">
                <div className="min-w-0">
                  <code className="text-xs font-black">{job.id.slice(0, 13)}…</code>
                  {job.error_message && <p className="mt-1 truncate text-xs text-red-600">{job.error_message}</p>}
                </div>
                <span className="hidden text-sm font-bold sm:block">{jobTypeLabels[job.type] ?? job.type}</span>
                <span className="hidden text-sm sm:block">{job.attempts}/{job.max_attempts} essais</span>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${job.status === "failed" ? "bg-red-50 text-red-700" : job.status === "succeeded" ? "bg-lime-50 text-lime-700" : job.status === "running" ? "bg-orange-50 text-orange-700" : "bg-blue-50 text-blue-700"}`}>
                  {jobStatusLabels[job.status] ?? job.status}
                </span>
                <div className="flex items-center justify-end gap-3">
                  <span className="hidden text-xs text-slate-500 md:block" title={formatDateTime(job.created_at)}>{formatRelativeTime(job.created_at)}</span>
                  {(job.status === "queued" || job.status === "running") && (
                    <button disabled={busy} onClick={() => cancel.mutate(job.id)} className="rounded-full border px-3 py-1.5 text-xs font-black disabled:opacity-50">Annuler</button>
                  )}
                  {job.status === "failed" && job.attempts < job.max_attempts && (
                    <button disabled={busy} onClick={() => retry.mutate(job.id)} className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-black text-white disabled:opacity-50">
                      {retry.isPending && retry.variables === job.id ? <LoaderCircle size={12} className="animate-spin"/> : <RotateCcw size={12}/>} Relancer
                    </button>
                  )}
                  {job.status === "failed" && job.attempts >= job.max_attempts && (
                    <span className="flex items-center gap-1 text-xs text-slate-400"><XCircle size={12}/> Épuisées</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {actionError && (
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
          {actionError instanceof Error ? actionError.message : "L’action a échoué."}
        </p>
      )}
      <p className="mt-5 text-xs text-slate-400">Chaque relance ou annulation est enregistrée dans le journal d’audit de l’espace. La vue plateforme complète (tous espaces) nécessite un endpoint d’administration dédié.</p>
    </div>
  );
}
