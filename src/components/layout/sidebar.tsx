"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BarChart3, BriefcaseBusiness, CircleDollarSign, CreditCard, Film, HeartHandshake, LayoutDashboard, LogOut, Menu, Radio, Send, Settings, ShieldCheck, Users, Workflow, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Space = "user" | "partner" | "admin";
const navigation = {
  user:["Mon espace",[["Vue d’ensemble","/dashboard",LayoutDashboard],["Contenus","/dashboard/videos",Film],["Publications","/dashboard/publications",Send],["Connexions","/dashboard/integrations",Radio],["Facturation","/dashboard/billing",CreditCard],["Analyses","/dashboard/analytics",BarChart3]]],
  partner:["Espace partenaire",[["Vue d’ensemble","/partner-dashboard",LayoutDashboard],["Mes campagnes","/partner-dashboard/campaigns",HeartHandshake],["Conversions","/partner-dashboard/conversions",BarChart3],["Commissions","/partner-dashboard/commissions",CircleDollarSign],["Versements","/partner-dashboard/payouts",CreditCard],["Ressources","/partner-dashboard/resources",BriefcaseBusiness]]],
  admin:["Administration",[["Vue d’ensemble","/admin",LayoutDashboard],["Utilisateurs","/admin/users",Users],["Partenaires","/admin/partners",HeartHandshake],["Abonnements","/admin/billing",CreditCard],["Jobs & publications","/admin/jobs",Workflow],["Santé plateforme","/admin/health",ShieldCheck],["Paramètres","/admin/settings",Settings]]],
} as const;

export function Sidebar({space,mobile=false}: {space:Space;mobile?:boolean}) {
  const pathname=usePathname(); const [label,items]=navigation[space];
  return <aside className={cn("h-screen w-64 shrink-0 overflow-y-auto border-r bg-white p-5",mobile?"flex flex-col":"sticky top-0 hidden lg:flex lg:flex-col")}><Link href="/" className="mb-8 block text-xl font-black tracking-tight">Short<span className="text-lime-600">Pilot</span></Link><p className="mb-3 px-3 text-[11px] font-black uppercase tracking-[.15em] text-slate-400">{label}</p><nav className="space-y-1">{items.map(([name,href,Icon])=>{const active=pathname===href;return <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",active?"bg-[#172033] text-white":"text-slate-500 hover:bg-slate-100 hover:text-slate-900")}><Icon size={18}/>{name}</Link>;})}</nav><div className="mt-auto rounded-2xl bg-lime-50 p-4"><p className="text-xs font-bold text-lime-800">MODE INTERFACE</p><p className="mt-1 text-sm text-slate-600">Données de démonstration</p></div><Link href="/" className="mt-3 flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-500"><LogOut size={17}/> Quitter l’espace</Link></aside>;
}

export function MobileNavigation({space}:{space:Space}){const [open,setOpen]=useState(false);return <><button onClick={()=>setOpen(true)} aria-label="Ouvrir le menu" className="lg:hidden"><Menu/></button>{open&&<div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Fermer le menu" onClick={()=>setOpen(false)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"/><div className="relative w-64"><button aria-label="Fermer le menu" onClick={()=>setOpen(false)} className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-slate-100"><X size={17}/></button><Sidebar space={space} mobile/></div></div>}</>}
