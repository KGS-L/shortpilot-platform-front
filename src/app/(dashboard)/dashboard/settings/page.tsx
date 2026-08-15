"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, Building2, Check, Globe2, KeyRound, LoaderCircle, Save, ShieldCheck, UserRound } from "lucide-react";
import { useSession, type Session } from "@/features/auth/session-gate";
import { useUsage } from "@/features/billing";
import { workspacesApi } from "@/features/workspaces/api";
import { authStorage } from "@/lib/auth-storage";
import { queryKeys } from "@/lib/query-keys";
import { formatBytes } from "@/lib/format";

export default function SettingsPage() {
  const { user, workspace } = useSession();
  const workspaceId = workspace?.id ?? "";
  const usageQuery = useUsage(workspaceId);
  const queryClient = useQueryClient();

  const canRename = workspace?.role === "owner" || workspace?.role === "admin";
  const router = useRouter();
  const [nameState, setNameState] = useState({ workspaceName: workspace?.name ?? "", value: workspace?.name ?? "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if ((workspace?.name ?? "") !== nameState.workspaceName) {
    setNameState({ workspaceName: workspace?.name ?? "", value: workspace?.name ?? "" });
  }
  const name = nameState.value;

  const dirty = name.trim() !== (workspace?.name ?? "") && name.trim().length >= 1 && name.trim().length <= 120;

  const save = async () => {
    if (!dirty || !workspaceId) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const newName = name.trim();
      await workspacesApi.rename(workspaceId, newName, authStorage.getAccessToken() as string);
      setNameState({ workspaceName: newName, value: newName });
      queryClient.setQueryData<Session>(queryKeys.session, (current) =>
        current
          ? {
              ...current,
              workspace: current.workspace && current.workspace.id === workspaceId
                ? { ...current.workspace, name: newName }
                : current.workspace,
              workspaces: current.workspaces.map((item) => item.id === workspaceId ? { ...item, name: newName } : item),
            }
          : current,
      );
      setSaved(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "L’enregistrement a échoué.");
    } finally {
      setSaving(false);
    }
  };

  const usage = usageQuery.data ?? null;

  return (
    <div className="mx-auto max-w-5xl">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-lime-700">Paramètres</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Votre espace, vos préférences.</h1>
        <p className="mt-2 text-slate-500">Gérez votre profil et le comportement d’Omnelyo.</p>
      </header>

      <div className="mt-8 space-y-5">
        <Section icon={UserRound} title="Profil">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom affiché" value={user.display_name ?? ""} disabled hint="Modifiable depuis votre compte."/>
            <Field label="Adresse e-mail" value={user.email} type="email" disabled hint="Adresse vérifiée par code à usage unique."/>
          </div>
        </Section>

        <Section icon={Building2} title="Espace de travail">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Nom de l’espace
              <input
                value={name}
                onChange={(event) => { setNameState({ workspaceName: nameState.workspaceName, value: event.target.value }); setSaved(false); }}
                maxLength={120}
                disabled={!canRename || saving}
                className="mt-2 h-11 w-full rounded-xl border bg-white px-3 font-normal outline-none focus:ring-2 focus:ring-lime-400 disabled:bg-slate-50 disabled:text-slate-500"
              />
              <span className="mt-1 block text-xs font-normal text-slate-400">
                {canRename ? "Ce nom est visible par les membres de l’espace." : "Seuls les propriétaires et administrateurs peuvent renommer l’espace."}
              </span>
            </label>
            <label className="text-sm font-bold">
              Identifiant
              <input value={workspace?.slug ?? ""} disabled className="mt-2 h-11 w-full rounded-xl border bg-slate-50 px-3 font-normal text-slate-500"/>
              <span className="mt-1 block text-xs font-normal text-slate-400">Identifiant technique attribué par Omnelyo.</span>
            </label>
          </div>
          {usage && (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <UsageBar label="Publications" value={usage.publications} max={usage.publications_limit}/>
              <UsageBar label="Source traitée" value={Math.round(usage.source_seconds / 60)} max={Math.round(usage.source_seconds_limit / 60)} unit="min"/>
              <UsageBar label="Stockage" value={usage.storage_bytes} max={usage.storage_bytes_limit} format={formatBytes}/>
            </div>
          )}
        </Section>

        <Section icon={Globe2} title="Langue et région">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Langue
              <select className="mt-2 h-11 w-full rounded-xl border bg-white px-3 font-normal"><option>Français</option><option disabled>English — bientôt</option></select>
            </label>
            <label className="text-sm font-bold">
              Devise préférée
              <select className="mt-2 h-11 w-full rounded-xl border bg-white px-3 font-normal"><option>USD — Dollar</option><option>XOF — Franc CFA</option><option>EUR — Euro</option></select>
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-400">Ces préférences d’affichage sont enregistrées sur cet appareil.</p>
        </Section>

        <Section icon={Bell} title="Notifications">
          <div className="space-y-3">
            {[["Traitement terminé","Recevoir une alerte lorsqu’un contenu est prêt."],["Publication réussie ou échouée","Suivre chaque destination sociale."],["Crédits presque épuisés","Être averti avant d’atteindre la limite."]].map(([title, text]) => (
              <label key={title} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                <span><span className="block font-bold">{title}</span><span className="text-sm text-slate-500">{text}</span></span>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-lime-600"/>
              </label>
            ))}
          </div>
        </Section>

        <Section icon={ShieldCheck} title="Sécurité">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
            <div>
              <p className="font-bold">Sessions actives</p>
              <p className="text-sm text-slate-500">Déconnectez-vous pour révoquer cette session.</p>
            </div>
            <button
              onClick={() => { authStorage.clearSession(); router.push("/login"); }}
              className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-black text-red-600"
            >
              <KeyRound size={16}/> Se déconnecter
            </button>
          </div>
        </Section>

        <div className="flex items-center gap-3">
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="ml-auto flex items-center gap-2 rounded-full bg-[#172033] px-6 py-3 text-sm font-black text-white disabled:opacity-40"
          >
            {saving ? <LoaderCircle size={17} className="animate-spin"/> : <Save size={17}/>} Enregistrer les modifications
          </button>
          {saved && <span className="flex items-center gap-1 text-sm font-bold text-lime-700"><Check size={15}/> Enregistré</span>}
        </div>
        {error && <p role="alert" className="ml-auto text-sm font-bold text-red-600">{error}</p>}
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof UserRound; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-lime-50 text-lime-700"><Icon size={19}/></span>
        <h2 className="text-xl font-black">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({ label, value, type = "text", disabled = false, hint }: { label: string; value: string; type?: string; disabled?: boolean; hint?: string }) {
  return (
    <label className="text-sm font-bold">
      {label}
      <input defaultValue={value} type={type} disabled={disabled} className="mt-2 h-11 w-full rounded-xl border bg-slate-50 px-3 font-normal text-slate-600 outline-none"/>
      {hint && <span className="mt-1 block text-xs font-normal text-slate-400">{hint}</span>}
    </label>
  );
}

function UsageBar({ label, value, max, unit, format }: { label: string; value: number; max: number; unit?: string; format?: (value: number) => string }) {
  const display = (item: number) => (format ? format(item) : `${item.toLocaleString("fr-FR")}${unit ? ` ${unit}` : ""}`);
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex justify-between text-sm">
        <span className="font-bold">{label}</span>
        <span className="text-slate-500">{display(value)} / {display(max)}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-lime-500" style={{ width: max ? `${Math.min(100, Math.round((value / max) * 100))}%` : "0%" }}/>
      </div>
    </div>
  );
}
