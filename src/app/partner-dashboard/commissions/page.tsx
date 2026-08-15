import { AsyncState } from "@/components/ui/async-state";

export default function CommissionsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-orange-500">Revenus</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Vos commissions.</h1>
        <p className="mt-2 text-slate-500">Comprenez chaque montant avant son versement.</p>
      </header>
      <div className="mt-8">
        <AsyncState
          kind="empty"
          title="Commissions indisponibles"
          description="Le journal des commissions et les soldes (disponible, en attente, versé) seront fournis par les endpoints du programme partenaire, pas encore exposés par l’API."
        />
      </div>
    </div>
  );
}
