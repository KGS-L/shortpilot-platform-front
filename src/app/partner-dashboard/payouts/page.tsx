import { AsyncState } from "@/components/ui/async-state";

export default function PayoutsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-orange-500">Versements</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Recevez vos gains.</h1>
        <p className="mt-2 text-slate-500">Choisissez un moyen de versement et suivez vos demandes.</p>
      </header>
      <div className="mt-8">
        <AsyncState
          kind="empty"
          title="Versements indisponibles"
          description="Le solde, les coordonnées bancaires et l’historique des versements nécessitent les endpoints du programme partenaire, qui ne sont pas encore exposés par l’API. Aucune demande ne peut être envoyée actuellement."
        />
      </div>
    </div>
  );
}
