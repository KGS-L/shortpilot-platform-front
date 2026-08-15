"use client";

import { Bell, Gauge, ShieldCheck, TriangleAlert } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";
import { usePlans } from "@/features/billing";
import { formatBytes } from "@/lib/format";

export default function AdminSettings() {
  const plansQuery = usePlans();

  return (
    <div className="mx-auto max-w-5xl">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-red-600">Configuration</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Paramètres administratifs.</h1>
        <p className="mt-2 text-slate-500">Consultez les garde-fous appliqués par la plateforme.</p>
      </header>

      <div className="mt-8 space-y-5">
        <Section icon={Gauge} title="Limites opérationnelles (par plan)">
          {plansQuery.isPending ? (
            <AsyncState kind="loading" description="Chargement des limites…"/>
          ) : plansQuery.error ? (
            <AsyncState kind="error" description="Les limites ne peuvent pas être chargées depuis l’API."/>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs font-black uppercase tracking-wide text-slate-400">
                    <th className="p-3">Plan</th>
                    <th className="p-3">Jobs simultanés</th>
                    <th className="p-3">Crédits / mois</th>
                    <th className="p-3">Publications / mois</th>
                    <th className="p-3">Stockage</th>
                    <th className="p-3">Rétention</th>
                  </tr>
                </thead>
                <tbody>
                  {plansQuery.data?.map((plan) => (
                    <tr key={plan.code} className="border-b last:border-0">
                      <td className="p-3 font-black">{plan.name}</td>
                      <td className="p-3">{plan.concurrent_jobs_limit}</td>
                      <td className="p-3">{plan.monthly_credits}</td>
                      <td className="p-3">{plan.publications_monthly_limit}</td>
                      <td className="p-3">{formatBytes(plan.storage_bytes_limit)}</td>
                      <td className="p-3">{plan.retention_days} jours</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400">Ces valeurs sont définies côté serveur et ne sont pas modifiables depuis cette interface.</p>
        </Section>

        <Section icon={Bell} title="Alertes internes">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Les alertes opérationnelles (échec fournisseur de paiement, taux d’échec des jobs, quota de stockage) ne sont pas encore
            exposées par l’API. Aucune alerte ne peut être configurée depuis cette page.
          </div>
        </Section>

        <Section icon={ShieldCheck} title="Sécurité">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="font-bold">Les secrets ne sont jamais affichés ici</p>
            <p className="mt-1 text-sm text-slate-500">Les clés OAuth, paiement et chiffrement restent dans le gestionnaire de secrets de l’environnement.</p>
          </div>
        </Section>

        <div className="flex gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-900">
          <TriangleAlert className="shrink-0" size={19}/>
          <p>La modification de quotas et de règles du programme partenaire nécessitera des endpoints d’administration dédiés, avec confirmation et journal d’audit.</p>
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof Gauge; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-white p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-600"><Icon size={19}/></span>
        <h2 className="text-xl font-black">{title}</h2>
      </div>
      {children}
    </section>
  );
}
