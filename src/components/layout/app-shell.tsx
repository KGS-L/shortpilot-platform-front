"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Bell, ChevronDown } from "lucide-react";
import { MobileNavigation, Sidebar, type Space } from "./sidebar";
import { SessionGate } from "@/features/auth/session-gate";

const labels={user:"Espace créateur",partner:"Espace partenaire",admin:"Administration"};
export function AppShell({space,children}:{space:Space;children:ReactNode}) {
  return <SessionGate space={space}>{session=><div className="flex min-h-screen bg-[#f5f7fb]">
    <Sidebar space={space}/>
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/90 px-4 backdrop-blur sm:px-5 md:px-8">
        <div className="flex items-center gap-3"><MobileNavigation space={space}/><Link href="/" className="font-black lg:hidden">Omnelyo</Link><span className="hidden text-sm font-semibold text-slate-500 sm:block">{labels[space]}</span></div>
        <div className="flex items-center gap-2 sm:gap-3"><button aria-label="Notifications" className="grid h-9 w-9 place-items-center rounded-full border bg-white"><Bell size={17}/></button><button className="flex items-center gap-2 rounded-full border bg-white py-1 pl-1 pr-2 text-sm font-bold sm:pr-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-orange-100 text-orange-700">{(session.user.display_name??session.user.email).slice(0,2).toUpperCase()}</span><span className="hidden max-w-40 truncate sm:inline">{session.user.display_name??session.user.email}</span><ChevronDown size={14}/></button></div>
      </header>
      <main className="p-4 sm:p-5 md:p-8 lg:p-10">{children}</main>
    </div>
  </div>}</SessionGate>;
}
