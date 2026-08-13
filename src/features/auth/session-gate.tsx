"use client";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api-client";
import { AsyncState } from "@/components/ui/async-state";
import type { Space } from "@/components/layout/sidebar";

type User={id:string;email:string;display_name:string|null;avatar_url:string|null;email_verified:boolean;platform_role:"user"|"admin";partner_status:"pending"|"active"|"suspended"|"closed"|null};
type Workspace={id:string;name:string;slug:string;role:"owner"|"admin"|"member";created_at:string};

export type Session={user:User;workspaces:Workspace[];workspace:Workspace|null};
export function SessionGate({space,children}:{space:Space;children:(session:Session)=>ReactNode}){
 const router=useRouter();const pathname=usePathname();const [state,setState]=useState<{loading:boolean;session?:Session;error?:string}>({loading:true});
 useEffect(()=>{const token=localStorage.getItem("shortpilot_access_token");if(!token){router.replace(`/login?next=${encodeURIComponent(pathname)}`);return;}Promise.all([apiRequest<User>("/v1/users/me",{},token),apiRequest<Workspace[]>("/v1/workspaces",{},token)]).then(([user,workspaces])=>{if(space==="admin"&&user.platform_role!=="admin"){router.replace("/dashboard");return;}if(space==="partner"&&user.partner_status!=="active"){router.replace("/partners");return;}const saved=localStorage.getItem("shortpilot_workspace_id");const workspace=workspaces.find(item=>item.id===saved)??workspaces[0]??null;if(workspace)localStorage.setItem("shortpilot_workspace_id",workspace.id);setState({loading:false,session:{user,workspaces,workspace}});}).catch(error=>{if(error?.status===401){localStorage.removeItem("shortpilot_access_token");localStorage.removeItem("shortpilot_refresh_token");router.replace(`/login?next=${encodeURIComponent(pathname)}`);return;}setState({loading:false,error:error instanceof Error?error.message:"Session indisponible."});});},[pathname,router,space]);
 if(state.loading)return <div className="mx-auto mt-20 max-w-xl"><AsyncState kind="loading" description="Vérification de votre session et de vos permissions."/></div>;
 if(state.error||!state.session)return <div className="mx-auto mt-20 max-w-xl"><AsyncState kind="error" description={state.error??"La session n’a pas pu être chargée."} action={<button onClick={()=>location.reload()} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-black text-white">Réessayer</button>}/></div>;
 return children(state.session);
}
