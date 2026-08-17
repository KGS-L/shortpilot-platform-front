# Deferred Work

- source_spec: `{project-root}/_bmad-output/implementation-artifacts/spec-landing-video-qui-raconte.md`
  summary: Migrer les pages legal, partners et login vers les tokens de palette DESIGN.md (`bg-cream`, `text-ink`, `text-muted`…) pour remplacer les hex/lime/orange Tailwind codés en dur.
  evidence: La refonte a introduit les tokens dans `@theme` et migré uniquement la landing ; `src/app/legal/[slug]/page.tsx`, `src/app/partners/page.tsx` et `src/app/(auth)/login/page.tsx` utilisent encore `bg-[#fbfaf6]`, `text-slate-600`, `bg-lime-100` etc. (trouvé en revue step-04, hors périmètre « Ne pas modifier » de la spec).

- source_spec: `{project-root}/_bmad-output/implementation-artifacts/spec-landing-video-qui-raconte.md`
  summary: Ajouter un lien d'évitement « Aller au contenu » (skip-to-content) et des styles `focus-visible` sur la nav fixe de la landing.
  evidence: La nav fixe pleine largeur existait déjà avant la refonte (pattern préexistant, non exigé par le plancher d'accessibilité de la spec) ; les utilisateurs clavier doivent tabber toute la nav à chaque page (trouvé en revue step-04).
