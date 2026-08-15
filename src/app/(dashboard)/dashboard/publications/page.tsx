"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, MoreHorizontal, Plus, Search } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import { useSession } from "@/features/auth/session-gate";
import { useChannels, platformLabels } from "@/features/channels";
import {
  useCancelPublication,
  usePublications,
  usePublishPublication,
  publicationStatusLabels,
  publicationStatusTones,
  type PublicationStatus,
} from "@/features/publications";
import { formatDateTime } from "@/lib/format";

const filters = [
  { key: "all", label: "Toutes" },
  { key: "scheduled", label: "Programmées" },
  { key: "published", label: "Publiées" },
  { key: "draft", label: "Brouillons" },
] as const;

export default function PublicationsPage() {
  const { workspace } = useSession();
  const workspaceId = workspace?.id ?? "";
  const publicationsQuery = usePublications(workspaceId);
  const channelsQuery = useChannels(workspaceId);
  const cancelMutation = useCancelPublication(workspaceId);
  const publishMutation = usePublishPublication(workspaceId);

  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");
  const [search, setSearch] = useState("");

  const channels = useMemo(
    () => new Map((channelsQuery.data ?? []).map((channel) => [channel.id, channel])),
    [channelsQuery.data],
  );

  const rows = useMemo(() => {
    const items = publicationsQuery.data ?? [];
    return items
      .filter((publication) => filter === "all" || publication.status === (filter as PublicationStatus))
      .filter((publication) => publication.title.toLowerCase().includes(search.trim().toLowerCase()));
  }, [publicationsQuery.data, filter, search]);

  const busy = cancelMutation.isPending || publishMutation.isPending;
  const actionError = cancelMutation.error ?? publishMutation.error;

  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[.15em] text-lime-700">Diffusion</p>
          <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Vos publications.</h1>
          <p className="mt-2 text-slate-500">Suivez les brouillons, programmations et contenus publiés.</p>
        </div>
        <Link href="/dashboard/publications/new" className="flex items-center gap-2 rounded-full bg-[#172033] px-5 py-3 text-sm font-black text-white">
          <Plus size={17}/> Nouvelle publication
        </Link>
      </header>

      <section className="mt-8 overflow-hidden rounded-3xl border bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
          <div className="flex gap-2">
            {filters.map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`rounded-full px-4 py-2 text-xs font-black ${filter === item.key ? "bg-slate-900 text-white" : "text-slate-500"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="flex h-10 items-center gap-2 rounded-full border px-4">
            <Search size={15}/>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-32 text-sm outline-none"
              placeholder="Rechercher"
            />
          </label>
        </div>

        {publicationsQuery.isPending || channelsQuery.isPending ? (
          <div className="p-5"><ContentSkeleton rows={4}/></div>
        ) : publicationsQuery.error ? (
          <div className="p-5">
            <AsyncState
              kind="error"
              description={publicationsQuery.error instanceof Error ? publicationsQuery.error.message : "Chargement impossible."}
              action={<button onClick={() => publicationsQuery.refetch()} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-black text-white">Réessayer</button>}
            />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-5">
            <AsyncState
              kind="empty"
              title="Aucune publication"
              description={(publicationsQuery.data ?? []).length ? "Aucune publication ne correspond à ce filtre." : "Créez votre première publication depuis votre bibliothèque."}
              action={<Link href="/dashboard/publications/new" className="inline-block rounded-full bg-[#172033] px-5 py-2 text-sm font-black text-white">Nouvelle publication</Link>}
            />
          </div>
        ) : (
          <div className="divide-y">
            {rows.map((publication) => {
              const channel = channels.get(publication.channel_id);
              const network = channel ? platformLabels[channel.platform] : "Chaîne inconnue";
              const date = publication.published_at ?? publication.scheduled_at ?? publication.created_at;
              return (
                <article key={publication.id} className="grid grid-cols-[1fr_auto] items-center gap-3 p-4 hover:bg-slate-50 sm:grid-cols-[1fr_160px_190px_130px] sm:px-6">
                  <div className="min-w-0">
                    <h2 className="truncate font-black">{publication.title}</h2>
                    <p className="text-xs text-slate-500 sm:hidden">{network}</p>
                    {publication.error_message && <p className="mt-1 truncate text-xs text-red-600">{publication.error_message}</p>}
                  </div>
                  <span className="hidden text-sm font-bold sm:block">{network}</span>
                  <div className="hidden sm:block">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${publicationStatusTones[publication.status]}`}>
                      {publicationStatusLabels[publication.status]}
                    </span>
                    <p className="mt-2 flex items-center gap-1 text-xs text-slate-400"><CalendarDays size={12}/>{formatDateTime(date)}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    {publication.status === "scheduled" && (
                      <button disabled={busy} onClick={() => cancelMutation.mutate(publication.id)} className="rounded-full border px-3 py-1.5 text-xs font-black disabled:opacity-50">
                        Annuler
                      </button>
                    )}
                    {publication.status === "draft" && (
                      <button disabled={busy} onClick={() => publishMutation.mutate(publication.id)} className="rounded-full bg-[#172033] px-3 py-1.5 text-xs font-black text-white disabled:opacity-50">
                        Publier
                      </button>
                    )}
                    {!["scheduled", "draft"].includes(publication.status) && <MoreHorizontal className="text-slate-400"/>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {actionError && (
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
          {actionError instanceof Error ? actionError.message : "L’action a échoué."}
        </p>
      )}
    </div>
  );
}
