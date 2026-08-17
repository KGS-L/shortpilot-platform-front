import type { Metadata } from "next";
import Link from "next/link";
import { LandingAuthActions } from "@/components/layout/landing-auth-actions";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const siteUrl = getSiteUrl();

const plans = [
  { name:"Gratuit", price:"0", suffix:"FCFA", description:"Laissez Omnelyo vous montrer ce qu’une vidéo peut encore devenir.", features:["3 créations offertes","1 connexion sociale","10 publications"], cta:"Essayer gratuitement", featured:false },
  { name:"Creator", price:"9\u202F900", suffix:"FCFA / mois", description:"Pour retrouver un rythme de publication sans sacrifier vos soirées.", features:["30 créations par mois","2 connexions sociales","100 publications"], cta:"Choisir Creator", featured:true },
  { name:"Pro", price:"29\u202F900", suffix:"FCFA / mois", description:"Pour les équipes qui transforment chaque tournage en véritable campagne.", features:["100 créations par mois","8 connexions sociales","500 publications","3 espaces de travail"], cta:"Passer à Pro", featured:false },
];

const faqs = [
  ["Pourquoi raconter plutôt que découper ?","Découper garde l’audio d’origine et extrait des passages tels quels. Raconter écrit une histoire nouvelle, la fait porter par une voix off et retire l’audio d’origine : le Short raconté se suffit à lui-même, même sans avoir vu la vidéo complète."],
  ["Est-ce que Omnelyo publie à ma place ?","Oui. Vous choisissez les comptes, la légende, la visibilité et le moment. Omnelyo prépare puis envoie chaque publication séparément."],
  ["Mes vidéos restent-elles privées ?","Vos médias sont isolés par espace de travail. Les accès sociaux sont chiffrés et les liens temporaires expirent."],
  ["Que se passe-t-il si un rendu échoue ?","Le crédit réservé est libéré lorsqu’aucun rendu utilisable n’a été produit. Une nouvelle tentative de publication ne consomme pas de crédit."],
  ["Puis-je commencer sans carte bancaire ?","Oui. Le plan Gratuit offre trois créations pour découvrir le parcours avant de choisir un abonnement."],
] as const;

const jsonLd = {
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"Organization",
      "@id":`${siteUrl}#organization`,
      name:"Omnelyo",
      url:siteUrl,
      logo:`${siteUrl}icon.svg`,
    },
    {
      "@type":"SoftwareApplication",
      "@id":`${siteUrl}#software`,
      name:"Omnelyo",
      url:siteUrl,
      applicationCategory:"MultimediaApplication",
      operatingSystem:"Web",
      description:"Collez un lien. Recevez un Short raconté — histoire nouvelle, voix off — publié sur vos 4 réseaux.",
      offers:[
        { "@type":"Offer", name:"Gratuit", price:"0", priceCurrency:"XOF" },
        { "@type":"Offer", name:"Creator", price:"9900", priceCurrency:"XOF" },
        { "@type":"Offer", name:"Pro", price:"29900", priceCurrency:"XOF" },
      ],
    },
    {
      "@type":"FAQPage",
      "@id":`${siteUrl}#faq`,
      mainEntity:faqs.map(([question, acceptedAnswer]) => ({
        "@type":"Question",
        name:question,
        acceptedAnswer:{ "@type":"Answer", text:acceptedAnswer },
      })),
    },
  ],
};

export default function LandingPage() {
  return <main className="overflow-x-clip bg-cream text-ink">
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8"><Link href="/" className="text-xl font-extrabold tracking-[-.02em]">Omnelyo<span className="text-orange">.</span></Link><div className="hidden items-center gap-7 text-sm font-semibold md:flex"><a className="py-3" href="#preuve">Preuve</a><a className="py-3" href="#comment">Comment ça marche</a><a className="py-3" href="#tarifs">Tarifs</a></div><LandingAuthActions/></div></nav>

    <header className="relative">
      <div aria-hidden="true" className="absolute -top-10 right-[-4rem] h-56 w-56 rounded-full bg-lime-soft blur-3xl md:h-72 md:w-72"/>
      <div aria-hidden="true" className="absolute bottom-[-2rem] left-[-4rem] h-48 w-48 rounded-full bg-orange-soft/60 blur-3xl"/>
      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-32 md:px-8 sm:pt-40">
        <h1 className="text-[clamp(3.3rem,8vw,7.2rem)] font-black leading-none tracking-[-.06em]">La vidéo<br/>qui <span className="text-orange">raconte</span>.</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">Collez un lien. Recevez un Short raconté — histoire nouvelle, voix off, publié sur vos 4 réseaux.</p>
        <Link href="/login" className="mt-8 inline-flex items-center rounded-full border-2 border-ink bg-lime px-7 py-4 text-base font-bold tracking-[-.01em] shadow-xl shadow-lime/50 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5">Créer mes premiers Shorts</Link>
        <p className="mt-4 text-[13px] leading-relaxed text-muted">3 créations offertes · Sans carte bancaire · Aucune promesse magique, un vrai rythme</p>
      </div>
    </header>

    <section id="preuve" className="relative scroll-mt-24 py-24" aria-labelledby="preuve-titre">
      <div aria-hidden="true" className="absolute top-24 right-[-5rem] h-64 w-64 rounded-full bg-lime-soft blur-3xl"/>
      <div aria-hidden="true" className="absolute bottom-8 left-[-4rem] h-44 w-44 rounded-full bg-lime/30 blur-3xl"/>
      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <p className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[.1em] text-muted"><span className="h-1 w-6 flex-none rounded-full bg-lime-strong"/>La preuve</p>
        <h2 id="preuve-titre" className="mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.1] tracking-[-.045em]"><span className="text-orange">Raconté</span>, pas découpé</h2>

        <div className="mt-10 flex flex-col md:mt-14 md:max-w-4xl md:grid md:grid-cols-2 md:items-start md:gap-12">
          <article className="relative z-[1] rotate-[-2deg] rounded-[32px] border-4 border-ink bg-paper p-5 shadow-2xl shadow-ink/15 md:rotate-[-5deg]">
            <h3 className="text-2xl font-bold leading-tight tracking-[-.01em]">La vidéo d’origine</h3>
            <span className="mt-3 inline-flex rounded-full border-2 border-ink px-4 py-1 font-mono text-[1.35rem] font-bold tracking-[-.01em]">47:12</span>
            <div className="mt-4 h-3 w-full rounded-full [background-image:repeating-linear-gradient(90deg,color-mix(in_oklab,var(--color-ink)_26%,transparent)_0_9px,transparent_9px_15px)]"/>
            <ul className="mt-4 grid gap-2">
              <li className="flex items-start gap-2.5 text-[15px] leading-snug"><i className="mt-[7px] h-2.5 w-2.5 flex-none rounded-full border-2 border-ink"/>audio d’origine</li>
              <li className="flex items-start gap-2.5 text-[15px] leading-snug"><i className="mt-[7px] h-2.5 w-2.5 flex-none rounded-full border-2 border-ink"/>1,8&nbsp;Go</li>
            </ul>
          </article>

          <article className="relative z-[2] -mt-3 rotate-[2deg] translate-x-2 rounded-[32px] border-4 border-ink bg-paper p-5 shadow-2xl shadow-ink/15 md:mt-0 md:translate-x-0 md:rotate-[4deg]">
            <h3 className="text-2xl font-bold leading-tight tracking-[-.01em]"><span className="border-b-[5px] border-lime pb-0.5">Le Short raconté</span></h3>
            <span className="mt-3 inline-flex rounded-full border-2 border-ink bg-lime px-4 py-1 font-mono text-[1.35rem] font-bold tracking-[-.01em]">0:58</span>
            <div className="mt-4 h-3 w-[38%] rounded-full [background-image:repeating-linear-gradient(90deg,var(--color-lime-strong)_0_4px,var(--color-lime)_4px_8px)]"/>
            <ul className="mt-4 grid gap-2">
              <li className="flex items-start gap-2.5 text-[15px] leading-snug"><i className="mt-[7px] h-2.5 w-2.5 flex-none rounded-full border-2 border-ink bg-lime-strong"/>histoire nouvelle</li>
              <li className="flex items-start gap-2.5 text-[15px] leading-snug"><i className="mt-[7px] h-2.5 w-2.5 flex-none rounded-full border-2 border-ink bg-lime-strong"/>voix off</li>
              <li className="flex items-start gap-2.5 text-[15px] leading-snug"><i className="mt-[7px] h-2.5 w-2.5 flex-none rounded-full border-2 border-ink bg-lime-strong"/><span><s className="decoration-2 decoration-ink/55">audio d’origine</s> retiré</span></li>
            </ul>
          </article>
        </div>

        <p className="mt-12 flex flex-wrap items-center justify-center gap-3 text-[1.3rem] font-black tracking-[-.03em]">découper<span className="grid h-10 w-10 flex-none place-items-center rounded-full border-2 border-ink bg-lime text-[1.05rem] font-extrabold">≠</span><span className="border-b-[6px] border-lime pb-px">raconter</span></p>
      </div>
    </section>

    <section className="bg-ink py-24 text-cream" aria-labelledby="probleme-titre">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-3xl">
          <p className="text-[13px] font-semibold uppercase tracking-[.1em] text-lime">Le vrai problème</p>
          <h2 id="probleme-titre" className="mt-4 text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.1] tracking-[-.045em]">Publier ne devrait pas demander de <span className="text-orange-light">savoir monter</span>.</h2>
          <p className="mt-6 text-lg leading-relaxed text-cream/70">La vidéo est là — 47 minutes de valeur. Mais entre le recadrage, le rythme, les sous-titres et les quatre exports, elle reste dans le dossier. Ce n’est pas un problème d’idées : c’est un problème de montage.</p>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          <article><h3 className="text-xl font-bold">Le tournage est fait</h3><p className="mt-2 text-sm leading-relaxed text-cream/70">La valeur est déjà dans vos rushes.</p></article>
          <article><h3 className="text-xl font-bold">Le montage, non</h3><p className="mt-2 text-sm leading-relaxed text-cream/70">Recadrer, couper, sous-titrer : des soirées entières.</p></article>
          <article><h3 className="text-xl font-bold">La publication attend</h3><p className="mt-2 text-sm leading-relaxed text-cream/70">Quatre réseaux, quatre formats, et zéro élan.</p></article>
        </div>
      </div>
    </section>

    <section id="comment" className="scroll-mt-24 bg-paper py-24" aria-labelledby="comment-titre">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="flex items-center justify-center gap-2.5 text-[13px] font-semibold uppercase tracking-[.1em] text-muted"><span className="h-1 w-6 flex-none rounded-full bg-lime-strong"/>Comment ça marche<span className="h-1 w-6 flex-none rounded-full bg-lime-strong"/></p>
          <h2 id="comment-titre" className="mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.1] tracking-[-.045em]">Trois gestes. Zéro montage.</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <article className="rounded-[32px] border border-ink/10 bg-cream p-8">
            <span className="text-5xl font-black tracking-[-.04em]">01</span>
            <span className="mt-2 block h-1.5 w-10 rounded-full bg-lime-strong"/>
            <h3 className="mt-6 text-2xl font-bold tracking-[-.01em]">Confiez votre source</h3>
            <p className="mt-3 leading-relaxed text-muted">Collez un lien, déposez un fichier ou envoyez la vidéo depuis Telegram — votre studio vit dans Telegram, sans application.</p>
          </article>
          <article className="rounded-[32px] border border-ink/10 bg-cream p-8">
            <span className="text-5xl font-black tracking-[-.04em]">02</span>
            <span className="mt-2 block h-1.5 w-10 rounded-full bg-lime-strong"/>
            <h3 className="mt-6 text-2xl font-bold tracking-[-.01em]">Omnelyo raconte</h3>
            <p className="mt-3 leading-relaxed text-muted">L’histoire est réécrite, la voix off est générée, l’audio d’origine est retiré. Un Short raconté, pas un extrait.</p>
          </article>
          <article className="rounded-[32px] border border-ink/10 bg-cream p-8">
            <span className="text-5xl font-black tracking-[-.04em]">03</span>
            <span className="mt-2 block h-1.5 w-10 rounded-full bg-lime-strong"/>
            <h3 className="mt-6 text-2xl font-bold tracking-[-.01em]">Publié sur vos 4 réseaux</h3>
            <p className="mt-3 leading-relaxed text-muted">YouTube, TikTok, Instagram et Facebook reçoivent le Short. Le rediffuser ailleurs ne coûte rien.</p>
          </article>
        </div>
      </div>
    </section>

    <section className="px-5 py-12 sm:py-20" aria-labelledby="reseaux-titre">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[40px] bg-orange px-6 py-14 text-ink sm:px-14">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 id="reseaux-titre" className="text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.1] tracking-[-.045em]">Un contenu.<br/>Quatre chances d’être découvert.</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">Omnelyo prépare chaque publication pour sa destination. Vous validez une fois, et votre idée rencontre quatre audiences.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {["YouTube","TikTok","Instagram","Facebook"].map((network, index) => <article key={network} className={`rounded-3xl border-2 border-ink bg-paper p-6 ${index===0?"lg:translate-y-5":index===2?"lg:translate-y-10":index===3?"lg:translate-y-2.5":""}`}><span className="block h-3 w-3 rounded-full bg-lime-strong"/><h3 className="mt-8 text-xl font-black">{network}</h3><p className="mt-1 text-sm text-muted">Pensé pour sa destination.</p></article>)}
          </div>
        </div>
      </div>
    </section>

    <section id="tarifs" className="scroll-mt-24 py-24" aria-labelledby="tarifs-titre">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[.1em] text-muted"><span className="h-1 w-6 flex-none rounded-full bg-lime-strong"/>Des prix qui laissent respirer</p>
          <h2 id="tarifs-titre" className="mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.1] tracking-[-.045em]">Commencez avec une idée.<br/>Grandissez avec vos histoires.</h2>
        </div>
        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-3">{plans.map(plan => <article key={plan.name} className={`relative flex flex-col rounded-[24px] bg-paper p-8 ${plan.featured?"border-2 border-ink shadow-2xl shadow-ink/15 lg:-translate-y-4":"border border-ink"}`}>
          {plan.featured && <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-ink bg-lime px-3 py-1 text-xs font-black">LE PLUS CHOISI</span>}
          <h3 className="text-2xl font-black">{plan.name}</h3>
          <p className="mt-4 min-h-20 text-sm leading-relaxed text-muted">{plan.description}</p>
          <div className="my-7 flex items-end gap-2"><span className="text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-none tracking-[-.045em]">{plan.price}</span><span className="pb-1 text-sm text-muted">{plan.suffix}</span></div>
          <ul className="mb-8 space-y-3">{plan.features.map(feature => <li key={feature} className="flex items-start gap-3 text-sm"><span className="mt-[7px] h-2.5 w-2.5 flex-none rounded-full bg-lime-strong"/> {feature}</li>)}</ul>
          <Link href="/login" className={`mt-auto rounded-full border-2 border-ink py-3 text-center text-sm font-bold ${plan.featured?"bg-lime":"bg-paper motion-safe:transition-colors motion-safe:hover:bg-lime-soft"}`}>{plan.cta}</Link>
        </article>)}</div>
        <p className="mt-8 text-center text-[13px] leading-relaxed text-muted">Offre fondateur — 100 premiers comptes : Creator à 6&#8239;900 FCFA/mois, Pro à 19&#8239;900 FCFA/mois.</p>
        <p className="mt-2 text-center text-[13px] leading-relaxed text-muted">Une création = un rendu réussi ; republier ne consomme pas de crédit.</p>
      </div>
    </section>

    <section className="border-y border-ink/10 bg-paper py-16" aria-labelledby="dogfooding-titre">
      <div className="mx-auto max-w-4xl px-5 text-center md:px-8">
        <p id="dogfooding-titre" className="text-[13px] font-semibold uppercase tracking-[.1em] text-muted">En attendant les vôtres</p>
        <p className="mt-3 text-xl font-bold leading-snug">Les Shorts de notre compte démo sont faits avec Omnelyo.</p>
      </div>
    </section>

    <section className="py-24" aria-labelledby="faq-titre">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <p className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[.1em] text-muted"><span className="h-1 w-6 flex-none rounded-full bg-lime-strong"/>FAQ</p>
        <h2 id="faq-titre" className="mt-3 text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.1] tracking-[-.045em]">Questions honnêtes, réponses simples.</h2>
        <div className="mt-10 border-t border-ink/10">{faqs.map(([question, answer]) => <details key={question} className="group border-b border-ink/10">
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">{question}<span aria-hidden="true" className="grid h-8 w-8 flex-none place-items-center rounded-full bg-lime-soft text-xl font-black motion-safe:transition-transform group-open:rotate-45">+</span></summary>
          <p className="max-w-2xl pb-5 leading-relaxed text-muted">{answer}</p>
        </details>)}</div>
      </div>
    </section>

    <section className="relative overflow-hidden bg-lime py-24 text-center" aria-labelledby="cta-final-titre">
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(var(--color-ink)_1px,transparent_1px)] [background-size:18px_18px]"/>
      <div className="relative mx-auto max-w-4xl px-5">
        <p className="text-[13px] font-semibold uppercase tracking-[.1em]">Votre prochaine publication est peut-être déjà tournée</p>
        <h2 id="cta-final-titre" className="mt-5 text-[clamp(2.8rem,6vw,4.5rem)] font-black leading-[.95] tracking-[-.06em]">Rouvrez ce dossier.<br/>On s’occupe de la suite.</h2>
        <Link href="/login" className="mt-9 inline-flex items-center rounded-full bg-ink px-8 py-4 text-base font-bold text-cream motion-safe:transition-transform motion-safe:hover:-translate-y-0.5">Créer mes premiers contenus</Link>
      </div>
    </section>

    <footer className="bg-ink pb-10 pt-16 text-cream">
      <p aria-hidden="true" className="select-none px-5 text-center text-[clamp(1.6rem,5vw,3.5rem)] font-black leading-none tracking-[-.045em] text-cream/[0.08]">Create once. Be everywhere.</p>
      <div className="mx-auto mt-12 max-w-6xl px-5 md:px-8">
        <div className="grid gap-9 md:grid-cols-[1fr_2fr_auto]">
          <div><Link href="/" className="text-xl font-extrabold tracking-[-.02em]">Omnelyo<span className="text-orange">.</span></Link><p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">Le Short raconté, pas le Short découpé.</p></div>
          <div className="grid grid-cols-2 gap-7 text-sm text-cream/70 sm:grid-cols-4">
            <div><p className="mb-3 font-bold text-cream">Produit</p><a className="block py-1.5" href="#preuve">Preuve</a><a className="block py-1.5" href="#comment">Comment ça marche</a><a className="block py-1.5" href="#tarifs">Tarifs</a></div>
            <div><p className="mb-3 font-bold text-cream">Communauté</p><Link href="/partners" className="block py-1.5 text-lime">Devenir partenaire</Link><Link href="/login" className="block py-1.5">Connexion</Link></div>
            <div><p className="mb-3 font-bold text-cream">Informations</p><Link href="/legal/mentions-legales" className="block py-1.5">Mentions légales</Link><Link href="/legal/confidentialite" className="block py-1.5">Confidentialité</Link><Link href="/legal/conditions" className="block py-1.5">Conditions d’utilisation</Link><Link href="/legal/cookies" className="block py-1.5">Cookies</Link></div>
            <div><p className="mb-3 font-bold text-cream">Langue</p><label className="flex w-fit items-center rounded-full border border-cream/20 px-3 py-2 text-sm"><select disabled aria-label="Choisir la langue" defaultValue="fr" className="bg-transparent text-cream/70 outline-none"><option value="fr" className="text-ink">Français</option><option value="en" className="text-ink">English — bientôt</option></select></label></div>
          </div>
          <p className="text-xs leading-relaxed text-cream/50 md:text-right">© 2026 Omnelyo<br/>Create once. Be everywhere.</p>
        </div>
        <div className="mt-10 border-t border-cream/10 pt-5 text-xs text-cream/50">Omnelyo ne garantit aucun revenu ni aucune performance sur les plateformes sociales.</div>
      </div>
    </footer>

    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}/>
  </main>;
}
