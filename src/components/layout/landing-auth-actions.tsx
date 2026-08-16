"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { authStorage } from "@/lib/auth-storage";

const subscribe = (onChange: () => void) => {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
};

/** Actions de navigation de la landing : bouton tableau de bord si session active. */
export function LandingAuthActions() {
  const authenticated = useSyncExternalStore(
    subscribe,
    () => Boolean(authStorage.getAccessToken()),
    () => false,
  );

  if (authenticated) {
    return (
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-full bg-[#172033] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
      >
        <LayoutDashboard size={16} /> Mon tableau de bord
      </Link>
    );
  }

  return (
    <>
      <Link href="/login" className="hidden text-sm font-semibold sm:block">Se connecter</Link>
      <Link href="/login" className="rounded-full bg-[#172033] px-5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5">Créer gratuitement</Link>
    </>
  );
}
