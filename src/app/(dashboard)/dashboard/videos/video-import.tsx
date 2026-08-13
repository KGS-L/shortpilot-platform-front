"use client";
import { useRef, useState } from "react";
import { Bot, CheckCircle2, FileVideo, ImageIcon, Link2, UploadCloud, X } from "lucide-react";

type Source="file"|"url"|"telegram";
const tabs=[{id:"file" as const,label:"Fichier",icon:UploadCloud},{id:"url" as const,label:"Lien",icon:Link2},{id:"telegram" as const,label:"Telegram",icon:Bot}];

export function VideoImport(){
  const [source,setSource]=useState<Source>("file");
  const [file,setFile]=useState<File|null>(null);
  const input=useRef<HTMLInputElement>(null);
  return <section className="rounded-3xl border bg-white p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 className="text-xl font-black">Ajouter un contenu</h2><p className="mt-1 text-sm text-slate-500">Vidéo, image ou lien : partez de ce que vous avez.</p></div>
      <div className="flex rounded-full bg-slate-100 p-1">{tabs.map(({id,label,icon:Icon})=><button key={id} onClick={()=>setSource(id)} className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition sm:px-4 ${source===id?"bg-white text-slate-900 shadow-sm":"text-slate-500"}`}><Icon size={15}/><span className="hidden sm:inline">{label}</span></button>)}</div>
    </div>
    {source==="file"&&<div className="mt-5">{file?<div className="flex items-center gap-4 rounded-2xl border bg-lime-50 p-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-lime-100 text-lime-700">{file.type.startsWith("image/")?<ImageIcon/>:<FileVideo/>}</span><div className="min-w-0 flex-1"><p className="truncate font-bold">{file.name}</p><p className="text-xs text-slate-500">{(file.size/1024/1024).toFixed(1)} Mo · prêt à ajouter</p></div><button aria-label="Retirer le fichier" onClick={()=>setFile(null)}><X size={19}/></button></div>:<button onClick={()=>input.current?.click()} className="grid min-h-36 w-full place-items-center rounded-2xl border-2 border-dashed bg-slate-50 p-5 text-center transition hover:border-lime-500 hover:bg-lime-50/40"><span><UploadCloud className="mx-auto text-lime-600" size={30}/><span className="mt-2 block font-black">Déposez votre contenu ici</span><span className="mt-1 block text-xs text-slate-500">Vidéo MP4, MOV, WebM · Image JPG ou PNG</span></span></button>}<input ref={input} hidden type="file" accept="video/mp4,video/quicktime,video/webm,image/jpeg,image/png" onChange={event=>setFile(event.target.files?.[0]??null)}/></div>}
    {source==="url"&&<div className="mt-5 rounded-2xl bg-slate-50 p-4"><label className="text-sm font-bold">URL publique du contenu<input type="url" className="mt-2 h-11 w-full rounded-xl border bg-white px-4 outline-none focus:ring-2 focus:ring-lime-400" placeholder="https://youtube.com/watch?v=…"/></label><p className="mt-2 text-xs text-slate-500">ShortPilot vérifiera la compatibilité et vos droits d’utilisation.</p></div>}
    {source==="telegram"&&<div className="mt-5 flex items-center gap-4 rounded-2xl bg-sky-50 p-5"><Bot className="shrink-0 text-sky-600" size={30}/><div className="flex-1"><h3 className="font-black">Envoyez votre contenu depuis Telegram</h3><p className="mt-1 text-sm text-slate-600">Connectez le bot puis transférez-lui votre média.</p></div><a href="/dashboard/integrations" className="rounded-full bg-sky-600 px-4 py-2 text-xs font-black text-white">Configurer</a></div>}
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="flex items-center gap-2 text-xs text-slate-500"><CheckCircle2 size={15} className="text-lime-600"/> Rien n’est publié sans votre validation.</p><button disabled={source==="file"&&!file} className="rounded-full bg-[#172033] px-5 py-2.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-35">Continuer</button></div>
  </section>;
}
