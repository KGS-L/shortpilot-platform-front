import { Button } from "@/components/ui/button";

const stats = [["Crédits disponibles","—"],["Vidéos ce mois","—"],["Publications","—"],["Connexions actives","—"]];

export default function DashboardPage() {
  return <div className="mx-auto max-w-6xl"><header className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-1 text-sm font-semibold text-brand-strong">ESPACE DE TRAVAIL</p><h1 className="text-3xl font-black tracking-tight md:text-4xl">Bonjour, prêt à créer ?</h1><p className="mt-2 text-muted">Transformez une source en contenus prêts à publier.</p></div><Button>Importer une vidéo</Button></header><section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label,value])=><article key={label} className="rounded-2xl border bg-surface p-5"><p className="text-sm text-muted">{label}</p><p className="mt-3 text-3xl font-black">{value}</p></article>)}</section><section className="mt-7 rounded-2xl border bg-surface p-6"><h2 className="text-lg font-bold">Activité récente</h2><div className="mt-8 rounded-xl border border-dashed p-10 text-center text-sm text-muted">Les données apparaîtront après la connexion à l’API.</div></section></div>;
}
