"use client";
import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function PartnerForm() {
  const [submitted, setSubmitted] = useState(false);
  if (submitted) return <div className="rounded-[28px] bg-lime-50 p-8 text-center"><CheckCircle2 className="mx-auto text-lime-600" size={42}/><h2 className="mt-4 text-2xl font-black">Votre candidature est prête.</h2><p className="mt-3 text-slate-600">Le formulaire est validé. L’envoi définitif sera activé avec l’API de candidature partenaire.</p><button onClick={()=>setSubmitted(false)} className="mt-5 text-sm font-bold underline">Modifier mes informations</button></div>;
  return <form onSubmit={(event)=>{event.preventDefault(); setSubmitted(true);}} className="space-y-5 rounded-[32px] border bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-9">
    <div><p className="text-sm font-bold uppercase tracking-[.16em] text-orange-500">Votre candidature</p><h2 className="mt-2 text-3xl font-black">Faisons connaissance.</h2></div>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Prénom et nom" name="name" placeholder="Amina Diallo"/><Field label="Adresse e-mail" name="email" type="email" placeholder="amina@exemple.com"/></div>
    <Field label="Nom public ou marque" name="brand" placeholder="Amina Créative"/>
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Votre principal réseau" name="network" placeholder="YouTube, TikTok…"/><Field label="Taille de votre audience" name="audience" placeholder="Ex. 25 000"/></div>
    <Field label="Lien vers votre profil" name="profile_url" type="url" placeholder="https://…"/>
    <label className="block text-sm font-bold">Pourquoi souhaitez-vous nous rejoindre ?<textarea required name="motivation" rows={4} className="mt-2 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-lime-400" placeholder="Parlez-nous de votre audience et de vos idées…"/></label>
    <label className="flex items-start gap-3 text-xs leading-5 text-slate-500"><input required type="checkbox" className="mt-1 accent-lime-600"/>J’accepte que Omnelyo utilise ces informations pour étudier et répondre à ma candidature.</label>
    <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#172033] px-6 py-4 font-black text-white">Envoyer ma candidature <ArrowRight size={18}/></button>
  </form>;
}
function Field({label,name,type="text",placeholder}:{label:string;name:string;type?:string;placeholder:string}) { return <label className="block text-sm font-bold">{label}<input required name={name} type={type} className="mt-2 h-12 w-full rounded-2xl border bg-slate-50 px-4 font-normal outline-none focus:ring-2 focus:ring-lime-400" placeholder={placeholder}/></label>; }
