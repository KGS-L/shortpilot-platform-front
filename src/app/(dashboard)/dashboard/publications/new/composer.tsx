"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CalendarClock, Check, Clock3, Film, Globe2, ImageIcon, MonitorPlay, Music2, Send } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";
import { useSession } from "@/features/auth/session-gate";
import { platformLabels, useConnectedChannels, type SocialPlatform } from "@/features/channels";
import {
  useBatchPublishPublications,
  useCreatePublications,
  visibilityLabels,
  type PublicationVisibility,
} from "@/features/publications";
import { useVideos } from "@/features/videos";
import { formatDuration } from "@/lib/format";

const platformIcons: Record<SocialPlatform, typeof MonitorPlay> = {
  youtube: MonitorPlay,
  tiktok: Music2,
  instagram: ImageIcon,
  facebook: Globe2,
};

const platformColors: Record<SocialPlatform, string> = {
  youtube: "bg-red-50 text-red-600",
  tiktok: "bg-slate-900 text-white",
  instagram: "bg-pink-50 text-pink-600",
  facebook: "bg-blue-50 text-blue-600",
};

export function Composer() {
  const router = useRouter();
  const { workspace } = useSession();
  const workspaceId = workspace?.id ?? "";
  const channelsQuery = useConnectedChannels(workspaceId);
  const videosQuery = useVideos(workspaceId);
  const createMutation = useCreatePublications(workspaceId);
  const batchPublishMutation = useBatchPublishPublications(workspaceId);

  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [videoId, setVideoId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<PublicationVisibility>("private");
  const [mode, setMode] = useState<"now" | "later">("later");
  const [scheduledAt, setScheduledAt] = useState("");
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const readyVideos = (videosQuery.data ?? []).filter((video) => video.status === "ready");
  const channels = channelsQuery.data ?? [];
  const active = channels.filter((channel) => selectedChannels.includes(channel.id));
  const selectedVideo = readyVideos.find((video) => video.id === videoId) ?? null;

  const toggleChannel = (id: string) =>
    setSelectedChannels((values) => values.includes(id) ? values.filter((value) => value !== id) : [...values, id]);

  const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;
  const scheduledMissing = mode === "later" && !scheduledAt;
  const canSubmit = selectedChannels.length > 0 && videoId && title.trim().length > 0 && !scheduledMissing && !createMutation.isPending && !batchPublishMutation.isPending;

  const submit = async (publishNow: boolean) => {
    if (!canSubmit) return;
    if (mode === "later" && (!scheduledDate || Number.isNaN(scheduledDate.getTime()) || scheduledDate.getTime() <= Date.now())) {
      setScheduleError("La date de publication doit être dans le futur.");
      return;
    }
    setScheduleError(null);
    const baseScheduledAt = mode === "later" && scheduledDate ? scheduledDate.toISOString() : null;
    try {
      const created = await createMutation.mutateAsync({
        video_id: videoId,
        format: "short_video",
        destinations: selectedChannels.map((channel_id) => ({
          channel_id,
          title: title.trim(),
          description: description.trim() || null,
          visibility,
          scheduled_at: publishNow ? null : baseScheduledAt,
        })),
      });
      if (publishNow && created.length) {
        await batchPublishMutation.mutateAsync(created.map((publication) => publication.id));
      }
      router.push("/dashboard/publications");
    } catch {
      // Les erreurs sont affichées via les mutations ci-dessous.
    }
  };

  const mutationError = createMutation.error ?? batchPublishMutation.error;
  const loading = channelsQuery.isPending || videosQuery.isPending;

  return (
    <div className="mx-auto max-w-[1400px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/dashboard/publications" className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft size={16}/> Retour aux publications</Link>
          <p className="text-sm font-black uppercase tracking-[.15em] text-lime-700">Nouvelle publication</p>
          <h1 className="mt-1 text-3xl font-black tracking-[-.04em] md:text-4xl">Préparez chaque destination.</h1>
          <p className="mt-2 text-sm text-slate-500">Un contenu commun, une publication adaptée par réseau.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => submit(mode === "now")}
            disabled={!canSubmit}
            className="flex items-center gap-2 rounded-full bg-[#172033] px-5 py-3 text-sm font-black text-white disabled:opacity-40"
          >
            <Send size={16}/>
            {mode === "now" ? "Publier maintenant" : "Programmer"}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="mt-7"><AsyncState kind="loading" description="Chargement de vos chaînes et vidéos…"/></div>
      ) : (
        <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_390px]">
          <div className="space-y-5">
            <section className="rounded-3xl border bg-white p-5 sm:p-6">
              <h2 className="text-lg font-black">1. Choisissez les réseaux</h2>
              <p className="mt-1 text-sm text-slate-500">Une publication distincte sera créée pour chaque chaîne active.</p>
              {channels.length === 0 ? (
                <div className="mt-5">
                  <AsyncState
                    kind="empty"
                    title="Aucune chaîne connectée"
                    description="Connectez au moins un réseau social pour pouvoir publier."
                    action={<Link href="/dashboard/integrations" className="inline-block rounded-full bg-[#172033] px-5 py-2 text-sm font-black text-white">Gérer les connexions</Link>}
                  />
                </div>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {channels.map((channel) => {
                    const checked = selectedChannels.includes(channel.id);
                    const Icon = platformIcons[channel.platform];
                    return (
                      <button
                        key={channel.id}
                        onClick={() => toggleChannel(channel.id)}
                        className={`flex items-center gap-3 rounded-2xl border p-3 text-left ${checked ? "border-lime-500 bg-lime-50" : "hover:bg-slate-50"}`}
                      >
                        <span className={`grid h-10 w-10 place-items-center rounded-xl ${platformColors[channel.platform]}`}><Icon size={20}/></span>
                        <span className="flex-1">
                          <span className="block font-black">{platformLabels[channel.platform]}</span>
                          <span className="block text-xs text-slate-500">{channel.name}{channel.handle ? ` · ${channel.handle}` : ""}</span>
                        </span>
                        <span className={`grid h-5 w-5 place-items-center rounded-full border ${checked ? "border-lime-600 bg-lime-600 text-white" : ""}`}>
                          {checked && <Check size={12}/>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-3xl border bg-white p-5 sm:p-6">
              <h2 className="text-lg font-black">2. Choisissez la vidéo</h2>
              <p className="mt-1 text-sm text-slate-500">Seules les vidéos prêtes peuvent être publiées.</p>
              {readyVideos.length === 0 ? (
                <div className="mt-5">
                  <AsyncState
                    kind="empty"
                    title="Aucune vidéo prête"
                    description="Importez une vidéo et attendez la fin du traitement."
                    action={<Link href="/dashboard/videos" className="inline-block rounded-full bg-[#172033] px-5 py-2 text-sm font-black text-white">Aller à la bibliothèque</Link>}
                  />
                </div>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {readyVideos.map((video) => {
                    const checked = video.id === videoId;
                    return (
                      <button
                        key={video.id}
                        onClick={() => setVideoId(video.id)}
                        className={`flex items-center gap-3 rounded-2xl border p-3 text-left ${checked ? "border-lime-500 bg-lime-50" : "hover:bg-slate-50"}`}
                      >
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100"><Film size={19}/></span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-black">{video.title?.trim() || "Vidéo sans titre"}</span>
                          <span className="block text-xs text-slate-500">
                            {formatDuration(video.duration_seconds) ? `${formatDuration(video.duration_seconds)} · ` : ""}{video.kind === "clip" ? "Clip" : "Vidéo source"}
                          </span>
                        </span>
                        <span className={`grid h-5 w-5 place-items-center rounded-full border ${checked ? "border-lime-600 bg-lime-600 text-white" : ""}`}>
                          {checked && <Check size={12}/>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-3xl border bg-white p-5 sm:p-6">
              <h2 className="text-lg font-black">3. Rédigez le message</h2>
              <div className="mt-5 space-y-4">
                <label className="block text-sm font-bold">
                  Titre
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={255}
                    className="mt-2 h-12 w-full rounded-2xl border bg-slate-50 px-4 font-normal outline-none focus:ring-2 focus:ring-lime-400"
                    placeholder="Titre de la publication"
                  />
                </label>
                <label className="block text-sm font-bold">
                  Description
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={6}
                    className="mt-2 w-full resize-y rounded-2xl border bg-slate-50 px-4 py-3 font-normal leading-6 outline-none focus:ring-2 focus:ring-lime-400"
                    placeholder="Légende, hashtags…"
                  />
                  <span className="mt-1 block text-right text-xs font-normal text-slate-400">{description.length} caractères</span>
                </label>
                <label className="block text-sm font-bold">
                  Visibilité
                  <select
                    value={visibility}
                    onChange={(event) => setVisibility(event.target.value as PublicationVisibility)}
                    className="mt-2 h-11 w-full rounded-xl border bg-white px-3 font-normal"
                  >
                    {(Object.keys(visibilityLabels) as PublicationVisibility[]).map((key) => (
                      <option key={key} value={key}>{visibilityLabels[key]}</option>
                    ))}
                  </select>
                </label>
              </div>
            </section>

            <section className="rounded-3xl border bg-white p-5 sm:p-6">
              <h2 className="text-lg font-black">4. Choisissez le moment</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button onClick={() => setMode("now")} className={`flex items-center gap-3 rounded-2xl border p-4 text-left ${mode === "now" ? "border-lime-500 bg-lime-50" : ""}`}>
                  <Send size={19}/>
                  <span><span className="block font-black">Maintenant</span><span className="text-xs text-slate-500">Après votre confirmation</span></span>
                </button>
                <button onClick={() => setMode("later")} className={`flex items-center gap-3 rounded-2xl border p-4 text-left ${mode === "later" ? "border-lime-500 bg-lime-50" : ""}`}>
                  <CalendarClock size={19}/>
                  <span><span className="block font-black">Programmer</span><span className="text-xs text-slate-500">Choisir une date future</span></span>
                </button>
              </div>
              {mode === "later" && (
                <div className="mt-4">
                  <label className="block text-sm font-bold">
                    Date et heure de publication
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(event) => { setScheduledAt(event.target.value); setScheduleError(null); }}
                      className="mt-2 h-11 w-full rounded-xl border px-3 font-normal sm:max-w-xs"
                    />
                  </label>
                  {scheduleError && <p role="alert" className="mt-2 text-xs font-bold text-red-600">{scheduleError}</p>}
                  <p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><Clock3 size={13}/> Le fuseau horaire de votre navigateur est utilisé.</p>
                </div>
              )}
            </section>
          </div>

          <aside className="xl:sticky xl:top-24 xl:self-start">
            <section className="overflow-hidden rounded-3xl border bg-white">
              <div className="flex items-center justify-between border-b p-4">
                <div>
                  <p className="font-black">Récapitulatif</p>
                  <p className="text-xs text-slate-500">{active.length} destination{active.length > 1 ? "s" : ""}</p>
                </div>
                <div className="flex -space-x-2">
                  {active.map((channel) => {
                    const Icon = platformIcons[channel.platform];
                    return <span key={channel.id} className={`grid h-8 w-8 place-items-center rounded-full border-2 border-white ${platformColors[channel.platform]}`}><Icon size={14}/></span>;
                  })}
                </div>
              </div>
              <div className="p-4 text-sm">
                <p className="font-black">{title.trim() || "Titre de la publication"}</p>
                <p className="mt-2 text-slate-600">{description.trim() || "Aucune description."}</p>
                <p className="mt-3 text-xs text-slate-500">
                  Vidéo : {selectedVideo ? (selectedVideo.title?.trim() || "Vidéo sans titre") : "aucune vidéo sélectionnée"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {mode === "now" ? "Publication immédiate" : scheduledDate ? `Programmée : ${scheduledDate.toLocaleString("fr-FR")}` : "Date à choisir"}
                </p>
              </div>
              <div className="border-t bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-600">Avant validation</p>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-500">
                  <li className="flex gap-2"><Check size={13} className={active.length ? "text-lime-600" : "text-slate-300"}/> {active.length} chaîne{active.length > 1 ? "s" : ""} sélectionnée{active.length > 1 ? "s" : ""}</li>
                  <li className="flex gap-2"><Check size={13} className={selectedVideo ? "text-lime-600" : "text-slate-300"}/> Vidéo prête sélectionnée</li>
                  <li className="flex gap-2"><Check size={13} className={title.trim() ? "text-lime-600" : "text-slate-300"}/> Titre renseigné</li>
                </ul>
              </div>
            </section>
            {mutationError && (
              <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                {mutationError instanceof Error ? mutationError.message : "La création a échoué."}
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
