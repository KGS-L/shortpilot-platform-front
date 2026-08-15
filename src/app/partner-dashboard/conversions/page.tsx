import { AsyncState } from "@/components/ui/async-state";

export default function ConversionsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-orange-500">Attribution</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Conversions.</h1>
        <p className="mt-2 text-slate-500">Suivez les abonnements attribués à vos recommandations.</p>
      </header>
      <div className="mt-8">
        <AsyncState
          kind="empty"
          title="Conversions indisponibles"
          description="L’historique des conversions et le taux d’attribution proviendront des endpoints du programme partenaire, pas encore disponibles dans l’API."
        />
      </div>
    </div>
  );
}
