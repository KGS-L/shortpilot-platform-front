"use client";

import { useState } from "react";
import { Bot, Check, ExternalLink, Globe2, ImageIcon, MonitorPlay, Music2, Plus, ShieldCheck, Unplug } from "lucide-react";
import { AsyncState } from "@/components/ui/async-state";
import { useSession } from "@/features/auth/session-gate";
import { platformLabels, useChannels, type SocialPlatform } from "@/features/channels";
import {
  connectablePlatforms,
  useConnectSocial,
  useDisconnectSocial,
  useLinkTelegram,
  useSocialConnections,
  useTelegramConnection,
  useUnlinkTelegram,
} from "@/features/integrations";
import { formatDate, formatDateTime } from "@/lib/format";

const platformIcons: Record<SocialPlatform, typeof MonitorPlay> = {
  youtube: MonitorPlay,
  tiktok: Music2,
  instagram: ImageIcon,
  facebook: Globe2,
};

const platformColors: Record<SocialPlatform, string> = {
  youtube: "bg-red-50 text-red-600",
  tiktok: "bg-slate-900 text-white",
  instagram: "bg-pink-50 text-pink-600",
  facebook: "bg-blue-50 text-blue-600",
};

export default function IntegrationsPage() {
  const { workspace } = useSession();
  const workspaceId = workspace?.id ?? "";
  const canManage = workspace?.role === "owner" || workspace?.role === "admin";

  const channelsQuery = useChannels(workspaceId);
  const connectionsQuery = useSocialConnections(workspaceId);
  const telegramQuery = useTelegramConnection(workspaceId);
  const connectMutation = useConnectSocial(workspaceId);
  const disconnectMutation = useDisconnectSocial(workspaceId);
  const linkMutation = useLinkTelegram(workspaceId);
  const unlinkMutation = useUnlinkTelegram(workspaceId);

  const [telegramLink, setTelegramLink] = useState<{ url: string; instructions: string[] } | null>(null);

  const connections = connectionsQuery.data ?? [];
  const channels = channelsQuery.data ?? [];
  const telegram = telegramQuery.data ?? null;
  const busy = connectMutation.isPending || disconnectMutation.isPending || linkMutation.isPending || unlinkMutation.isPending;
  const mutationError = connectMutation.error ?? disconnectMutation.error ?? linkMutation.error ?? unlinkMutation.error;

  return (
    <div className="mx-auto max-w-7xl">
      <header>
        <p className="text-sm font-black uppercase tracking-[.15em] text-lime-700">Connexions</p>
        <h1 className="mt-1 text-4xl font-black tracking-[-.04em] md:text-5xl">Reliez vos destinations.</h1>
        <p className="mt-2 text-slate-500">Omnelyo publie uniquement sur les comptes que vous autorisez.</p>
      </header>

      {connectionsQuery.error && connectionsQuery.error instanceof Error && connectionsQuery.error.message.includes("permission") ? (
        <div className="mt-8"><AsyncState kind="error" description={connectionsQuery.error.message}/></div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {connectablePlatforms.map((platform) => {
            const Icon = platformIcons[platform];
            const platformConnections = connections.filter((connection) => connection.platform === platform && connection.status === "active");
            const platformChannels = channels.filter((channel) => channel.platform === platform && channel.status === "active");
            const connected = platformChannels.length > 0;
            return (
              <article key={platform} className="flex items-center gap-4 rounded-3xl border bg-white p-5">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${platformColors[platform]}`}><Icon/></span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-black">{platformLabels[platform]}</h2>
                  <p className="truncate text-sm text-slate-500">
                    {connected
                      ? platformChannels.map((channel) => channel.handle ?? channel.name).join(", ")
                      : canManage ? "Non connecté" : "Aucune chaîne active"}
                  </p>
                  {connected && platformConnections[0]?.expires_at && (
                    <p className="mt-1 text-xs text-slate-400">Autorisation valable jusqu’au {formatDate(platformConnections[0].expires_at)}</p>
                  )}
                </div>
                {connected ? (
                  canManage && platformConnections[0] ? (
                    <button
                      disabled={busy}
                      onClick={() => disconnectMutation.mutate(platformConnections[0].id)}
                      className="flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black disabled:opacity-50"
                    >
                      <Unplug size={14}/> Déconnecter
                    </button>
                  ) : (
                    <span className="flex items-center gap-2 rounded-full bg-lime-50 px-4 py-2 text-xs font-black text-lime-700"><Check size={14}/> Connecté</span>
                  )
                ) : canManage ? (
                  <button
                    disabled={busy}
                    onClick={() => connectMutation.mutate(platform)}
                    className="flex items-center gap-2 rounded-full bg-[#172033] px-4 py-2 text-xs font-black text-white disabled:opacity-50"
                  >
                    <Plus size={14}/> Connecter
                  </button>
                ) : (
                  <span className="text-xs font-bold text-slate-400">Géré par le propriétaire</span>
                )}
              </article>
            );
          })}
        </div>
      )}
      {!canManage && (
        <p className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
          Seuls les propriétaires et administrateurs de l’espace peuvent connecter ou déconnecter des réseaux.
        </p>
      )}

      <section className="mt-6 grid gap-6 rounded-3xl border bg-white p-6 lg:grid-cols-[.75fr_1.25fr]">
        <div className="rounded-3xl bg-sky-50 p-6">
          <Bot className="text-sky-600" size={34}/>
          <h2 className="mt-5 text-2xl font-black">Votre assistant Telegram</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Envoyez vos médias au bot et retrouvez-les dans votre bibliothèque.</p>
          {telegram ? (
            <div className="mt-5">
              <p className="flex items-center gap-2 text-sm font-bold text-lime-700"><Check size={16}/> Compte Telegram lié</p>
              <p className="mt-1 text-xs text-slate-500">Depuis le {formatDateTime(telegram.linked_at)}</p>
              <button
                disabled={busy}
                onClick={() => unlinkMutation.mutate()}
                className="mt-4 rounded-full border border-sky-200 bg-white px-5 py-2.5 text-sm font-black text-red-600 disabled:opacity-50"
              >
                Délier Telegram
              </button>
            </div>
          ) : telegramLink ? (
            <div className="mt-5">
              <p className="text-sm font-bold text-sky-800">Dernière étape : ouvrez Telegram pour terminer la liaison.</p>
              <a
                href={telegramLink.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
              >
                <Bot size={16}/> Ouvrir Telegram
              </a>
              <p className="mt-2 break-all text-[11px] leading-4 text-slate-400">{telegramLink.url}</p>
              <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-slate-600">
                {telegramLink.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
              </ul>
            </div>
          ) : (
            <button
              disabled={busy}
              onClick={async () => {
                const link = await linkMutation.mutateAsync();
                setTelegramLink({ url: link.url, instructions: link.instructions });
              }}
              className="mt-5 rounded-full bg-sky-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50"
            >
              Connecter Telegram
            </button>
          )}
        </div>
        <div>
          <h2 className="text-xl font-black">Connexion en 4 étapes</h2>
          <ol className="mt-5 space-y-4">
            {[
              "Sur cette page, cliquez sur « Connecter Telegram » : un lien sécurisé unique est généré (valide 10 minutes).",
              "Ouvrez ce lien : Telegram s’ouvre directement sur le bot Omnelyo.",
              "Appuyez sur Démarrer : le bot confirme la liaison dans la conversation.",
              "Envoyez un premier média et vérifiez son apparition dans Contenus.",
            ].map((text, index) => (
              <li key={text} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-black text-white">{index + 1}</span>
                <p className="pt-1 text-sm text-slate-600">{text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} className="text-lime-600"/> Ne communiquez jamais le token de votre bot dans un formulaire public.</p>
          <a href="https://t.me/" target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-1 text-sm font-black text-sky-700">Ouvrir Telegram <ExternalLink size={14}/></a>
        </div>
      </section>

      {mutationError && (
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
          {mutationError instanceof Error ? mutationError.message : "L’action a échoué."}
        </p>
      )}
    </div>
  );
}
