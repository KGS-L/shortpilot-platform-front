"use client";

import { useMemo, useState } from "react";
import { Clock3, FileImage, Film, Search } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";
import { ContentSkeleton } from "@/components/ui/content-skeleton";
import { useSession } from "@/features/auth/session-gate";
import { useMediaAssets, useVideos, type MediaAsset, type Video, type VideoStatus } from "@/features/videos";

type LibraryItem =
  | { id: string; type: "video"; createdAt: string; title: string; video: Video }
  | { id: string; type: "image"; createdAt: string; title: string; asset: MediaAsset };

const statusLabels: Record<VideoStatus, string> = {
  uploaded: "Importée",
  queued: "En attente",
  processing: "Traitement",
  ready: "Prête",
  failed: "Échec",
};

function formatDuration(seconds: number | null) {
  if (seconds === null) return null;
  const rounded = Math.max(0, Math.round(seconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const remaining = rounded % 60;
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`
    : `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(value));
}

function VideoStatusBadge({ status }: { status: VideoStatus }) {
  const tone = status === "ready" ? "bg-lime-50 text-lime-700" : status === "failed" ? "bg-red-50 text-red-700" : "bg-orange-50 text-orange-700";
  return <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${tone}`}>{statusLabels[status]}</span>;
}

export function ContentLibrary() {
  const { workspace } = useSession();
  const [search, setSearch] = useState("");
  const workspaceId = workspace?.id ?? "";
  const videosQuery = useVideos(workspaceId);
  const assetsQuery = useMediaAssets(workspaceId);
  const error = videosQuery.error ?? assetsQuery.error;

  const items = useMemo<LibraryItem[]>(() => {
    const videos: LibraryItem[] = (videosQuery.data ?? []).map((video) => ({
      id: video.id,
      type: "video",
      createdAt: video.created_at,
      title: video.title?.trim() || "Vidéo sans titre",
      video,
    }));
    const assets: LibraryItem[] = (assetsQuery.data ?? []).map((asset) => ({
      id: asset.id,
      type: "image",
      createdAt: asset.created_at,
      title: `Image ${asset.id.slice(0, 8)}`,
      asset,
    }));
    return [...videos, ...assets].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }, [assetsQuery.data, videosQuery.data]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("fr");
    return term ? items.filter((item) => item.title.toLocaleLowerCase("fr").includes(term)) : items;
  }, [items, search]);

  const retry = () => Promise.all([videosQuery.refetch(), assetsQuery.refetch()]);

  return <section className="mt-7 overflow-hidden rounded-3xl border bg-white" aria-labelledby="recent-content-title">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5 sm:p-6"><div><h2 id="recent-content-title" className="text-xl font-black">Contenus récents</h2><p className="text-sm text-slate-500">{items.length} contenu{items.length > 1 ? "s" : ""} dans {workspace?.name ?? "le workspace actif"}</p></div><label className="flex h-10 items-center gap-2 rounded-full border bg-white px-4"><Search size={16} /><span className="sr-only">Rechercher un contenu</span><input value={search} onChange={(event) => setSearch(event.target.value)} className="w-32 bg-transparent text-sm outline-none sm:w-48" placeholder="Rechercher" /></label></div>

    {!workspace ? <div className="p-5 sm:p-6"><AsyncState kind="empty" title="Aucun workspace" description="Créez ou rejoignez un workspace pour ajouter des contenus." /></div>
      : (videosQuery.isPending || assetsQuery.isPending) ? <div className="p-5 sm:p-6"><ContentSkeleton rows={4} /></div>
      : error ? <div className="p-5 sm:p-6"><AsyncState kind="error" description={error instanceof Error ? error.message : "La bibliothèque n’a pas pu être chargée."} action={<button type="button" onClick={retry} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-black text-white">Réessayer</button>} /></div>
      : items.length === 0 ? <div className="p-5 sm:p-6"><AsyncState kind="empty" title="Votre bibliothèque est vide" description="Ajoutez une vidéo, une image ou importez une URL pour commencer." /></div>
      : filteredItems.length === 0 ? <div className="p-5 sm:p-6"><AsyncState kind="empty" title="Aucun résultat" description={`Aucun contenu ne correspond à « ${search.trim()} ».`} action={<button type="button" onClick={() => setSearch("")} className="rounded-full border bg-white px-5 py-2 text-sm font-black text-slate-900">Effacer la recherche</button>} /></div>
      : <div className="divide-y">{filteredItems.map((item) => <article key={`${item.type}-${item.id}`} className="grid grid-cols-[48px_1fr] items-center gap-3 p-4 transition hover:bg-slate-50 sm:grid-cols-[56px_1fr_130px] sm:gap-5 sm:px-6">
        <span className={`grid h-12 w-12 place-items-center rounded-xl ${item.type === "video" ? "bg-slate-900 text-white" : "bg-violet-50 text-violet-700"}`}>{item.type === "video" ? <Film size={20} /> : <FileImage size={20} />}</span>
        <div className="min-w-0"><h3 className="truncate font-black">{item.title}</h3><p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500"><Clock3 size={12} />{formatDate(item.createdAt)}{item.type === "video" && formatDuration(item.video.duration_seconds) && <><span aria-hidden="true">·</span><span>{formatDuration(item.video.duration_seconds)}</span></>}{item.type === "image" && item.asset.width && item.asset.height && <><span aria-hidden="true">·</span><span>{item.asset.width} × {item.asset.height}</span></>}</p>{item.type === "video" && item.video.status === "failed" && item.video.error_message && <p className="mt-1 line-clamp-1 text-xs text-red-600" title={item.video.error_message}>{item.video.error_message}</p>}</div>
        <div className="col-start-2 sm:col-start-3 sm:row-start-1">{item.type === "video" ? <VideoStatusBadge status={item.video.status} /> : <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">Image</span>}</div>
      </article>)}</div>}
  </section>;
}
