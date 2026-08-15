"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Captions, Check, Clock3, Crop, ExternalLink, Film, LoaderCircle } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";
import { apiRequest } from "@/lib/api-client";
import { authStorage } from "@/lib/auth-storage";
import { useSession } from "@/features/auth/session-gate";
import { useVideos, type Video } from "@/features/videos";
import { formatDuration, formatRelativeTime } from "@/lib/format";

export function Studio() {
  const { workspace } = useSession();
  const workspaceId = workspace?.id ?? "";
  const videosQuery = useVideos(workspaceId);

  const clips = useMemo(
    () => (videosQuery.data ?? []).filter((video) => video.kind === "clip").sort((a, b) => (a.sequence_order ?? 0) - (b.sequence_order ?? 0)),
    [videosQuery.data],
  );
  const sourceMinutes = useMemo(() => {
    const total = (videosQuery.data ?? [])
      .filter((video) => video.kind === "source")
      .reduce((sum, video) => sum + (video.duration_seconds ?? 0), 0);
    return formatDuration(total);
  }, [videosQuery.data]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [format, setFormat] = useState("9:16");
  const [captions, setCaptions] = useState("Dynamique");
  const [opening, setOpening] = useState(false);
  const [openError, setOpenError] = useState<string | null>(null);

  const current = clips.find((clip) => clip.id === activeId) ?? clips[0] ?? null;

  const toggle = (id: string) =>
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);

  const openExcerpt = async (video: Video) => {
    setOpening(true);
    setOpenError(null);
    try {
      const { url } = await apiRequest<{ url: string }>(
        `/v1/workspaces/${workspaceId}/videos/${video.id}/download-url`,
        {},
        authStorage.getAccessToken() as string,
      );
      window.open(url, "_blank", "noreferrer");
    } catch (error) {
      setOpenError(error instanceof Error ? error.message : "Lien indisponible.");
    } finally {
      setOpening(false);
    }
  };

  if (videosQuery.isPending) {
    return <div className="mx-auto max-w-[1500px]"><AsyncState kind="loading" description="Chargement de vos clips…"/></div>;
  }
  if (videosQuery.error) {
    return (
      <div className="mx-auto mt-16 max-w-xl">
        <AsyncState
          kind="error"
          description={videosQuery.error instanceof Error ? videosQuery.error.message : "Chargement impossible."}
          action={<button onClick={() => videosQuery.refetch()} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-black text-white">Réessayer</button>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/dashboard/videos" className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft size={16}/> Bibliothèque</Link>
          <p className="text-sm font-black uppercase tracking-[.15em] text-lime-700">Studio de transformation</p>
          <h1 className="mt-1 text-3xl font-black tracking-[-.04em] md:text-4xl">Vos extraits générés</h1>
          <p className="mt-2 text-sm text-slate-500">{clips.length} clip{clips.length > 1 ? "s" : ""} · {sourceMinutes ?? "0:00"} de source au total</p>
        </div>
        <Link
          href="/dashboard/publications/new"
          className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black ${selected.length ? "bg-[#172033] text-white" : "pointer-events-none bg-slate-200 text-slate-400"}`}
        >
          Préparer {selected.length} publication{selected.length > 1 ? "s" : ""}<ArrowRight size={17}/>
        </Link>
      </header>

      {clips.length === 0 ? (
        <div className="mx-auto mt-16 max-w-xl">
          <AsyncState
            kind="empty"
            title="Aucun clip pour l’instant"
            description="Les extraits générés par les traitements apparaîtront ici dès qu’un job de découpe aboutira."
            action={<Link href="/dashboard/videos" className="inline-block rounded-full bg-[#172033] px-5 py-2 text-sm font-black text-white">Importer une vidéo</Link>}
          />
        </div>
      ) : (
        <div className="mt-7 grid gap-5 xl:grid-cols-[310px_minmax(300px,1fr)_300px]">
          <section className="order-2 overflow-hidden rounded-3xl border bg-white xl:order-1">
            <div className="border-b p-5">
              <h2 className="font-black">Extraits disponibles</h2>
              <p className="text-xs text-slate-500">Sélectionnez ceux à publier.</p>
            </div>
            <div className="max-h-[680px] divide-y overflow-y-auto">
              {clips.map((clip) => (
                <button
                  key={clip.id}
                  onClick={() => setActiveId(clip.id)}
                  className={`flex w-full gap-3 p-3 text-left transition ${current?.id === clip.id ? "bg-lime-50" : "hover:bg-slate-50"}`}
                >
                  <span
                    onClick={(event) => { event.stopPropagation(); toggle(clip.id); }}
                    className={`mt-1 grid h-5 w-5 shrink-0 place-items-center rounded border ${selected.includes(clip.id) ? "border-lime-600 bg-lime-600 text-white" : "bg-white"}`}
                  >
                    {selected.includes(clip.id) && <Check size={13}/>}
                  </span>
                  <span className="grid h-16 w-12 shrink-0 place-items-center rounded-lg bg-slate-100"><Film size={16} className="text-slate-400"/></span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 text-sm font-bold">{clip.title?.trim() || `Clip ${(clip.sequence_order ?? 0) + 1}`}</span>
                    <span className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{formatDuration(clip.duration_seconds) ?? "—"}</span>
                      <span>{formatRelativeTime(clip.created_at)}</span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="order-1 rounded-3xl bg-[#172033] p-4 xl:order-2">
            <div className="mx-auto max-w-[290px]">
              <div className={`relative overflow-hidden rounded-[28px] bg-slate-900 ${format === "9:16" ? "aspect-[9/16]" : format === "1:1" ? "aspect-square" : "aspect-[4/5]"}`}>
                <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <Film size={40} className="text-slate-600"/>
                </div>
                {current && (
                  <span className={`absolute left-3 top-3 rounded-full px-2 py-1 text-[10px] font-black ${current.status === "ready" ? "bg-lime-400 text-slate-900" : "bg-orange-400 text-slate-900"}`}>
                    {current.status === "ready" ? "Prêt" : current.status === "failed" ? "Échec" : "Traitement"}
                  </span>
                )}
              </div>
              {current && (
                <div className="mt-4 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black">{current.title?.trim() || `Clip ${(current.sequence_order ?? 0) + 1}`}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><Clock3 size={12}/>{formatDuration(current.duration_seconds) ?? "durée inconnue"}</p>
                    </div>
                    <button
                      onClick={() => openExcerpt(current)}
                      disabled={opening}
                      className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-xs font-black disabled:opacity-50"
                    >
                      {opening ? <LoaderCircle size={14} className="animate-spin"/> : <ExternalLink size={14}/>} Ouvrir
                    </button>
                  </div>
                  {openError && <p className="mt-2 text-xs text-red-300">{openError}</p>}
                  {current.error_message && <p className="mt-2 text-xs text-orange-300">{current.error_message}</p>}
                </div>
              )}
            </div>
          </section>

          <aside className="order-3 space-y-4">
            <section className="rounded-3xl border bg-white p-5">
              <div className="flex items-center gap-2"><Crop size={18} className="text-orange-500"/><h2 className="font-black">Format</h2></div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["9:16", "4:5", "1:1"].map((value) => (
                  <button key={value} onClick={() => setFormat(value)} className={`rounded-xl border px-2 py-3 text-xs font-black ${format === value ? "border-slate-900 bg-slate-900 text-white" : "bg-slate-50"}`}>{value}</button>
                ))}
              </div>
            </section>
            <section className="rounded-3xl border bg-white p-5">
              <div className="flex items-center gap-2"><Captions size={18} className="text-lime-600"/><h2 className="font-black">Sous-titres</h2></div>
              <div className="mt-4 space-y-2">
                {["Dynamique", "Minimal", "Sans sous-titres"].map((value) => (
                  <button key={value} onClick={() => setCaptions(value)} className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-bold ${captions === value ? "border-lime-500 bg-lime-50" : ""}`}>
                    {value}{captions === value && <Check size={15}/>}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">Ces réglages seront transmis aux rendus lors du lancement d’un traitement.</p>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
