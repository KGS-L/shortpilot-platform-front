"use client";

import { AlertCircle, CircleDollarSign } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";
import { usePlans } from "@/features/billing";
import { formatBytes } from "@/lib/format";

export default function AdminBilling() {
  const plansQuery = usePlans();

  return (
    <div className="mx-auto max-w-[1500px]">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-red-600">Administration</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Facturation et abonnements.</h1>
        <p className="mt-2 text-slate-500">Catalogue des plans actifs et état du module de paiement.</p>
      </header>

      <section className="mt-6 overflow-hidden rounded-3xl border bg-white">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-black">Catalogue des plans</h2>
          <CircleDollarSign className="text-slate-400"/>
        </div>
        {plansQuery.isPending ? (
          <div className="p-6"><AsyncState kind="loading" description="Chargement du catalogue…"/></div>
        ) : plansQuery.error ? (
          <div className="p-6"><AsyncState kind="error" description="Le catalogue des plans est indisponible."/></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs font-black uppercase tracking-wide text-slate-400">
                  <th className="p-4">Plan</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Crédits / mois</th>
                  <th className="p-4">Connexions</th>
                  <th className="p-4">Publications / mois</th>
                  <th className="p-4">Minutes source</th>
                  <th className="p-4">Stockage</th>
                </tr>
              </thead>
              <tbody>
                {plansQuery.data?.map((plan) => (
                  <tr key={plan.code} className="border-b last:border-0">
                    <td className="p-4 font-black">{plan.name}</td>
                    <td className="p-4"><code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{plan.code}</code></td>
                    <td className="p-4 font-bold">{plan.monthly_credits}</td>
                    <td className="p-4">{plan.social_connections_limit}</td>
                    <td className="p-4">{plan.publications_monthly_limit}</td>
                    <td className="p-4">{plan.source_minutes_monthly_limit}</td>
                    <td className="p-4">{formatBytes(plan.storage_bytes_limit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl border bg-white p-6">
        <AlertCircle className="text-orange-500"/>
        <h2 className="mt-4 text-xl font-black">Revenus et paiements</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          L’API n’expose pas encore d’endpoint de reporting financier (MRR, historique des paiements, webhooks en attente).
          Les transactions sont traitées par Dodo Payments et MoneyFusion puis enregistrées côté serveur ; leur consultation
          nécessitera un endpoint administrateur dédié.
        </p>
      </section>
    </div>
  );
}
