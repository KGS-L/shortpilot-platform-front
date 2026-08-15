import { AsyncState } from "@/components/ui/async-state";

export default function CampaignsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-orange-500">Acquisition</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Vos campagnes partenaires.</h1>
        <p className="mt-2 text-slate-500">Créez des liens distincts pour comprendre ce qui convertit.</p>
      </header>
      <div className="mt-8">
        <AsyncState
          kind="empty"
          title="Campagnes indisponibles"
          description="La gestion des campagnes et des liens de suivi (clics, ventes attribuées) nécessite les endpoints du programme partenaire, qui ne sont pas encore exposés par l’API."
        />
      </div>
    </div>
  );
}
