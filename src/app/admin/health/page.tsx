"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, CheckCircle2, LoaderCircle, RefreshCcw, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { publicEnv } from "@/lib/env";
import { formatDateTime } from "@/lib/format";
import { useSession } from "@/features/auth/session-gate";
import { useWorkspaceJobs } from "@/features/jobs";

type Health = { status: string };

export default function HealthPage() {
  const { workspace } = useSession();
  const workspaceId = workspace?.id ?? "";
  const healthQuery = useQuery({
    queryKey: ["health"],
    queryFn: () => apiRequest<Health>("/health"),
    refetchInterval: 60_000,
  });
  const jobsQuery = useWorkspaceJobs(workspaceId);

  const healthy = healthQuery.data?.status === "ok";
  const jobs = jobsQuery.data ?? [];
  const failedJobs = jobs.filter((job) => job.status === "failed").length;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[.15em] text-red-600">Infrastructure</p>
          <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Santé de la plateforme.</h1>
          <p className="mt-2 text-slate-500">Une vue claire des dépendances essentielles.</p>
        </div>
        <button onClick={() => healthQuery.refetch()} disabled={healthQuery.isFetching} className="flex items-center gap-2 rounded-full border bg-white px-4 py-2.5 text-sm font-black disabled:opacity-50">
          {healthQuery.isFetching ? <LoaderCircle size={16} className="animate-spin"/> : <RefreshCcw size={16}/>} Vérifier maintenant
        </button>
      </header>

      <div className={`mt-8 flex items-center gap-3 rounded-3xl p-5 ${healthy ? "bg-lime-50 text-lime-900" : healthQuery.isError ? "bg-red-50 text-red-900" : "bg-slate-100 text-slate-700"}`}>
        {healthQuery.isFetching ? <LoaderCircle className="animate-spin"/> : healthy ? <CheckCircle2/> : <XCircle/>}
        <div>
          <p className="font-black">
            {healthy ? "API opérationnelle" : healthQuery.isError ? "API injoignable" : "Vérification en cours"}
          </p>
          <p className="text-sm">
            {publicEnv.NEXT_PUBLIC_API_URL}/health — dernière vérification : {healthQuery.dataUpdatedAt ? formatDateTime(new Date(healthQuery.dataUpdatedAt)) : "—"}
          </p>
        </div>
      </div>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-3xl border bg-white p-5">
          <div className="flex justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100"><Activity/></span>
            <span className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${healthy ? "bg-lime-50 text-lime-700" : "bg-red-50 text-red-700"}`}>
              {healthy ? "Opérationnel" : "Hors ligne"}
            </span>
          </div>
          <h2 className="mt-5 font-black">API FastAPI</h2>
          <p className="mt-1 text-sm text-slate-500">Sonde automatique toutes les 60 s</p>
        </article>
        <article className="rounded-3xl border bg-white p-5">
          <div className="flex justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100"><Activity/></span>
            <span className="h-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{failedJobs === 0 ? "OK" : `${failedJobs} échec(s)`}</span>
          </div>
          <h2 className="mt-5 font-black">Workers de l’espace</h2>
          <p className="mt-1 text-sm text-slate-500">Déduit des jobs en échec sur « {workspace?.name ?? "—"} »</p>
        </article>
        <article className="rounded-3xl border bg-white p-5">
          <div className="flex justify-between">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100"><Activity/></span>
            <span className="h-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Non mesuré</span>
          </div>
          <h2 className="mt-5 font-black">PostgreSQL · Redis · Stockage</h2>
          <p className="mt-1 text-sm text-slate-500">L’API ne fournit pas encore de sondes détaillées par dépendance</p>
        </article>
      </section>

      <section className="mt-6 rounded-3xl border bg-white p-6">
        <h2 className="text-xl font-black">État détaillé indisponible</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          L’endpoint public <code className="rounded bg-slate-100 px-1.5 py-0.5">/health</code> confirme la disponibilité globale de l’API.
          Les métriques internes (latence base de données, files Redis, occupation du stockage) nécessitent des endpoints d’observation dédiés qui ne sont pas encore exposés.
        </p>
      </section>
    </div>
  );
}
