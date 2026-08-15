import { AsyncState } from "@/components/ui/async-state";

export default function AdminPartners() {
  return (
    <div className="mx-auto max-w-7xl">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-red-600">Administration</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Partenaires.</h1>
        <p className="mt-2 text-slate-500">Évaluez les candidatures et surveillez le programme.</p>
      </header>
      <div className="mt-8">
        <AsyncState
          kind="empty"
          title="Programme partenaire — API non disponible"
          description="L’API n’expose pas encore les endpoints d’administration du programme partenaire (candidatures, validations, statistiques). Les règles du programme et les commissions ne peuvent pas être consultées ici pour l’instant."
        />
      </div>
    </div>
  );
}
