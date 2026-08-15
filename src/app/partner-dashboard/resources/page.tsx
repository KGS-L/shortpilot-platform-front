"use client";

import { useState } from "react";
import { Check, Copy, FileText, ImageIcon, Lightbulb, Megaphone, Video } from "lucide-react";

const resources = [
  { title: "Kit de marque Omnelyo", type: "Logos et couleurs", icon: ImageIcon },
  { title: "Présentation produit", type: "PDF · 8 pages", icon: FileText },
  { title: "Démonstration courte", type: "Vidéo · 45 secondes", icon: Video },
  { title: "Guide des bonnes pratiques", type: "PDF · Communication", icon: Lightbulb },
];

const messages = [
  "Je transforme désormais un tournage en plusieurs contenus avec Omnelyo. Mon code partenaire vous offre une réduction sur votre premier mois.",
  "Vous créez des vidéos mais manquez de temps pour les publier partout ? Voici l’outil que j’utilise et pourquoi.",
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          setCopied(false);
        }
      }}
      className="flex items-center gap-2 text-xs font-black"
    >
      {copied ? <Check size={14} className="text-lime-600"/> : <Copy size={14}/>} {copied ? "Copié" : label}
    </button>
  );
}

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-orange-500">Ressources</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Parlez de Omnelyo avec justesse.</h1>
        <p className="mt-2 text-slate-500">Visuels, messages et conseils prêts à adapter à votre voix.</p>
      </header>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {resources.map(({ title, type, icon: Icon }) => (
          <article key={title} className="flex items-center gap-4 rounded-3xl border bg-white p-5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-50 text-orange-600"><Icon/></span>
            <div className="flex-1">
              <h2 className="font-black">{title}</h2>
              <p className="text-sm text-slate-500">{type}</p>
            </div>
          </article>
        ))}
      </section>
      <p className="mt-3 text-xs text-slate-400">Les fichiers définitifs seront mis à disposition avant le lancement officiel du programme.</p>

      <section className="mt-6 rounded-3xl border bg-white p-6">
        <div className="flex items-center gap-3">
          <Megaphone className="text-lime-600"/>
          <div>
            <h2 className="text-xl font-black">Messages suggérés</h2>
            <p className="text-sm text-slate-500">À personnaliser : votre recommandation doit rester authentique.</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {messages.map((text) => (
            <div key={text} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-600">{text}</p>
              <div className="mt-3"><CopyButton text={text} label="Copier"/></div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 rounded-3xl bg-lime-50 p-6">
        <h2 className="font-black text-lime-900">Règle essentielle</h2>
        <p className="mt-2 text-sm leading-6 text-lime-900/75">
          Indiquez clairement votre relation avec Omnelyo et n’annoncez jamais de revenus garantis. Une recommandation transparente protège votre audience et votre crédibilité.
        </p>
      </div>
    </div>
  );
}
