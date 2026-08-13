"use client";

import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bot, CheckCircle2, FileVideo, ImageIcon, Link2, LoaderCircle, UploadCloud, X } from "lucide-react";
import { useSession } from "@/features/auth/session-gate";
import { contentApi, type UploadProgress } from "@/features/videos";
import { authStorage } from "@/lib/auth-storage";
import { queryKeys } from "@/lib/query-keys";

type Source = "file" | "url" | "telegram";
const tabs = [
  { id: "file" as const, label: "Fichier", icon: UploadCloud },
  { id: "url" as const, label: "Lien", icon: Link2 },
  { id: "telegram" as const, label: "Telegram", icon: Bot },
];

export function VideoImport() {
  const { workspace } = useSession();
  const queryClient = useQueryClient();
  const [source, setSource] = useState<Source>("file");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [success, setSuccess] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const refreshContents = async () => {
    if (!workspace) return;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.videos(workspace.id) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.contents.mediaAssets(workspace.id) }),
    ]);
  };

  const uploadMutation = useMutation({
    mutationFn: async (selectedFile: File) => {
      if (!workspace) throw new Error("Aucun workspace actif n’est disponible.");
      const token = authStorage.getAccessToken();
      if (!token) throw new Error("Votre session a expiré.");
      setProgress({ loaded: 0, total: selectedFile.size, percent: 0 });
      return contentApi.upload(workspace.id, selectedFile, token, setProgress);
    },
    onSuccess: async () => {
      setSuccess("Le contenu a bien été ajouté à votre bibliothèque.");
      setFile(null);
      setProgress(null);
      if (input.current) input.current.value = "";
      await refreshContents();
    },
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!workspace) throw new Error("Aucun workspace actif n’est disponible.");
      const token = authStorage.getAccessToken();
      if (!token) throw new Error("Votre session a expiré.");
      return contentApi.importUrl(workspace.id, url, title.trim() || null, token);
    },
    onSuccess: async () => {
      setSuccess("L’import a démarré. Le contenu apparaîtra pendant son traitement.");
      setUrl("");
      setTitle("");
      await refreshContents();
    },
  });

  const pending = uploadMutation.isPending || importMutation.isPending;
  const error = uploadMutation.error ?? importMutation.error;
  const resetFeedback = () => {
    setSuccess("");
    uploadMutation.reset();
    importMutation.reset();
  };
  const chooseSource = (nextSource: Source) => {
    setSource(nextSource);
    resetFeedback();
  };

  return <section className="rounded-3xl border bg-white p-5 sm:p-6" aria-labelledby="add-content-title">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 id="add-content-title" className="text-xl font-black">Ajouter un contenu</h2><p className="mt-1 text-sm text-slate-500">Vidéo, image ou lien : partez de ce que vous avez.</p></div>
      <div className="flex rounded-full bg-slate-100 p-1" role="tablist" aria-label="Source du contenu">{tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" role="tab" aria-selected={source === id} onClick={() => chooseSource(id)} className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition sm:px-4 ${source === id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}><Icon size={15} /><span className="hidden sm:inline">{label}</span></button>)}</div>
    </div>

    {source === "file" && <div className="mt-5">{file ? <div className="flex items-center gap-4 rounded-2xl border bg-lime-50 p-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-lime-100 text-lime-700">{file.type.startsWith("image/") ? <ImageIcon /> : <FileVideo />}</span><div className="min-w-0 flex-1"><p className="truncate font-bold">{file.name}</p><p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(1)} Mo · prêt à ajouter</p></div><button type="button" disabled={pending} aria-label="Retirer le fichier" onClick={() => { setFile(null); resetFeedback(); }}><X size={19} /></button></div> : <button type="button" onClick={() => input.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); setFile(event.dataTransfer.files[0] ?? null); resetFeedback(); }} className="grid min-h-36 w-full place-items-center rounded-2xl border-2 border-dashed bg-slate-50 p-5 text-center transition hover:border-lime-500 hover:bg-lime-50/40"><span><UploadCloud className="mx-auto text-lime-600" size={30} /><span className="mt-2 block font-black">Déposez votre contenu ici</span><span className="mt-1 block text-xs text-slate-500">Vidéo MP4, MOV, WebM · Image JPG ou PNG</span></span></button>}<input ref={input} hidden type="file" accept="video/mp4,video/quicktime,video/webm,image/jpeg,image/png" onChange={(event) => { setFile(event.target.files?.[0] ?? null); resetFeedback(); }} /></div>}

    {source === "url" && <div className="mt-5 grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2"><label className="text-sm font-bold">URL publique du contenu<input required type="url" value={url} onChange={(event) => { setUrl(event.target.value); resetFeedback(); }} className="mt-2 h-11 w-full rounded-xl border bg-white px-4 font-normal outline-none focus:ring-2 focus:ring-lime-400" placeholder="https://youtube.com/watch?v=…" /></label><label className="text-sm font-bold">Titre <span className="font-normal text-slate-400">(facultatif)</span><input value={title} maxLength={255} onChange={(event) => setTitle(event.target.value)} className="mt-2 h-11 w-full rounded-xl border bg-white px-4 font-normal outline-none focus:ring-2 focus:ring-lime-400" placeholder="Nom du contenu" /></label><p className="text-xs text-slate-500 sm:col-span-2">ShortPilot vérifiera la compatibilité, l’accès public et vos droits d’utilisation.</p></div>}

    {source === "telegram" && <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl bg-sky-50 p-5"><Bot className="shrink-0 text-sky-600" size={30} /><div className="min-w-52 flex-1"><h3 className="font-black">Envoyez votre contenu depuis Telegram</h3><p className="mt-1 text-sm text-slate-600">Connectez le bot puis transférez-lui votre média.</p></div><a href="/dashboard/integrations" className="rounded-full bg-sky-600 px-4 py-2 text-xs font-black text-white">Configurer</a></div>}

    {progress && <div className="mt-4" role="status" aria-live="polite"><div className="flex justify-between text-xs font-bold"><span>Envoi en cours</span><span>{progress.percent} %</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-lime-500 transition-[width]" style={{ width: `${progress.percent}%` }} /></div></div>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error instanceof Error ? error.message : "L’opération a échoué."}</p>}
    {success && <p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-lime-50 p-3 text-sm font-semibold text-lime-800"><CheckCircle2 size={17} />{success}</p>}

    <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 size={15} className="text-lime-600" /> Rien n’est publié sans votre validation.</p>{source !== "telegram" && <button type="button" disabled={pending || !workspace || (source === "file" ? !file : !url)} onClick={() => source === "file" && file ? uploadMutation.mutate(file) : importMutation.mutate()} className="flex items-center gap-2 rounded-full bg-[#172033] px-5 py-2.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-35">{pending && <LoaderCircle className="animate-spin" size={16} />}{pending ? "Traitement…" : source === "file" ? "Ajouter" : "Importer"}</button>}</div>
  </section>;
}
