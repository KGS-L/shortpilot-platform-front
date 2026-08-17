---
name: Omnelyo — Landing Page
description: Identité visuelle de la landing Omnelyo — affiche franche lime/orange/crème à gros traits noirs, ratification de la direction artistique existante.
status: final
created: 2026-08-17
updated: 2026-08-17
sources:
  - code actuel : ../../../../src/app/page.tsx, ../../../../src/app/globals.css, ../../../../src/app/layout.tsx
colors:
  cream: '#FBFAF6'
  paper: '#FFFFFF'
  ink: '#172033'
  lime: '#A3E635'
  lime-strong: '#84CC16'
  lime-soft: '#ECFCCB'
  orange: '#F97316'
  orange-soft: '#FDBA74'
  orange-light: '#FB923C'
  muted: '#475569'
typography:
  display-hero:
    fontFamily: Geist
    fontSize: 'clamp(3.3rem, 8vw, 7.2rem)'
    fontWeight: '900'
    lineHeight: '1.0'
    letterSpacing: -0.06em
  display-lg:
    fontFamily: Geist
    fontSize: 'clamp(2.2rem, 5vw, 3.8rem)'
    fontWeight: '900'
    lineHeight: '1.1'
    letterSpacing: -0.045em
  headline:
    fontFamily: Geist
    fontSize: '1.5rem'
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.1em
  caption:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 12px
  DEFAULT: 16px
  lg: 24px
  xl: 32px
  max: 40px
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 32px
  section-gap: 96px
  container: 1152px
components:
  button-primary:
    fill: '{colors.lime}'
    text: '{colors.ink}'
    border: '2px solid {colors.ink}'
    radius: '{rounded.full}'
    hover: 'translateY(-2px)'
  button-ghost:
    fill: transparent
    text: '{colors.ink}'
    radius: '{rounded.full}'
    hover: 'souligné ou bordure 1.5px {colors.ink}'
  card-tilted:
    surface: '{colors.paper}'
    border: '4px solid {colors.ink}'
    radius: '{rounded.xl}'
    rotation: '-5deg ou +4deg'
    shadow: '0 25px 50px -12px rgba(23,32,51,0.15)'
  card-network:
    surface: '{colors.paper}'
    radius: '{rounded.lg}'
    stagger: 'translateY alterné (20px / 0 / 40px / 10px)'
  price-card:
    surface: '{colors.paper}'
    border: '1px solid {colors.ink}'
    radius: '{rounded.lg}'
  price-card-featured:
    surface: '{colors.paper}'
    border: '2px solid {colors.ink}'
    radius: '{rounded.lg}'
    elevation: 'translateY(-16px) au repos sur desktop'
  pill-tag:
    radius: '{rounded.full}'
    fill: '{colors.lime-soft}'
    text: '{colors.ink}'
  og-card:
    surface: '{colors.cream}'
    format: '1200x630 (OG) / même art en 2:1 (Twitter)'
    composition: 'une typographique, aucun mock screenshot'
---

## Brand & Style

**L'affiche franche.** Omnelyo s'affiche comme un poster sérigraphié, pas comme un dashboard : aplats de couleur vive, traits noirs épais, typographie black serrée, cartes penchées comme posées à la va-vite sur une table de montage. La posture est l'opposé assumé du SaaS bleu générique d'OpusClip et Vizard — chaleureux, direct, zéro jargon.

Le ton visuel épouse le ton éditorial : honnête sur les limites (« aucune promesse magique, un vrai rythme »), sans néomorphism ni dégradés métalliques. Ce qui est montré est codé — le HTML/CSS est le médium, pas les screenshots produits.

Contrainte fondatrice : le marché vit sur téléphone, en bande passante faible. La richesse visuelle vient de la couleur, du trait et de la composition — jamais du poids des assets.

## Colors

Palette ratifiée depuis le code actuel (valeurs réellement utilisées, pas les tokens dormants) :

- **{colors.cream}** — le fond principal. Chaleur crème, remplace le blanc clinique des concurrents.
- **{colors.paper}** — la surface des cartes et panneaux, posée sur le crème.
- **{colors.ink}** — l'encre. Texte, gros traits de bordure, sections sombres. C'est le noir de l'affiche, pas un vrai noir.
- **{colors.lime}** — la couleur d'action. Boutons primaires, bande CTA finale. Toujours avec texte encre.
- **{colors.lime-strong} / {colors.lime-soft}** — accents et fonds doux (halos hero, badges, pills).
- **{colors.orange}** — la couleur vedette. Réservée aux mises en avant (mot clé d'un titre, point du logo, badges) — jamais pour du texte courant sur crème : contraste insuffisant (voir Do's and Don'ts). Fournit le point final du logo « Omnelyo. » sur l'og-card. **{colors.orange-light}** et **{colors.orange-soft}** en dégradés de la vedette pour les halos et fonds doux.
- **{colors.muted}** — texte secondaire sur fond clair.

À raccorder : `globals.css` expose `--brand:#70df1b`, jamais utilisé. Le chantier d'implémentation doit basculer les classes arbitraires de la page vers ces tokens (`--color-cream`, `--color-ink`, `--color-lime`…) pour que le DESIGN.md soit la seule source.

## Typography

Une seule famille — **Geist** (déjà chargée via next/font) — portée par le gras extrême plutôt que par la variété :

- **{typography.display-hero}** — la une. « La vidéo qui raconte. » tient en quatre mots précisément pour exister à cette échelle.
- **{typography.display-lg}** — titres de section, noirs, chasse serrée négative.
- **{typography.label-caps}** — kickers en capitales espacées au-dessus des sections.
- Corps et légendes en graisse normale — le contraste de graisse fait la hiérarchie.

Geist Mono reste réservé aux données techniques des mocks (durées, tailles de fichier, statuts).

## Layout & Spacing

Colonne unique centrée (`{spacing.container}`), sections espacées de `{spacing.section-gap}`. Marges latérales `{spacing.margin-mobile}` en mobile, `{spacing.margin-desktop}` au-delà. La grille est simple : une colonne, des cartes en composition libre (rotation, chevauchement léger) par-dessus.

## Elevation & Depth

Pas de néomorphisme. La profondeur vient de trois gestes : ombres larges et douces teintées encre (`rgba(23,32,51,0.15)`), ombre teintée lime sous le CTA primaire, et la **superposition penchée** — une carte qui chevauche sa voisine avec rotation remplace tout effet de profondeur.

## Shapes

Échelle de rayons généreuse et croissante avec la taille du contenant (`{rounded.sm}` pour les pills internes… `{rounded.max}` pour les grands panneaux), `{rounded.full}` pour tout ce qui est cliquable et petit. La pilule est la forme du bouton ; le rectangle épais est la forme de la carte.

## Components

- **button-primary** ({components.button-primary}) — pilule lime, trait encre 2px, texte encre. Le seul bouton de la page qui compte : « Créer mes premiers Shorts ». Au survol : léger lever `-2px` + ombre lime. Aucun second bouton concurrent dans le hero.
- **card-tilted** ({components.card-tilted}) — le geste signature : surface papier, bordure encre 4px, rotation ±4-5°. Utilisée pour la preuve « raconté vs découpé » (vidéo d'origine vs Short raconté) et les mocks.
- **card-network** ({components.card-network}) — cartes réseaux échelonnées verticalement (YouTube/TikTok/Instagram/Facebook), chacune « pensée pour sa destination ».
- **price-card / price-card-featured** ({components.price-card}, {components.price-card-featured}) — grille tarifaire FCFA ; la carte phare (Creator) se détache par sur-élévation au repos et badge « LE PLUS CHOISI ».
- **pill-tag** ({components.pill-tag}) — badges et micro-preuves (« 3 créations offertes », « Sans carte bancaire »).
- **og-card** ({components.og-card}) — l'affiche réduite pour les partages sociaux (Open Graph / Twitter) : fond crème, « La vidéo qui raconte. » en {typography.display-hero} resserré, trait de soulignement lime épais, « Omnelyo. » avec point orange, micro-ligne promesse en {typography.body-lg}. Typographique uniquement — lisible en vignette 1200×630, aucun mock screenshot, cohérente avec la une de la page.

## Do's and Don'ts

- **Do** — texte courant toujours en {colors.ink} sur crème ou sur lime ; contraste AA vérifié.
- **Don't** — jamais de texte courant {colors.orange} sur crème (≈3:1, sous AA) ; l'orange est décoratif ou réservé aux très grandes tailles avec vérification au cas par cas.
- **Do** — richesse par la couleur, le trait et la composition ; assets images < 150 Ko, aucune vidéo en autoplay.
- **Don't** — pas de dégradés métalliques, pas de mockup screenshot, pas de bleu SaaS, pas de faux témoignages avec photos de stock.
- **Don't** — pas de second CTA visuellement concurrent du bouton primaire dans le hero (Telegram est un bénéfice affiché, pas une porte d'entrée).
