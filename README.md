# Omnelyo Frontend

Interface SaaS d’Omnelyo construite avec Next.js, TypeScript et Tailwind CSS.

## Démarrage

```bash
cp .env.example .env.local
npm install
npm run dev
```

L'application est disponible sur `http://localhost:3000` et attend l'API sur
`NEXT_PUBLIC_API_URL` (`http://localhost:8000` par défaut).

`NEXT_PUBLIC_APP_URL` et `NEXT_PUBLIC_SITE_URL` définissent les URL publiques
propres à chaque environnement, notamment pour les métadonnées sociales. Elles
ne doivent pas être figées sur le futur domaine de production.

## Commandes

- `npm run dev` : serveur de développement ;
- `npm run build` : build de production ;
- `npm run lint` : ESLint ;
- `npm run typecheck` : vérification TypeScript ;
- `npm run test` : tests Vitest ;
- `npm run generate:api` : types TypeScript depuis FastAPI OpenAPI.

## Architecture

- `src/app` : routes et layouts Next.js ;
- `src/components/ui` : primitives visuelles réutilisables ;
- `src/components/layout` : navigation et structure des pages ;
- `src/features` : logique organisée par domaine métier ;
- `src/lib` : configuration, client HTTP et utilitaires ;
- `src/generated` : types générés depuis `/openapi.json`.

Les secrets ne doivent jamais utiliser le préfixe `NEXT_PUBLIC_`. Seules les
valeurs destinées au navigateur peuvent apparaître dans `.env.local` avec ce
préfixe.
