---
title: 'Landing « La vidéo qui raconte. » — refonte message, grille FCFA, SEO/sitemap, OG'
type: 'feature'
created: '2026-08-17'
status: 'done'
review_loop_iteration: 0
baseline_commit: '63f486877d7da6d13d942656931f3e850416eb74'
context:
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-frontend-2026-08-17/EXPERIENCE.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-frontend-2026-08-17/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-frontend-2026-08-17/mockups/key-hero.html'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-frontend-2026-08-17/mockups/key-proof.html'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** La landing vend du découpage (« transforme vos vidéos longues en clips courts », prix USD, personas diluantes, badge « Create once » en hero, section démo pointant une vidéo inexistante) alors que le positionnement ratifié est « le Short raconté, pas le Short découpé » ; SEO, OG et sitemap ne reflètent pas la nouvelle une.

**Approach:** Réécrire `src/app/page.tsx` selon l'IA à 10 sections des deux contrats (hero typographique sans second CTA ni ProductStory, preuve avant/après codée statique, suppression personas + démo, grille FCFA, dogfooding, FAQ augmentée, filigrane footer), activer les tokens DESIGN.md dans `globals.css`, figer les métadonnées SEO + canonical + JSON-LD, ajouter `sitemap.ts` + champ sitemap dans `robots.ts`, et redessiner `opengraph-image.tsx` en og-card typographique crème.

## Boundaries & Constraints

**Always:**
- `page.tsx` reste un server component sans `"use client"` (seul `LandingAuthActions` est client) ; tout fonctionne sans JS (liens natifs, `<details>` FAQ).
- Un seul h1 « La vidéo qui raconte. » ; un seul CTA dans le hero (« Créer mes premiers Shorts » → `/login`) ; ancres `#preuve`, `#comment`, `#tarifs` en nav.
- Mobile-first : aucun asset image/vidéo dans la page (preuve 100 % HTML/CSS, mono pour données techniques) ; pas d'autoplay ; rotations ±2° en mobile, -5°/+4° en desktop ; `prefers-reduced-motion` respecté.
- Couleurs via tokens `@theme` (`bg-cream`, `text-ink`, `bg-lime`, `border-ink`…) — plus de hex arbitraires dans la page ; jamais de texte courant orange sur crème.
- Copies contractuelles verbatim : h1 ; sous-titre « Collez un lien. Recevez un Short raconté — histoire nouvelle, voix off, publié sur vos 4 réseaux. » ; microcopy « 3 créations offertes · Sans carte bancaire · Aucune promesse magique, un vrai rythme » ; dogfooding « Les Shorts de notre compte démo sont faits avec Omnelyo. » ; footnote « une création = un rendu réussi ; republier ne consomme pas de crédit ».
- Indexation conditionnelle existante préservée : robots disallow + noindex hors prod/indexation off.

**Ask First:**
- Modifier montants ou quotas de la grille FCFA (grille non validée business — bloquante pour la mise en ligne, pas pour l'implémentation demandée).

**Never:**
- Pas de personas, ProductStory/mock screenshot, `<video>` démo, second CTA hero, porte d'entrée Telegram (bénéfice texte en étape 01 uniquement), prix USD, faux témoignages, promesse « Re-raconter » ou « English » actif.
- Ne pas modifier `/login`, `/dashboard`, `/partners`, pages legal, `LandingAuthActions` (déjà conforme), `twitter-image.tsx` (re-export).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Visiteur déconnecté | localStorage sans token | Nav : « Se connecter » + « Créer gratuitement » (SSR = déconnecté) | N/A |
| Visiteur connecté | token présent (event `storage`) | Nav : « Mon tableau de bord » → `/dashboard` | token expiré → retombe sur « Se connecter » |
| Env non-prod ou indexation off | `NEXT_PUBLIC_INDEXING_ENABLED`≠true | robots.txt `Disallow: /` sans ligne Sitemap ; meta noindex | N/A |
| Prod + indexation on | `NEXT_PUBLIC_INDEXING_ENABLED=true` | robots `Allow: /` + ligne `Sitemap:` ; sitemap listant `/`, `/partners`, 4 legal | N/A |
| JS désactivé | nav, preuve, FAQ | liens et `<details>` natifs fonctionnels ; nav dégradée « Se connecter » | N/A |

</frozen-after-approval>

## Code Map

- `src/app/page.tsx` (65 l., server) -- page monolithique à réécrire. Repères actuels : data tarifs `:6-10`, data FAQ `:12-17`, nav `:37`, hero + ProductStory `:39-41`, problème `:43`, personas `:45-47` (supprimer), démo `:49` (supprimer — `/videos/omnelyo-demo.mp4` n'existe pas), comment `:51-53`, 4 réseaux `:55`, tarifs `:57`, FAQ `:59`, CTA final `:61`, footer `:63`. Nettoyer les imports devenus inutiles (`next/image`, icônes) ; laisser `public/images/omnelyo-creator-story.png` en place (simplement non référencé).
- `src/app/globals.css` (8 l.) -- `:root` + `@theme inline` Tailwind v4, tokens dormants (`--brand:#70df1b` jamais utilisé) ; remplacer par la palette DESIGN.md.
- `src/app/layout.tsx` -- metadata `:18-38` (title default, description, OG `fr_FR`, robots `:35-37`), Geist via next/font `:8-16`, `lang="fr"` `:43` ; metadataBase = `NEXT_PUBLIC_SITE_URL ?? NEXT_PUBLIC_APP_URL ?? http://localhost:3000` ; ajouter `alternates.canonical`.
- `src/app/opengraph-image.tsx` (16 l.) -- `ImageResponse` de `next/og`, 1200×630 PNG ; actuellement fond ink + « Create once » → redessiner og-card. `twitter-image.tsx` = re-export (ne pas toucher).
- `src/app/robots.ts` (`:4-10`) -- allow/disallow selon prod + `NEXT_PUBLIC_INDEXING_ENABLED` ; ajouter `sitemap` conditionnel.
- `src/app/sitemap.ts` -- n'existe pas ; à créer (`MetadataRoute.Sitemap`, Next 16.3).
- Routes pour sitemap : `/`, `/partners` (`src/app/partners/page.tsx`), legal 4 slugs (`src/app/legal/[slug]/page.tsx:6-9` : mentions-legales, confidentialite, conditions, cookies).
- `src/components/layout/landing-auth-actions.tsx` -- conforme contrat (storage event, fallback SSR) — NE PAS MODIFIER.
- Docs Next 16.3 locales (AGENTS.md : version avec breaking changes) : `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/{sitemap,robots,opengraph-image}.md` (v16 : `params` Promise ; limite 8 MB OG).

## Tasks & Acceptance

**Execution:**
- [x] `src/app/globals.css` -- remplacer les tokens dormants par la palette DESIGN.md dans `:root`/`@theme inline` : `--color-cream:#FBFAF6`, `--color-paper:#FFFFFF`, `--color-ink:#172033`, `--color-lime:#A3E635`, `--color-lime-strong:#84CC16`, `--color-lime-soft:#ECFCCB`, `--color-orange:#F97316`, `--color-orange-soft:#FDBA74`, `--color-orange-light:#FB923C`, `--color-muted:#475569` ; garder des styles de base cohérents (body crème/encre) -- DESIGN.md devient la source unique.
- [x] `src/app/page.tsx` -- réécrire selon l'IA des contrats : nav (Preuve/Comment ça marche/Tarifs + actions auth) ; hero (« La vidéo qui raconte. », sous-titre, CTA unique, microcopy, halos CSS — sans badge, second CTA ni ProductStory) ; preuve `#preuve` (2 card-tilted codées : « La vidéo d'origine » 47:12 · 1,8 Go · audio d'origine VS « Le Short raconté » 0:58 · histoire nouvelle · voix off · audio d'origine retiré, + ligne de contraste découper ≠ raconter) ; problème réframé sur « publier sans savoir monter » (bande ink conservée) ; comment ça marche 3 étapes (01 Confiez votre source — lien, upload, Telegram en bénéfice « votre studio vit dans Telegram, sans application » · 02 Omnelyo raconte — histoire réécrite, voix off générée, audio d'origine retiré · 03 Publié sur vos 4 réseaux — rediffuser ne coûte rien) ; bande 4 réseaux conservée ; grille FCFA `#tarifs` : Gratuit 0 FCFA (3 créations offertes, 1 connexion, 10 publications) · Creator 9 900 FCFA/mois (30 créations, 2 connexions, 100 publications, badge « LE PLUS CHOISI », sur-élevée) · Pro 29 900 FCFA/mois (100 créations, 8 connexions, 500 publications, 3 espaces de travail) + mention fondateur (6 900 / 19 900 FCFA, 100 premiers) + footnote crédit ; ligne dogfooding après tarifs ; FAQ 4 questions existentes + « Pourquoi raconter plutôt que découper ? » ; CTA final « Créer mes premiers contenus » ; footer + filigrane « Create once. Be everywhere. » ; JSON-LD inline (FAQPage, SoftwareApplication avec offers XOF, Organization) -- cœur de la refonte.
- [x] `src/app/layout.tsx` -- title default « Omnelyo — La vidéo qui raconte », description SEO contrat, `alternates.canonical: "/"` -- métadonnées par défaut.
- [x] `src/app/opengraph-image.tsx` -- og-card DESIGN.md : fond crème, « La vidéo qui raconte. » en display 900 très serré + soulignement lime épais, « Omnelyo. » avec point orange, micro-ligne promesse ; purement typographique, lisible en vignette.
- [x] `src/app/robots.ts` -- ajouter `sitemap` (URL production `/sitemap.xml`) uniquement quand l'indexation est activée -- maillage.
- [x] `src/app/sitemap.ts` -- créer : `/`, `/partners`, 4 pages legal, avec `lastModified` -- maillage interne.

**Acceptance Criteria:**
- Given un viewport 360 px sans JS, when la landing charge, then h1 unique « La vidéo qui raconte. », CTA unique vers `/login`, preuve lisible sans scroll horizontal, FAQ ouvrable nativement.
- Given la grille tarifs affichée, then montants 0 / 9 900 / 29 900 en FCFA (aucun USD), Creator sur-élevée avec badge, footnote crédit présente, tous les CTA mènent à `/login`.
- Given l'env non-prod (ou indexation off), when `robots.txt` est servi, then `Disallow: /` sans ligne Sitemap ; en prod indexée : `Allow: /` + ligne `Sitemap:`.
- Given le HTML rendu, then un seul h1, un h2 par section, JSON-LD FAQPage/SoftwareApplication/Organization syntaxiquement valides, aucun `<video>`, aucune trace personas/ProductStory/« USD ».

## Spec Change Log

## Design Notes

- Preuve avant/après (cf. `mockups/key-proof.html`) : cartes papier, bordure encre 4 px, radius 32 px, rotations opposées ; badges mono pour 47:12 / 0:58 / 1,8 Go ; barre rayée (origine) vs barre lime ~38 % (raconté) ; « audio d'origine » barré ; kicker label-caps + tiret lime ; h2 « Raconté, pas découpé » avec « Raconté » en orange (grande taille autorisée).
- Hero (cf. `mockups/key-hero.html`) : halos CSS `lime-soft`/`orange-soft` flous, aucun asset ; CTA pilule lime + bordure encre 2 px + ombre teintée lime, hover lever -2 px désactivé sous `prefers-reduced-motion`.
- Cartes tarifs : prix en display-lg avec espace fine (« 9 900 »), libellé « FCFA / mois » ; mention fondateur en caption sous la grille, pas en carte.
- JSON-LD `SoftwareApplication` : `applicationCategory: "MultimediaApplication"`, `offers` = 3 `Offer` avec `price` 0/9900/29900 et `priceCurrency: "XOF"`. `FAQPage` reprend les 5 questions. `Organization` : nom, url, logo.
- Footer : « Create once. Be everywhere. » en filigrane discret ; sélecteur langue reste placeholder désactivé (« English — bientôt »).

## Verification

**Commands:**
- `npm run typecheck` -- expected : aucune erreur TypeScript.
- `npm run build` -- expected : build en succès, route `/` générée statiquement, aucune erreur metadata.
- `npm run lint` -- expected : aucune nouvelle erreur/warning sur les fichiers touchés.

**Manual checks (if no CLI):**
- `view-source` de `/` : h1 unique, JSON-LD parsable, canonical présent, aucune balise video/persona.
- Rendu 360 px : preuve sans scroll horizontal ; `robots.txt` en env local : `Disallow: /`.

## Suggested Review Order

**Message & IA de la landing (point d'entrée)**

- La une « La vidéo qui raconte. » — h1 unique, CTA unique, tout le repositionnement tient ici.
  [`page.tsx:68`](../../src/app/page.tsx#L68)

- La preuve avant/après codée : deux cartes penchées, zéro asset, remplace ProductStory.
  [`page.tsx:75`](../../src/app/page.tsx#L75)

- La grille FCFA (0 / 9 900 / 29 900) + fondateur + footnote crédit, Creator sur-élevée.
  [`page.tsx:167`](../../src/app/page.tsx#L167)

**SEO & métadonnées**

- Canonical déclaré par la page elle-même (pas le layout) pour éviter l'héritage par partners/legal/login.
  [`page.tsx:6`](../../src/app/page.tsx#L6)

- Title/description par défaut + OG/Twitter alignés sur la nouvelle une.
  [`layout.tsx:24`](../../src/app/layout.tsx#L24)

- JSON-LD @graph (Organization, SoftwareApplication XOF, FAQPage), échappement `<`.
  [`page.tsx:24`](../../src/app/page.tsx#L24)

- OG redessiné : og-card crème typographique, soulignement lime, point orange.
  [`opengraph-image.tsx:13`](../../src/app/opengraph-image.tsx#L13)

**Indexation & maillage**

- Ligne Sitemap conditionnelle (prod + indexation uniquement).
  [`robots.ts:9`](../../src/app/robots.ts#L9)

- Sitemap vide hors indexation ; liste `/`, `/partners`, 4 legal sinon.
  [`sitemap.ts:6`](../../src/app/sitemap.ts#L6)

- Source unique de l'URL du site, partagée par layout/page/robots/sitemap.
  [`site.ts:4`](../../src/lib/site.ts#L4)

**Système de design**

- Palette DESIGN.md dans `@theme` — fin des hex arbitraires sur la landing.
  [`globals.css:18`](../../src/app/globals.css#L18)

- Token migré `bg-foreground` → `bg-ink` (le token supprimé cassait le bouton partagé).
  [`button.tsx:5`](../../src/components/ui/button.tsx#L5)

- Manifest PWA aligné sur le nouveau message et le fond crème.
  [`manifest.ts:5`](../../src/app/manifest.ts#L5)

**Tests (périphériques)**

- JSON-LD parsé, offers cohérents avec les prix affichés, h1 unique, zéro video/USD, canonical page.
  [`page.test.tsx:1`](../../src/app/page.test.tsx#L1)

- Deux branches de robots.txt (prod+indexation vs défaut) exécutées.
  [`robots.test.ts:1`](../../src/app/robots.test.ts#L1)

- Contenu du sitemap selon l'env (6 URLs vs vide).
  [`sitemap.test.ts:1`](../../src/app/sitemap.test.ts#L1)

- Nav auth-aware : déconnecté SSR/client, connecté, session nettoyée.
  [`landing-auth-actions.test.tsx:1`](../../src/components/layout/landing-auth-actions.test.tsx#L1)
