"use client";

import { HeartHandshake } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";
import { useSession } from "@/features/auth/session-gate";

export default function PartnerDashboard() {
  const { user } = useSession();
  return (
    <div className="mx-auto max-w-7xl">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-orange-500">Partenaire Omnelyo</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Votre influence en chiffres.</h1>
        <p className="mt-2 text-slate-500">Suivez ce que vos recommandations construisent.</p>
      </header>
      <div className="mt-8">
        <AsyncState
          kind="empty"
          title="Statistiques partenaires indisponibles"
          description={`Bonjour ${(user.display_name ?? user.email).split(/[\s@]/)[0]} — votre compte est bien partenaire actif, mais l’API ne fournit pas encore les endpoints du programme (clics, conversions, commissions). Vos chiffres s’afficheront ici dès leur mise en service.`}
        />
      </div>
      <p className="mt-6 flex items-center gap-2 rounded-2xl bg-orange-50 p-4 text-sm text-orange-900">
        <HeartHandshake size={17} className="shrink-0"/>
        En attendant, les ressources de communication validées restent disponibles dans la section Ressources.
      </p>
    </div>
  );
}
