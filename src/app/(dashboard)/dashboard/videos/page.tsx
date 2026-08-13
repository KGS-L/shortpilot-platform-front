import Image from "next/image";
import Link from "next/link";
import { Clock3, FileImage, Film, MoreHorizontal, Play, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { VideoImport } from "./video-import";

const contents=[
  {title:"Podcast — Épisode 12",kind:"Vidéo",duration:"47:12",date:"Aujourd’hui",status:"Prêt",outputs:"6 clips",position:"object-left"},
  {title:"Les coulisses du lancement",kind:"Vidéo",duration:"18:04",date:"Hier",status:"Traitement 72 %",outputs:"Analyse en cours",position:"object-center"},
  {title:"Nouvelle collection",kind:"Image",duration:"JPG",date:"10 août",status:"Prêt",outputs:"1 publication",position:"object-right"},
];

export default function ContentsPage(){return <div className="mx-auto max-w-7xl">
  <header><p className="text-sm font-black uppercase tracking-[.15em] text-lime-700">Bibliothèque</p><h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Tous vos contenus au même endroit.</h1><p className="mt-2 text-slate-500">Ajoutez une vidéo ou une image, puis choisissez comment elle sera transformée et publiée.</p></header>
  <div className="mt-7"><VideoImport/></div>
  <section className="mt-7 overflow-hidden rounded-3xl border bg-white">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5 sm:p-6"><div><h2 className="text-xl font-black">Contenus récents</h2><p className="text-sm text-slate-500">3 sources · 7 contenus générés</p></div><div className="flex gap-2"><label className="flex h-10 items-center gap-2 rounded-full border bg-white px-4"><Search size={16}/><input aria-label="Rechercher un contenu" className="w-28 bg-transparent text-sm outline-none sm:w-40" placeholder="Rechercher"/></label><button aria-label="Filtrer" className="grid h-10 w-10 place-items-center rounded-full border"><SlidersHorizontal size={17}/></button></div></div>
    <div className="divide-y">{contents.map(content=><article key={content.title} className="group grid grid-cols-[72px_1fr_auto] items-center gap-3 p-3 transition hover:bg-slate-50 sm:grid-cols-[112px_1fr_140px_130px_36px] sm:gap-5 sm:px-6 sm:py-4">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-200"><Image src="/images/shortpilot-creator-story.png" alt="" fill className={`object-cover ${content.position}`}/>{content.kind==="Vidéo"&&<span className="absolute inset-0 grid place-items-center"><span className="grid h-7 w-7 place-items-center rounded-full bg-white/90"><Play size={10} fill="currentColor"/></span></span>}<span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[9px] font-bold text-white">{content.duration}</span></div>
      <div className="min-w-0"><h3 className="truncate font-black"><Link href="/dashboard/videos/demo" className="hover:text-lime-700">{content.title}</Link></h3><p className="mt-1 flex items-center gap-2 text-xs text-slate-500">{content.kind==="Vidéo"?<Film size={13}/>:<FileImage size={13}/>} {content.kind}<span>·</span><Clock3 size={12}/>{content.date}</p></div>
      <span className={`hidden w-fit rounded-full px-3 py-1 text-xs font-bold sm:block ${content.status==="Prêt"?"bg-lime-50 text-lime-700":"bg-orange-50 text-orange-700"}`}>{content.status}</span>
      <span className="hidden items-center gap-1 text-sm font-bold text-slate-600 sm:flex"><Sparkles size={14} className="text-orange-500"/>{content.outputs}</span>
      <button aria-label={`Options pour ${content.title}`} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-200"><MoreHorizontal size={19}/></button>
    </article>)}</div>
    <div className="border-t bg-slate-50 px-6 py-3 text-center text-xs font-semibold text-slate-500">Afficher plus de contenus</div>
  </section>
  <p className="mt-5 text-xs text-slate-400">Données de démonstration — vidéos et images utiliseront leurs endpoints adaptés lors du branchement API.</p>
</div>}
