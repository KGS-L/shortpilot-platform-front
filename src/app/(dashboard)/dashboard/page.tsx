"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, CalendarClock, Film, Plus, Radio, Send, Sparkles } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";
import { useSession } from "@/features/auth/session-gate";
import { useCreditSummary } from "@/features/billing";
import { useChannels, platformLabels } from "@/features/channels";
import { usePublications, publicationStatusLabels, publicationStatusTones, type Publication } from "@/features/publications";
import { useVideos, type Video } from "@/features/videos";
import { formatDate, formatRelativeTime } from "@/lib/format";

type ActivityItem = {
  id: string;
  title: string;
  source: string;
  time: string;
  at: number;
  status: string;
  tone: string;
};

function StatsSkeleton() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
      {Array.from({ length: 4 }, (_, index) => (
        <article key={index} className="animate-pulse rounded-3xl border bg-white p-5">
          <span className="block h-10 w-10 rounded-xl bg-slate-200" />
          <span className="mt-5 block h-4 w-2/3 rounded bg-slate-100" />
          <span className="mt-3 block h-8 w-1/3 rounded bg-slate-200" />
        </article>
      ))}
    </section>
  );
}

function buildActivity(videos: Video[], publications: Publication[], channelNames: Map<string, string>): ActivityItem[] {
  const fromVideos: ActivityItem[] = videos.map((video) => ({
    id: `video-${video.id}`,
    title: video.kind === "clip" ? "Clip généré" : "Vidéo importée",
    source: video.title?.trim() || "Vidéo sans titre",
    time: formatRelativeTime(video.created_at),
    at: new Date(video.created_at).getTime(),
    status: video.status === "ready" ? "Prête" : video.status === "failed" ? "Échec" : "Traitement",
    tone: video.status === "ready" ? "bg-lime-50 text-lime-700" : video.status === "failed" ? "bg-red-50 text-red-700" : "bg-orange-50 text-orange-700",
  }));
  const fromPublications: ActivityItem[] = publications.map((publication) => ({
    id: `publication-${publication.id}`,
    title: "Publication",
    source: `${channelNames.get(publication.channel_id) ?? "Chaîne inconnue"} · ${publication.title}`,
    time: formatRelativeTime(publication.updated_at),
    at: new Date(publication.updated_at).getTime(),
    status: publicationStatusLabels[publication.status],
    tone: publicationStatusTones[publication.status],
  }));
  return [...fromVideos, ...fromPublications]
    .sort((a, b) => b.at - a.at)
    .slice(0, 5);
}

export default function DashboardPage() {
  const { user, workspace } = useSession();
  const queryClient = useQueryClient();
  const workspaceId = workspace?.id ?? "";
  const creditsQuery = useCreditSummary(workspaceId);
  const videosQuery = useVideos(workspaceId);
  const publicationsQuery = usePublications(workspaceId);
  const channelsQuery = useChannels(workspaceId);

  const videos = useMemo(() => videosQuery.data ?? [], [videosQuery.data]);
  const publications = useMemo(() => publicationsQuery.data ?? [], [publicationsQuery.data]);
  const channels = useMemo(() => channelsQuery.data ?? [], [channelsQuery.data]);

  const activeChannels = channels.filter((channel) => channel.status === "active");
  const scheduled = publications.filter((publication) => publication.status === "scheduled");
  const clips = videos.filter((video) => video.kind === "clip");

  const activity = useMemo(
    () => buildActivity(videos.slice(0, 10), publications.slice(0, 10), new Map(channels.map((channel) => [channel.id, channel.name]))),
    [videos, publications, channels],
  );

  const weekAhead = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(now);
      day.setDate(now.getDate() + index);
      const count = scheduled.filter((publication) => {
        const date = new Date(publication.scheduled_at ?? "");
        return publication.scheduled_at && date.toDateString() === day.toDateString();
      }).length;
      return { day, count };
    });
  }, [scheduled]);

  const credits = creditsQuery.data;
  const creditsUsed = credits ? credits.plan.monthly_credits - credits.balance : 0;
  const firstName = (user.display_name ?? user.email).split(/[\s@]/)[0];

  const stats = [
    {
      label: "Crédits disponibles",
      value: credits ? `${credits.balance} / ${credits.plan.monthly_credits}` : "—",
      note: credits ? `${creditsUsed} utilisés cette période · plan ${credits.plan.name}` : "Chargement…",
      color: "bg-lime-100 text-lime-700",
      icon: Sparkles,
    },
    {
      label: "Vidéos et clips",
      value: `${videos.length}`,
      note: `${clips.length} clips générés`,
      color: "bg-orange-100 text-orange-700",
      icon: Film,
    },
    {
      label: "Publications",
      value: `${publications.length}`,
      note: `${scheduled.length} programmées`,
      color: "bg-blue-100 text-blue-700",
      icon: Send,
    },
    {
      label: "Réseaux connectés",
      value: credits ? `${activeChannels.length} / ${credits.plan.social_connections_limit}` : `${activeChannels.length}`,
      note: activeChannels.length
        ? activeChannels.map((channel) => platformLabels[channel.platform]).join(", ")
        : "Aucun réseau connecté",
      color: "bg-pink-100 text-pink-700",
      icon: Radio,
    },
  ];

  const loading = creditsQuery.isPending || videosQuery.isPending || publicationsQuery.isPending || channelsQuery.isPending;
  const error = creditsQuery.error ?? videosQuery.error ?? publicationsQuery.error ?? channelsQuery.error;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-black uppercase tracking-[.15em] text-lime-700">Bonjour {firstName}</p>
          <h1 className="text-3xl font-black tracking-[-.04em] md:text-5xl">Qu’allons-nous publier aujourd’hui ?</h1>
          <p className="mt-2 text-slate-500">Votre activité Omnelyo en un coup d’œil.</p>
        </div>
        <Link href="/dashboard/videos" className="flex items-center gap-2 rounded-full bg-[#172033] px-5 py-3 text-sm font-black text-white">
          <Plus size={18}/> Importer une vidéo
        </Link>
      </header>

      {error ? (
        <div className="mx-auto max-w-xl">
          <AsyncState
            kind="error"
            description={error instanceof Error ? error.message : "Impossible de charger votre activité."}
            action={
              <button onClick={() => queryClient.invalidateQueries()} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-black text-white">
                Réessayer
              </button>
            }
          />
        </div>
      ) : loading ? (
        <StatsSkeleton/>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, note, color, icon: Icon }) => (
            <article key={label} className="rounded-3xl border bg-white p-5">
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={19}/></div>
              <p className="mt-5 text-sm text-slate-500">{label}</p>
              <p className="mt-1 text-3xl font-black">{value}</p>
              <p className="mt-2 text-xs text-slate-400">{note}</p>
            </article>
          ))}
        </section>
      )}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-3xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Activité récente</h2>
              <p className="text-sm text-slate-500">Vos derniers contenus et publications.</p>
            </div>
            <Link href="/dashboard/publications" className="text-sm font-bold text-lime-700">Tout voir</Link>
          </div>
          {activity.length ? (
            <div className="mt-6 divide-y">
              {activity.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100"><Film size={18}/></div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{item.title}</p>
                    <p className="truncate text-sm text-slate-500">{item.source}</p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${item.tone}`}>{item.status}</span>
                    <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !error && !loading ? (
              <div className="mt-6">
                <AsyncState kind="empty" title="Aucune activité pour l’instant" description="Importez une vidéo ou créez une publication pour démarrer."/>
              </div>
            ) : null
          )}
        </section>

        <aside className="rounded-3xl bg-orange-500 p-6 text-white">
          <CalendarClock size={28}/>
          <h2 className="mt-6 text-2xl font-black">Votre semaine prend forme.</h2>
          <p className="mt-3 text-sm leading-6 text-orange-50">
            {scheduled.length > 0
              ? `${scheduled.length} publication${scheduled.length > 1 ? "s sont" : " est"} programmée${scheduled.length > 1 ? "s" : ""} sur vos réseaux.`
              : "Aucune publication programmée pour le moment."}
          </p>
          <div className="my-6 grid grid-cols-7 gap-1">
            {weekAhead.map(({ day, count }) => (
              <span key={day.toISOString()} className={`grid aspect-square place-items-center rounded-lg text-xs font-bold ${count ? "bg-white text-orange-600" : "bg-white/15"}`}>
                {day.getDate()}
              </span>
            ))}
          </div>
          {credits && <p className="text-xs text-orange-50">Crédits renouvelés le {formatDate(credits.period_end)}.</p>}
          <Link href="/dashboard/publications" className="mt-4 flex items-center gap-2 font-black">Voir le calendrier <ArrowRight size={17}/></Link>
        </aside>
      </div>
    </div>
  );
}
