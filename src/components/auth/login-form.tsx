"use client";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { publicEnv } from "@/lib/env";
import { authStorage } from "@/lib/auth-storage";

type Tokens = { access_token:string; refresh_token:string };
type GoogleResponse = { credential:string };
declare global { interface Window { google?: { accounts:{ id:{ initialize:(options:{client_id:string;callback:(response:GoogleResponse)=>void})=>void; renderButton:(element:HTMLElement,options:Record<string,unknown>)=>void } } } } }

export function LoginForm({nextPath="/dashboard"}:{nextPath?:string}) {
  const router = useRouter();
  const googleButton = useRef<HTMLDivElement>(null);
  const [email,setEmail] = useState(""); const [code,setCode] = useState("");
  const [step,setStep] = useState<"email"|"code">("email"); const [loading,setLoading] = useState(false); const [error,setError] = useState("");
  function complete(tokens:Tokens) { authStorage.setTokens(tokens.access_token,tokens.refresh_token); router.push(nextPath.startsWith("/")&&!nextPath.startsWith("//")?nextPath:"/dashboard"); }
  function initGoogle() { if (!window.google || !googleButton.current || !publicEnv.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return; window.google.accounts.id.initialize({client_id:publicEnv.NEXT_PUBLIC_GOOGLE_CLIENT_ID,callback:async({credential})=>{setLoading(true);setError("");try{complete(await apiRequest<Tokens>("/v1/auth/google",{method:"POST",body:JSON.stringify({credential})}));}catch(e){setError(e instanceof Error?e.message:"Connexion Google impossible.");setLoading(false);}}}); window.google.accounts.id.renderButton(googleButton.current,{theme:"outline",size:"large",shape:"pill",width:360,text:"continue_with"}); }
  async function submit(event:React.FormEvent) { event.preventDefault(); setLoading(true); setError(""); try { if(step==="email"){await apiRequest("/v1/auth/email/request-otp",{method:"POST",body:JSON.stringify({email})});setStep("code");}else complete(await apiRequest<Tokens>("/v1/auth/email/verify",{method:"POST",body:JSON.stringify({email,code})})); } catch(e){setError(e instanceof Error?e.message:"Une erreur est survenue.");} finally{setLoading(false);} }
  const googleConfigured=Boolean(publicEnv.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  return <><Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initGoogle}/><div className="w-full max-w-md"><p className="text-sm font-black uppercase tracking-[.16em] text-lime-700">Bienvenue à bord</p><h1 className="mt-3 text-4xl font-black tracking-[-.045em]">{step==="email"?"Créez. Publiez. Avancez.":"Consultez votre e-mail."}</h1><p className="mt-3 leading-7 text-slate-600">{step==="email"?"Connectez-vous ou créez votre compte en quelques secondes.":`Nous avons envoyé un code sécurisé à ${email}.`}</p>
    {step==="email"&&<div className="mt-8"><div ref={googleButton} className="flex min-h-11 justify-center"/>{!googleConfigured&&<button disabled className="h-12 w-full rounded-full border bg-white font-bold text-slate-400">Continuer avec Google — configuration requise</button>}<div className="my-6 flex items-center gap-4 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200"/>ou par e-mail<span className="h-px flex-1 bg-slate-200"/></div></div>}
    <form onSubmit={submit} className="space-y-4"><label className="block text-sm font-bold">{step==="email"?"Adresse e-mail":"Code à 6 chiffres"}<input required autoFocus value={step==="email"?email:code} onChange={e=>step==="email"?setEmail(e.target.value):setCode(e.target.value.replace(/\D/g,"").slice(0,6))} type={step==="email"?"email":"text"} inputMode={step==="code"?"numeric":undefined} className="mt-2 h-13 w-full rounded-2xl border bg-white px-4 text-base outline-none focus:ring-2 focus:ring-lime-400" placeholder={step==="email"?"vous@exemple.com":"000000"}/></label>{error&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={loading} className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#172033] font-black text-white disabled:opacity-60">{loading?<LoaderCircle className="animate-spin" size={19}/>:step==="email"?"Recevoir mon code":"Me connecter"}<ArrowRight size={18}/></button></form>
    {step==="code"&&<button onClick={()=>{setStep("email");setCode("");setError("");}} className="mt-5 text-sm font-bold underline">Utiliser une autre adresse</button>}<p className="mt-7 text-xs leading-5 text-slate-500">En continuant, vous acceptez les conditions d’utilisation et la politique de confidentialité d’Omnelyo.</p></div></>;
}
