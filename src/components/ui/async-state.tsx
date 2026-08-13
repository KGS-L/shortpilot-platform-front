import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Inbox, LoaderCircle } from "lucide-react";

type Kind="loading"|"empty"|"error"|"success";
const config={loading:{icon:LoaderCircle,title:"Chargement en cours",tone:"text-blue-600 bg-blue-50"},empty:{icon:Inbox,title:"Rien à afficher",tone:"text-slate-500 bg-slate-50"},error:{icon:AlertTriangle,title:"Une erreur est survenue",tone:"text-red-600 bg-red-50"},success:{icon:CheckCircle2,title:"Tout est prêt",tone:"text-lime-700 bg-lime-50"}};
export function AsyncState({kind,title,description,action}:{kind:Kind;title?:string;description:string;action?:ReactNode}){const item=config[kind];const Icon=item.icon;return <div role={kind==="error"?"alert":"status"} className={`rounded-3xl border p-7 text-center ${item.tone}`}><Icon className={`mx-auto ${kind==="loading"?"animate-spin":""}`} size={32}/><h3 className="mt-4 text-lg font-black text-slate-900">{title??item.title}</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{description}</p>{action&&<div className="mt-5">{action}</div>}</div>}
