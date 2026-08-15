"use client";

import { useState } from "react";
import { Check, CircleDollarSign, CreditCard, Gift, LoaderCircle, Sparkles } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";
import { useSession } from "@/features/auth/session-gate";
import { useBillingPortal, useCheckout, useCreditHistory, useCreditSummary, usePlans, purchaseCodeForPlan } from "@/features/billing";
import { formatDate, formatDateTime } from "@/lib/format";

const entryLabels: Record<string, string> = {
  grant: "Crédits offerts",
  purchase: "Achat",
  consume: "Consommation",
  refund: "Remboursement",
  expiry: "Expiration",
};

export default function BillingPage() {
  const { workspace } = useSession();
  const workspaceId = workspace?.id ?? "";
  const creditsQuery = useCreditSummary(workspaceId);
  const historyQuery = useCreditHistory(workspaceId);
  const plansQuery = usePlans();
  const checkoutMutation = useCheckout(workspaceId);
  const portalMutation = useBillingPortal(workspaceId);

  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const credits = creditsQuery.data ?? null;
  const creditsUsedPercent = credits && credits.plan.monthly_credits > 0
    ? Math.min(100, Math.round(((credits.plan.monthly_credits - credits.balance) / credits.plan.monthly_credits) * 100))
    : 0;
  const plans = [...(plansQuery.data ?? [])].sort((a, b) => a.monthly_credits - b.monthly_credits);
  const entries = historyQuery.data ?? [];
  const busy = checkoutMutation.isPending || portalMutation.isPending;
  const mutationError = checkoutMutation.error ?? portalMutation.error;

  const pendingCode = checkoutMutation.isPending ? checkoutMutation.variables?.purchase_code : null;

  return (
    <div className="mx-auto max-w-7xl">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-lime-700">Facturation</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Votre plan, sans surprise.</h1>
        <p className="mt-2 text-slate-500">Suivez vos crédits, votre abonnement et vos paiements.</p>
      </header>

      {creditsQuery.isPending ? (
        <div className="mt-8"><AsyncState kind="loading" description="Chargement de votre abonnement et de vos crédits…"/></div>
      ) : creditsQuery.error ? (
        <div className="mt-8">
          <AsyncState
            kind="error"
            description={creditsQuery.error instanceof Error ? creditsQuery.error.message : "Chargement impossible."}
            action={<button onClick={() => creditsQuery.refetch()} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-black text-white">Réessayer</button>}
          />
        </div>
      ) : (
        <section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-3xl bg-[#172033] p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-lime-400">PLAN {credits ? credits.plan.name.toUpperCase() : "—"}</p>
                <p className="mt-2 text-3xl font-black">{credits ? `${credits.plan.monthly_credits} crédits` : "—"}</p>
              </div>
              <CreditCard/>
            </div>
            <div className="mt-7">
              <div className="flex justify-between text-sm">
                <span>Crédits utilisés</span>
                <span className="font-black">{credits ? `${credits.plan.monthly_credits - credits.balance} / ${credits.plan.monthly_credits}` : "—"}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-lime-400"
                  style={{ width: `${creditsUsedPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Période en cours jusqu’au {credits ? formatDate(credits.period_end) : "—"}
              </p>
            </div>
            <button
              disabled={busy}
              onClick={() => portalMutation.mutate()}
              className="mt-6 rounded-full bg-white/10 px-5 py-2.5 text-sm font-black disabled:opacity-50"
            >
              Gérer mon abonnement
            </button>
          </div>
          <div className="rounded-3xl border bg-white p-6">
            <Gift className="text-orange-500"/>
            <h2 className="mt-4 text-xl font-black">Vous avez un code promo ?</h2>
            <div className="mt-4 flex gap-2">
              <input
                value={promo}
                onChange={(event) => { setPromo(event.target.value.toUpperCase()); setPromoApplied(false); }}
                className="min-w-0 flex-1 rounded-xl border px-3 text-sm uppercase outline-none focus:ring-2 focus:ring-lime-400"
                placeholder="CODE10"
              />
              <button
                onClick={() => promo.trim().length >= 3 && setPromoApplied(true)}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white"
              >
                Appliquer
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {promoApplied ? "Le code sera transmis au paiement pour validation." : "Le code sera vérifié par le fournisseur de paiement."}
            </p>
          </div>
        </section>
      )}

      <section className="mt-6">
        <h2 className="text-2xl font-black">Changer de plan</h2>
        {plansQuery.isPending ? (
          <div className="mt-4"><AsyncState kind="loading" description="Chargement des plans…"/></div>
        ) : plansQuery.error ? (
          <div className="mt-4"><AsyncState kind="error" description="Les plans sont indisponibles pour le moment."/></div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => {
              const isCurrent = credits?.plan.code === plan.code;
              const purchaseCode = purchaseCodeForPlan(plan);
              return (
                <article key={plan.code} className={`rounded-3xl border p-6 ${isCurrent ? "border-lime-500 bg-lime-50" : "bg-white"}`}>
                  <div className="flex justify-between">
                    <h3 className="text-xl font-black">{plan.name}</h3>
                    {isCurrent && <span className="rounded-full bg-lime-600 px-3 py-1 text-xs font-black text-white">Actuel</span>}
                  </div>
                  <p className="mt-5 text-3xl font-black">{plan.monthly_credits}<span className="text-xs font-normal text-slate-500"> créations / mois</span></p>
                  <ul className="mt-5 space-y-2">
                    <li className="flex gap-2 text-sm"><Check size={16} className="text-lime-600"/>{plan.social_connections_limit} connexions sociales</li>
                    <li className="flex gap-2 text-sm"><Check size={16} className="text-lime-600"/>{plan.publications_monthly_limit} publications / mois</li>
                    <li className="flex gap-2 text-sm"><Check size={16} className="text-lime-600"/>{Math.round(plan.source_minutes_monthly_limit / 60)} h de source / mois</li>
                    <li className="flex gap-2 text-sm"><Check size={16} className="text-lime-600"/>{plan.retention_days} jours de conservation</li>
                  </ul>
                  {purchaseCode ? (
                    <button
                      disabled={isCurrent || busy}
                      onClick={() => checkoutMutation.mutate({ purchase_code: purchaseCode, promo_code: promoApplied && promo.trim().length >= 3 ? promo.trim() : undefined })}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border bg-white py-2.5 text-sm font-black disabled:text-slate-400"
                    >
                      {pendingCode === purchaseCode && <LoaderCircle size={15} className="animate-spin"/>}
                      {isCurrent ? "Plan actuel" : "Choisir ce plan"}
                    </button>
                  ) : (
                    <button disabled className="mt-6 w-full rounded-full border bg-white py-2.5 text-sm font-black text-slate-400">Plan de démarrage</button>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black">Historique des crédits</h2>
            <p className="text-sm text-slate-500">Chaque mouvement de la période en cours.</p>
          </div>
          <CircleDollarSign/>
        </div>
        {historyQuery.isPending ? (
          <div className="mt-5"><AsyncState kind="loading" description="Chargement de l’historique…"/></div>
        ) : historyQuery.error ? (
          <div className="mt-5"><AsyncState kind="error" description="Historique indisponible."/></div>
        ) : entries.length === 0 ? (
          <div className="mt-5"><AsyncState kind="empty" title="Aucun mouvement" description="Vos achats et consommations de crédits apparaîtront ici."/></div>
        ) : (
          <div className="mt-5 divide-y">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-4 text-sm">
                <div>
                  <p className="font-bold">{entryLabels[entry.entry_type] ?? entry.entry_type}</p>
                  <p className="text-slate-500">{entry.description ?? "—"} · {formatDateTime(entry.created_at)}</p>
                </div>
                <span className={`font-black ${entry.amount >= 0 ? "text-lime-700" : "text-red-600"}`}>
                  {entry.amount >= 0 ? "+" : ""}{entry.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {mutationError && (
        <p role="alert" className="mt-4 flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
          <Sparkles size={15}/> {mutationError instanceof Error ? mutationError.message : "Le paiement est indisponible."}
        </p>
      )}
    </div>
  );
}
