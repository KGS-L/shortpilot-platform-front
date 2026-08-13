import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return <main className="grid min-h-screen place-items-center p-5"><section className="w-full max-w-md rounded-3xl border bg-surface p-8 shadow-xl shadow-slate-900/5"><p className="text-sm font-bold text-brand-strong">SHORTPILOT</p><h1 className="mt-3 text-3xl font-black">Connexion</h1><p className="mt-2 text-muted">Recevez un code sécurisé par e-mail.</p><form className="mt-8 space-y-4"><label className="block text-sm font-semibold">Adresse e-mail<input type="email" className="mt-2 h-11 w-full rounded-xl border bg-white px-3 outline-none focus:ring-2 focus:ring-brand" placeholder="vous@exemple.com"/></label><Button className="w-full" type="submit">Recevoir mon code</Button></form></section></main>;
}
