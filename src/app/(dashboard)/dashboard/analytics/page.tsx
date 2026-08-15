"use client";

import { useMemo } from "react";
import { BarChart3, CheckCircle2, Clock3, Film, Send, TrendingUp, XCircle } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";
import { useSession } from "@/features/auth/session-gate";
import { platformLabels, useChannels } from "@/features/channels";
import { usePublications, publicationStatusLabels, type PublicationStatus } from "@/features/publications";
import { useUsage } from "@/features/billing";
import { useVideos } from "@/features/videos";
import { formatDateTime } from "@/lib/format";

const platformColors: Record<string, string> = {
  youtube: "bg-red-500",
  tiktok: "bg-slate-900",
  instagram: "bg-pink-500",
  facebook: "bg-blue-500",
};

export default function AnalyticsPage() {
  const { workspace } = useSession();
  const workspaceId = workspace?.id ?? "";
  const publicationsQuery = usePublications(workspaceId);
  const channelsQuery = useChannels(workspaceId);
  const videosQuery = useVideos(workspaceId);
  const usageQuery = useUsage(workspaceId);

  const publications = useMemo(() => publicationsQuery.data ?? [], [publicationsQuery.data]);
  const loading = publicationsQuery.isPending || channelsQuery.isPending || videosQuery.isPending || usageQuery.isPending;
  const error = publicationsQuery.error ?? channelsQuery.error ?? usageQuery.error;

  const channels = useMemo(
    () => new Map((channelsQuery.data ?? []).map((channel) => [channel.id, channel])),
    [channelsQuery.data],
  );

  const byStatus = useMemo(() => {
    const counts = new Map<PublicationStatus, number>();
    for (const publication of publications) {
      counts.set(publication.status, (counts.get(publication.status) ?? 0) + 1);
    }
    return counts;
  }, [publications]);

  const byPlatform = useMemo(() => {
    const counts = new Map<string, number>();
    for (const publication of publications) {
      const platform = channels.get(publication.channel_id)?.platform ?? "unknown";
      counts.set(platform, (counts.get(platform) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [publications, channels]);

  const topContent = useMemo(
    () => [...publications].slice(0, 5),
    [publications],
  );

  const usage = usageQuery.data ?? null;
  const videos = videosQuery.data ?? [];
  const clips = videos.filter((video) => video.kind === "clip");
  const maxPlatform = byPlatform.length ? byPlatform[0][1] : 1;

  const stats = [
    { label: "Publications totales", value: `${publications.length}`, note: `${byStatus.get("published") ?? 0} publiées`, icon: Send },
    { label: "Vidéos et clips", value: `${videos.length}`, note: `${clips.length} clips générés`, icon: Film },
    { label: "Source traitée", value: usage ? `${Math.round(usage.source_seconds / 60)} min` : "—", note: usage ? `sur ${Math.round(usage.source_seconds_limit / 60)} min incluses` : "", icon: TrendingUp },
    { label: "Stockage utilisé", value: usage ? `${Math.round(usage.storage_bytes / 1024 / 1024)} Mo` : "—", note: usage ? `sur ${Math.round(usage.storage_bytes_limit / 1024 / 1024 / 1024)} Go` : "", icon: BarChart3 },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[.15em] text-lime-700">Analyses</p>
          <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Ce qui attire votre audience.</h1>
          <p className="mt-2 text-slate-500">Repérez les formats et sujets qui méritent une suite.</p>
        </div>
      </header>

      {error ? (
        <div className="mt-8 mx-auto max-w-xl">
          <AsyncState kind="error" description={error instanceof Error ? error.message : "Chargement impossible."}/>
        </div>
      ) : loading ? (
        <div className="mt-8"><AsyncState kind="loading" description="Chargement de vos statistiques…"/></div>
      ) : (
        <>
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, note, icon: Icon }) => (
              <article key={label} className="rounded-3xl border bg-white p-5">
                <Icon className="text-slate-500"/>
                <p className="mt-5 text-sm text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-black">{value}</p>
                <p className="mt-2 text-xs font-bold text-slate-500">{note}</p>
              </article>
            ))}
          </section>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
            <section className="rounded-3xl border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">Statuts de publication</h2>
                  <p className="text-sm text-slate-500">Répartition réelle de vos publications.</p>
                </div>
                <BarChart3/>
              </div>
              <div className="mt-6 space-y-4">
                {(["published", "scheduled", "publishing", "draft", "failed", "cancelled"] as PublicationStatus[])
                  .filter((status) => (byStatus.get(status) ?? 0) > 0)
                  .map((status) => {
                    const count = byStatus.get(status) ?? 0;
                    return (
                      <div key={status}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            {status === "published" && <CheckCircle2 size={15} className="text-lime-600"/>}
                            {status === "scheduled" && <Clock3 size={15} className="text-blue-600"/>}
                            {status === "failed" && <XCircle size={15} className="text-red-600"/>}
                            {publicationStatusLabels[status]}
                          </span>
                          <span className="font-black">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${status === "published" ? "bg-lime-500" : status === "failed" ? "bg-red-400" : status === "scheduled" ? "bg-blue-400" : "bg-slate-400"}`} style={{ width: `${publications.length ? Math.round((count / publications.length) * 100) : 0}%` }}/>
                        </div>
                      </div>
                    );
                  })}
                {publications.length === 0 && <AsyncState kind="empty" title="Aucune donnée" description="Créez des publications pour voir vos statistiques."/>}
              </div>
            </section>

            <section className="rounded-3xl border bg-white p-6">
              <h2 className="text-xl font-black">Répartition par réseau</h2>
              <div className="mt-6 space-y-5">
                {byPlatform.length ? byPlatform.map(([platform, count]) => (
                  <div key={platform}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span>{platformLabels[platform as keyof typeof platformLabels] ?? "Autre"}</span>
                      <span className="font-black">{count} publication{count > 1 ? "s" : ""}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${platformColors[platform] ?? "bg-slate-400"}`} style={{ width: `${Math.round((count / maxPlatform) * 100)}%` }}/>
                    </div>
                  </div>
                )) : <AsyncState kind="empty" title="Aucun réseau" description="Connectez un réseau et publiez pour obtenir des statistiques."/>}
              </div>
            </section>
          </div>

          <section className="mt-6 overflow-hidden rounded-3xl border bg-white">
            <div className="border-b p-6"><h2 className="text-xl font-black">Dernières publications</h2></div>
            {topContent.length ? topContent.map((publication) => {
              const channel = channels.get(publication.channel_id);
              return (
                <div key={publication.id} className="grid grid-cols-[1fr_auto] gap-3 border-b px-5 py-4 last:border-0 sm:grid-cols-[1fr_140px_190px]">
                  <p className="truncate font-bold">{publication.title}</p>
                  <p className="hidden text-sm text-slate-500 sm:block">{channel ? platformLabels[channel.platform] : "—"}</p>
                  <p className="text-sm font-bold text-slate-600">{publicationStatusLabels[publication.status]} · {formatDateTime(publication.updated_at)}</p>
                </div>
              );
            }) : (
              <div className="p-6"><AsyncState kind="empty" title="Aucune publication" description="Vos publications apparaîtront ici avec leurs résultats."/></div>
            )}
          </section>
          <p className="mt-5 text-xs text-slate-400">Les métriques d’audience (vues, engagement) dépendent des autorisations accordées par chaque plateforme sociale et seront ajoutées lorsqu’elles seront disponibles.</p>
        </>
      )}
    </div>
  );
}
