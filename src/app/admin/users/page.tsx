import { Users } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";

export default function AdminUsers() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <Header title="Utilisateurs" text="Recherchez, examinez et administrez les comptes."/>
      <div className="mt-8">
        <AsyncState
          kind="empty"
          title="Module non connecté"
          description="L’API ne fournit pas encore d’endpoint d’administration des comptes utilisateurs (liste plateforme, suspension, export). Ce module s’affichera dès qu’un endpoint administrateur sera disponible."
          action={
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-black text-white"
            >
              Voir la documentation API
            </a>
          }
        />
      </div>
    </div>
  );
}

function Header({ title, text }: { title: string; text: string }) {
  return (
    <header>
      <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[.15em] text-red-600"><Users size={15}/> Administration</p>
      <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">{title}</h1>
      <p className="mt-2 text-slate-500">{text}</p>
    </header>
  );
}
