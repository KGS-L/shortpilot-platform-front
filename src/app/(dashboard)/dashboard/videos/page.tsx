import { ContentLibrary } from "./content-library";
import { VideoImport } from "./video-import";

export default function ContentsPage() {
  return <div className="mx-auto max-w-7xl">
    <header><p className="text-sm font-black uppercase tracking-[.15em] text-lime-700">Bibliothèque</p><h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Tous vos contenus au même endroit.</h1><p className="mt-2 text-slate-500">Ajoutez une vidéo ou une image, puis choisissez comment elle sera transformée et publiée.</p></header>
    <div className="mt-7"><VideoImport /></div>
    <ContentLibrary />
  </div>;
}
