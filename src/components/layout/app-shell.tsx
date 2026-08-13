import type { ReactNode } from "react";
import Link from "next/link";
import { Bell, ChevronDown, Menu } from "lucide-react";
import { Sidebar, type Space } from "./sidebar";

const labels={user:"Espace créateur",partner:"Espace partenaire",admin:"Administration"};
export function AppShell({space,children}:{space:Space;children:ReactNode}) {
  return <div className="flex min-h-screen bg-[#f5f7fb]"><Sidebar space={space}/><div className="min-w-0 flex-1"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/90 px-5 backdrop-blur md:px-8"><div className="flex items-center gap-3"><button aria-label="Ouvrir le menu" className="lg:hidden"><Menu/></button><Link href="/" className="font-black lg:hidden">Short<span className="text-lime-600">Pilot</span></Link><span className="hidden text-sm font-semibold text-slate-500 sm:block">{labels[space]}</span></div><div className="flex items-center gap-3"><button aria-label="Notifications" className="grid h-9 w-9 place-items-center rounded-full border bg-white"><Bell size={17}/></button><button className="flex items-center gap-2 rounded-full border bg-white py-1 pl-1 pr-3 text-sm font-bold"><span className="grid h-8 w-8 place-items-center rounded-full bg-orange-100 text-orange-700">JD</span><span className="hidden sm:inline">Jonas Demo</span><ChevronDown size={14}/></button></div></header><main className="p-5 md:p-8 lg:p-10">{children}</main></div></div>;
}
