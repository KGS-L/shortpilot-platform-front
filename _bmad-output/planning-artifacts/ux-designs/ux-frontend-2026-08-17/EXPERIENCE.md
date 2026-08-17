---
name: Omnelyo — Landing Page
status: final
sources:
  - ../../briefs/brief-frontend-2026-08-17/.memlog.md (atelier brief, 11 décisions)
  - ../../../../../api/_bmad-output/brainstorming/brainstorm-positionnement-omnelyo-2026-08-17/.memlog.md
  - ../../../../../BUSINESS_MODEL.md
  - ../../../../../api/docs/decisions.md
updated: 2026-08-17
---

# Omnelyo Landing — Experience Spine

> Retravail centré message : la page doit vendre « le Short raconté, pas le Short découpé ». DA existante ratifiée dans `DESIGN.md` (paire de contrats). Mobile-first, bande passante faible, français prioritaire.

## Foundation

Surface unique : landing marketing responsive web (Next.js 16 App Router, Tailwind v4, composants bruts — la landing n'utilise aucune primitive partagée de `src/components/ui/`). `DESIGN.md` est la référence d'identité visuelle ; cette colonne est l'expérience. Un seul objectif de conversion : **l'inscription (email/OTP ou Google) pour toucher les 3 créations offertes** → `/login` (« création » est le nom marché du crédit de rendu — même unité, un seul mot exposé). La future fonctionnalité signature « Re-raconter » (3 versions du récit, autre voix/angle) doit trouver sa place dans l'architecture **sans être promise** sur la page.

Contraintes de fond : mobile-first non négociable (l'utilisateur cible vit sur son téléphone, mid-range Android, 3G) ; sobriété de poids (assets < 150 Ko, pas d'autoplay vidéo, poster léger ou aucun) ; français au lancement, anglais « bientôt ». SEO activé uniquement sur le domaine de production via `NEXT_PUBLIC_INDEXING_ENABLED=true` (les environnements de test servent `noindex, nofollow` + robots.txt bloquant — comportement déjà en place, à préserver).

## Information Architecture

| # | Section | Rôle | Décisions |
|---|---|---|---|
| 0 | Nav fixe | Logo « Omnelyo. », ancres (Preuve, Comment ça marche, Tarifs), actions auth | Auth-aware : « Mon tableau de bord » si connecté, sinon « Se connecter » + « Créer gratuitement » |
| 1 | Hero | La une + la promesse + le seul CTA | La une **« La vidéo qui raconte. »** (h1 unique) ; sous-titre : « Collez un lien. Recevez un Short raconté — histoire nouvelle, voix off, publié sur vos 4 réseaux. » (duo confirmé) ; CTA unique « Créer mes premiers Shorts » → `/login` ; microcopy « 3 créations offertes · Sans carte bancaire · Aucune promesse magique, un vrai rythme ». Pas de second CTA. La pilule « Create once. Be everywhere. » quitte le hero (footer uniquement) |
| 2 | Preuve « Raconté, pas découpé » | Montrer la transformation, catégorie nouvelle | Avant/après **statique codé** : 2 {components.card-tilted} — « La vidéo d'origine » (47:12, audio d'origine, 1,8 Go) vs « Le Short raconté » (0:58, histoire nouvelle, voix off, audio d'origine retiré) + une ligne de contraste explicite découpe ≠ récit. Zéro asset lourd. Remplace le mock `ProductStory` actuel |
| 3 | Le problème (bande sombre ink) | Pourquoi ça existe | Conservée, copy réframée sur « publier sans savoir monter » [ASSUMPTION — direction de copy à valider] |
| 4 | Comment ça marche | 3 étapes autour du récit | 01 « Confiez votre source » (lien, upload, **Telegram en bénéfice** : « votre studio vit dans Telegram, sans application ») · 02 « Omnelyo raconte » (histoire réécrite, voix off générée, audio d'origine retiré) · 03 « Publié sur vos 4 réseaux » (rediffuser ailleurs ne coûte rien) |
| 5 | Bande orange 4 réseaux | Multiplication des chances | Conservée : 4 {components.card-network} échelonnées YouTube/TikTok/Instagram/Facebook |
| 6 | Tarifs | Grille FCFA complète | Gratuit 0 FCFA (3 créations offertes, 1 connexion, 10 publications) · Creator **9 900 FCFA/mois** (30 créations, 2 connexions, 100 publications, badge « LE PLUS CHOISI ») · Pro **29 900 FCFA/mois** (100 créations, 8 connexions, 500 publications, 3 espaces de travail) · offre fondateur mentionnée (6 900 / 19 900 FCFA, 100 premiers) [ASSUMPTION — mention et libellé exacts de l'offre fondateur] · footnote crédit conservée (« une création = un rendu réussi ; republier ne consomme pas de crédit ») · tous les CTA → `/login`. Carte phare (Creator) sur-élevée. **Bloqueur : grille à valider avant mise en ligne** |
| 7 | Preuve sociale honnête | Assumer le lancement | Dogfooding assumé : « Les Shorts de notre compte démo sont faits avec Omnelyo. » [ASSUMPTION — placement après tarifs] — aucun faux témoignage |
| 8 | FAQ | Rester honnête | 4 questions actuelles conservées (publication à ma place, privacité, rendu échoué, sans carte) + ajout proposé « Pourquoi raconter plutôt que découper ? » [ASSUMPTION] |
| 9 | CTA final (bande lime) | Dernier élan | « Créer mes premiers contenus » → `/login` |
| 10 | Footer | Rangement | « Create once. Be everywhere. » vit ici (filigrane) ; liens Produit/Communauté (`/partners`)/Informations (4 pages legal) ; sélecteur langue placeholder ; disclaimer revenus conservé |

**Supprimé** : la section « Quel est votre prochain cap ? » et ses 4 personas (dilution — segment pro en phase 2). **Reporté** : la section démo vidéo 60 s (fichier inexistant, spec < 8 Mo à produire) — la preuve statique la remplace en attendant [ASSUMPTION — réintroduire la section quand la vidéo existera].

→ Références de composition : `mockups/key-hero.html` (états déconnecté / connecté), `mockups/key-proof.html` (preuve avant/après). Les spines gagnent sur tout conflit avec une maquette.

## Voice and Tone

Microcopy. La voix de marque vit dans `DESIGN.md` → Brand & Style.

| Do | Don't |
|---|---|
| « Short raconté », « histoire nouvelle », « voix off » | « clips courts », « extraits », « redécoupez » |
| « 3 créations offertes · Sans carte bancaire » | « Essai gratuit » tout court |
| « Aucune promesse magique, un vrai rythme » | « 10× votre audience » |
| « Que se passe-t-il si un rendu échoue ? » (FAQ assumée) | Taire les échecs de rendu |
| « Les Shorts de notre compte démo sont faits avec Omnelyo » | Témoignages inventés, photos de stock |
| Prix en FCFA | Prix en USD |

## Component Patterns

Behavioral — les spec visuelles vivent dans `DESIGN.md` → Components.

| Composant | Usage | Règles comportementales |
|---|---|---|
| CTA primaire | Hero, CTA final, cartes tarifs | Lien vers `/login`. Un seul par zone de décision. Jamais de CTA Telegram concurrent — Telegram apparaît en bénéfice texte/visuel (section 4), jamais comme action d'inscription. |
| LandingAuthActions | Nav | Client-side : lit le token localStorage (`storage` event) → « Mon tableau de bord » (`/dashboard`) si connecté, sinon « Se connecter » + « Créer gratuitement ». |
| Preuve avant/après | Section 2 | Statique, codé, aucune vidéo ni image lourde ; lisible sans scroll horizontal en 360 px ; fonctionne sans JS. |
| FAQ item | Section 8 | `<details>` natif (accessible sans JS), chevron rotatif. |
| Carte tarif | Section 6 | Kicker plan, prix FCFA en {typography.display-lg}, liste de quotas, CTA → `/login`. Carte vedette sur-élevée. |
| Sélecteur langue | Footer | Placeholder désactivé visuellement (« English — bientôt »), aucune action — ne pas simuler un changement de langue. |

## State Patterns

| État | Surface | Traitement |
|---|---|---|
| Visiteur connecté | Nav + CTA | Nav passe en « Mon tableau de bord » ; la landing reste consultable (pas de redirection). |
| Réseau lent / 3G | Global | Hero sans image de fond lourde ; halos CSS uniquement ; tout asset décoratif en chargement différé ; pas d'autoplay ; la page reste complète sans JS (liens et `<details>` natifs). |
| Vidéo démo absente | Preuve | Ignorée : la preuve statique est autoportante. Aucun `<video>` cassé exposé. |
| JS désactivé | Global | Nav, ancres, FAQ, preuve et tarifs fonctionnent (liens natifs). Seul l'état auth-aware dégrade vers « Se connecter ». |

## Interaction Primitives

Tap/click uniquement — aucune dépendance au hover pour comprendre.

- Ancres de nav → scroll doux vers les sections [ASSUMPTION — comportement actuel à conserver].
- `<details>` natif pour la FAQ ; ouverture d'un item ne referme pas les autres.
- Hover = bonus décoratif (lever de carte `-2px`, rotation légère), jamais porteur d'information.
- **Interdits** : autoplay vidéo, second CTA dans le hero, porte d'entrée d'inscription via Telegram, carrousel auto-défilant, animation bloquant le rendu au premier paint.

## Accessibility Floor

Behavioral — le contraste visuel vit dans `DESIGN.md`.

- Cibles tactiles ≥ 44 px (CTA, liens nav, summary FAQ).
- Contraste : texte courant ink sur crème/lime = AA ; interdiction du orange sur crème pour du texte courant (règle DESIGN.md).
- `<details>`/`<summary>` natifs : sémantique gratuite, annoncés au lecteur d'écran.
- `lang="fr"` (déjà en place), hiérarchie de titres strictement séquentielle (un seul h1 : « La vidéo qui raconte. »).
- Respect de `prefers-reduced-motion` : les levers/rotations au survol se désactivent.

## Responsive & Platform

Mobile-first — le desktop est l'extension.

| Viewport | Comportement |
|---|---|
| < 768 px (défaut) | Colonne unique ; cartes preuve empilées avec rotations réduites (±2°) ; liens de nav cachés (logo + actions auth seulement) ; H1 clamp à 3,3 rem. |
| ≥ 768 px | Ancres de nav visibles ; preuve en composition 2 cartes penchées côte à côte ; grille tarifaire 3 colonnes. |
| ≥ 1024 px | Espacements max, carte phare sur-élevée, bande 4 réseaux en échelonné complet. |

Cible de référence : Android milieu de gamme, viewport 360 px, 3G instable. La page doit être utile avant d'être belle.

## SEO & Discoverability

Section inventée — préoccupation produit (acquisition organique francophone). Ne s'active que sur le domaine de production (`NEXT_PUBLIC_INDEXING_ENABLED=true`) ; les environnements de test restent `noindex` + robots.txt bloquant.

**Métadonnées (français, par défaut de page)**

- `<title>` : « Omnelyo — La vidéo qui raconte » [ASSUMPTION — 30 caractères, marque + une ; variante à tester : « Omnelyo — le Short raconté, avec voix off »].
- Meta description (~155 caractères) : « Collez un lien. Recevez un Short raconté — histoire nouvelle, voix off — publié sur vos 4 réseaux. 3 créations offertes, sans carte bancaire. » [ASSUMPTION libellé].
- Open Graph / Twitter Card : image sociale dérivée de `opengraph-image.tsx` / `twitter-image.tsx` existants, redessinée sur la nouvelle une (voir {components.og-card} dans DESIGN.md). `og:locale=fr_FR`.
- Canonical sur l'URL de production ; `lang="fr"` (en place). Quand l'anglais existera : `hreflang` fr/en réciproques — pas avant.

**Mots-clés** — stratégie « catégorie propre » : le terme « Short raconté » n'appartient à aucun concurrent et doit devenir l'expression possédée (la une, le title, l'OG). Secondaires naturels dans les H2 et le corps : « transformer une vidéo en Short », « Short avec voix off IA », « publier sur YouTube TikTok Instagram Facebook », « voix off en français ». Pas de bourrage : la page dit déjà ces choses honnêtement.

**HTML sémantique** — un seul `h1` (la une), `h2` par section, `h3` pour les cartes ; `<section>` identifiées avec ancres propres (`#preuve`, `#comment`, `#tarifs`) ; FAQ en vrai texte dans le DOM (`<details>` natif = crawlable).

**Données structurées (JSON-LD)**

- `FAQPage` sur les questions de la section 8 (dont la nouvelle « Pourquoi raconter plutôt que découper ? ») — éligible aux résultats enrichis.
- `SoftwareApplication` : name Omnelyo, applicationCategory MultimediaApplication, `offers` en XOF (grille FCFA — n'activer que grille validée).
- `Organization` : nom, logo, URL — dès l'indexation.

**Performance = SEO (Core Web Vitals)** — les décisions bande passante servent directement le classement : LCP = texte du hero (aucune image critique) ; aucun layout shift (cartes en `transform` uniquement, dimensions fixées) ; `next/font` auto-hébergé avec `display: swap` (en place) ; toute image résiduelle compressée < 150 Ko avec dimensions explicites ; vidéo démo future en `preload="none"`.

**Maillage interne** — footer vers `/partners` et les 4 pages legal ; sitemap (`sitemap.ts` à ajouter) listant landing, partners et legal dès l'indexation activée.

## Inspiration & Anti-patterns

- **Conservé (déjà à nous)** : le ton honnête anti-promesse-magique, la FAQ des échecs, la DA lime/orange/crème à gros traits — différenciateur face au bleu SaaS d'OpusClip/Vizard.
- **Conservé en filigrane** : « Create once. Be everywhere. » passe du hero au footer ; la une appartient à « La vidéo qui raconte. »
- **Rejeté — la section 4 personas** : « Quel est votre prochain cap ? » diluait la promesse ; Kevin seul au lancement, Aïcha en phase 2.
- **Rejeté — Telegram comme CTA** : techniquement impossible (le bot se lie après création du compte web via Paramètres → Intégrations) ; l'afficher comme porte d'entrée créerait une impasse.
- **Rejeté — prix en USD** : le GTM est FCFA/MoneyFusion ; la grille s'affiche en FCFA (à valider avant mise en ligne).
- **Rejeté — faux témoignages** : aucune preuve sociale réelle au lancement → dogfooding assumé.
- **Non promis — « Re-raconter »** : l'architecture laisse la place à la variation (3 versions du récit) sans l'afficher.

## Key Flows

### Flow 1 — Kevin découvre la différence (Kevin, 24 ans, Abidjan, Android milieu de gamme, 3G)

1. Kevin suit un lien partagé dans un groupe Telegram, un soir, depuis son téléphone.
2. La page se peint vite : fond crème, halos CSS, aucun asset lourd à attendre. Il lit la une : **« La vidéo qui raconte. »** puis la promesse : « Collez un lien. Recevez un Short raconté — histoire nouvelle, voix off, publié sur vos 4 réseaux. »
3. Il fait défiler d'un geste. Deux cartes penchées se répondent : sa réalité (la vidéo de 47 minutes qu'il n'a jamais le temps de monter) face au résultat (un Short de 58 secondes, une autre voix qui raconte, l'audio d'origine retiré).
4. Il tape « Créer mes premiers Shorts ». Microcopy : « 3 créations offertes · Sans carte bancaire ».
5. **Climax** : sur l'écran d'inscription, Kevin n'a pas besoin de deviner ce que fait l'outil — en dix secondes et zéro vidéo chargée, il a compris la différence entre découper et raconter, et il n'a fourni ni carte ni montage pour commencer.

Échec : réseau instable au moment du tap → page déjà rendue, lien `/login` natif, re-tap possible sans état corrompu.

### Flow 2 — Kevin revient, déjà connecté (mardi suivant, favoris)

1. Kevin rouvre la landing depuis ses favoris pour partager le lien à un ami.
2. La nav affiche « Mon tableau de bord » — le localStorage auth est honoré sans rechargement serveur.
3. Il vérifie d'un œil la grille FCFA (section 6) avant de partager — les montants sont ceux annoncés, en FCFA.
4. **Climax** : il copie l'URL et la colle dans son groupe Telegram avec « regarde ça, ça raconte tes vidéos » — la page est sa carte de visite, et elle dit exactement ce que lui-même a vécu.

Échec : token expiré → la nav retombe proprement sur « Se connecter » ; aucun écran d'erreur, aucun blocage.

## Open Questions

1. **[BLOQUEUR]** Validation de la grille tarifaire FCFA avant mise en ligne (atelier business model en attente côté backend). Conditionne aussi les `offers` XOF du JSON-LD.
2. Copy réframée de la section problème (bande sombre) — direction proposée, rédaction à valider.
3. Réintégration de la section démo vidéo 60 s une fois la vidéo produite (< 8 Mo) — placement et priorité.
4. Mention exacte de l'offre fondateur sur la grille tarifaire (badge, durée, conditions).
5. Libellés SEO à figer : title exact, meta description, variante de test.
6. Placement définitif de la preuve sociale dogfooding (proposé : après tarifs).
7. Libellé définitif de la question FAQ ajoutée « Pourquoi raconter plutôt que découper ? » — et confirmation qu'on l'ajoute.
