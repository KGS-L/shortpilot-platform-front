"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const recipient = "partenaires@omnelyo.app";

export function PartnerForm() {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", brand: "", network: "", audience: "", profile_url: "", motivation: "" });

  if (submitted) return (
    <div className="rounded-[28px] bg-lime-50 p-8 text-center">
      <CheckCircle2 className="mx-auto text-lime-600" size={42}/>
      <h2 className="mt-4 text-2xl font-black">Votre e-mail est prêt.</h2>
      <p className="mt-3 text-slate-600">
        Votre logiciel de messagerie s’est ouvert avec votre candidature pré-remplie pour <span className="font-bold">{recipient}</span>.
        Il ne reste qu’à l’envoyer depuis votre boîte.
      </p>
      <button onClick={() => setSubmitted(false)} className="mt-5 text-sm font-bold underline">Modifier mes informations</button>
    </div>
  );

  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = `Candidature partenaire — ${values.brand || values.name}`;
    const body = [
      `Prénom et nom : ${values.name}`,
      `E-mail : ${values.email}`,
      `Marque : ${values.brand}`,
      `Réseau principal : ${values.network}`,
      `Audience : ${values.audience}`,
      `Profil : ${values.profile_url}`,
      "",
      "Motivation :",
      values.motivation,
    ].join("\n");
    window.location.assign(`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setSubmitted(true);
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded-[32px] border bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-9">
      <div><p className="text-sm font-bold uppercase tracking-[.16em] text-orange-500">Votre candidature</p><h2 className="mt-2 text-3xl font-black">Faisons connaissance.</h2></div>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Prénom et nom" name="name" value={values.name} onChange={set("name")} placeholder="Amina Diallo"/><Field label="Adresse e-mail" name="email" type="email" value={values.email} onChange={set("email")} placeholder="amina@exemple.com"/></div>
      <Field label="Nom public ou marque" name="brand" value={values.brand} onChange={set("brand")} placeholder="Amina Créative"/>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Votre principal réseau" name="network" value={values.network} onChange={set("network")} placeholder="YouTube, TikTok…"/><Field label="Taille de votre audience" name="audience" value={values.audience} onChange={set("audience")} placeholder="Ex. 25 000"/></div>
      <Field label="Lien vers votre profil" name="profile_url" type="url" value={values.profile_url} onChange={set("profile_url")} placeholder="https://…"/>
      <label className="block text-sm font-bold">Pourquoi souhaitez-vous nous rejoindre ?<textarea required name="motivation" rows={4} value={values.motivation} onChange={set("motivation")} className="mt-2 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-lime-400" placeholder="Parlez-nous de votre audience et de vos idées…"/></label>
      <label className="flex items-start gap-3 text-xs leading-5 text-slate-500"><input required type="checkbox" className="mt-1 accent-lime-600"/>J’accepte que Omnelyo utilise ces informations pour étudier et répondre à ma candidature.</label>
      <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#172033] px-6 py-4 font-black text-white">
        Envoyer ma candidature <ArrowRight size={18}/>
      </button>
      <p className="text-center text-xs text-slate-400">La candidature est envoyée depuis votre messagerie ; aucun endpoint d’API dédié n’est encore disponible.</p>
    </form>
  );
}

function Field({ label, name, type = "text", value, onChange, placeholder }: { label: string; name: string; type?: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input required name={name} type={type} value={value} onChange={onChange} className="mt-2 h-12 w-full rounded-2xl border bg-slate-50 px-4 font-normal outline-none focus:ring-2 focus:ring-lime-400" placeholder={placeholder}/>
    </label>
  );
}
