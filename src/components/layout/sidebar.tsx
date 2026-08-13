import Link from "next/link";
import { BarChart3, CreditCard, Film, LayoutDashboard, Radio, Send, Users } from "lucide-react";

const items = [["Vue d’ensemble","/dashboard",LayoutDashboard],["Vidéos","/dashboard/videos",Film],["Publications","/dashboard/publications",Send],["Connexions","/dashboard/integrations",Radio],["Facturation","/dashboard/billing",CreditCard],["Partenaires","/dashboard/partners",Users],["Analyses","/dashboard/analytics",BarChart3]] as const;

export function Sidebar() {
  return <aside className="hidden min-h-screen w-64 border-r bg-surface p-5 lg:block"><Link href="/dashboard" className="mb-10 block text-xl font-black tracking-tight">Short<span className="text-brand-strong">Pilot</span></Link><nav className="space-y-1">{items.map(([label,href,Icon])=><Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted hover:bg-background hover:text-foreground"><Icon size={18}/>{label}</Link>)}</nav></aside>;
}
