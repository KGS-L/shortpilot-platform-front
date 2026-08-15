# Déploiement staging du Frontend Omnelyo

Le workflow `.github/workflows/deploy.yml` valide le frontend, publie une image
dans GitHub Container Registry (GHCR), puis déploie l'image immuable (identifiée par le SHA Git)
sur le VPS en utilisant un **runner GitHub auto-hébergé** (sur la même architecture que le backend).

## Configuration GitHub

Créer un environnement GitHub nommé `staging`.

### Secrets GitHub (Environment / Repository Secrets)

| Secret | Description / Valeur attendue |
|---|---|
| `VPS_FRONTEND_PATH` | Dossier absolu sur le VPS, par exemple `/opt/omnelyo/frontend` ou `/home/admin/projects/omnelyo/frontend` |
| `GHCR_USERNAME` | Compte GitHub autorisé à lire le package container |
| `GHCR_TOKEN` | Token GitHub (Personal Access Token) limité à `read:packages` |

### Variables GitHub (Actions Variables)

- `NEXT_PUBLIC_API_URL` : URL de l'API (ex: `https://api-omnelyo.kgslab.com`)
- `NEXT_PUBLIC_APP_URL` : URL de l'application (ex: `https://omnelyo.kgslab.com`)
- `NEXT_PUBLIC_SITE_URL` : URL du site public (ex: `https://omnelyo.kgslab.com`)
- `NEXT_PUBLIC_ENVIRONMENT` : `staging`

Le workflow force `NEXT_PUBLIC_INDEXING_ENABLED=false` pour bloquer le référencement sur l'environnement de staging. Les variables `NEXT_PUBLIC_*` sont incorporées au bundle pendant la construction et ne doivent contenir aucun secret.

Le job `deploy` utilise un runner GitHub auto-hébergé sur le VPS (`runs-on: [self-hosted, Linux, X64]`). La connexion du runner vers GitHub est sortante : aucun accès SSH entrant depuis les runners distants de GitHub n'est requis.

---

## Préparation unique du VPS (Installation Nginx & SSL)

> [!IMPORTANT]
> Pour que le site soit accessible publiquement en HTTPS (`https://omnelyo.kgslab.com`), vous devez exécuter **une seule fois avec sudo** la commande de configuration Nginx et SSL sur le VPS :
> ```bash
> cd /home/admin/projects/omnelyo/frontend
> sudo bash scripts/configure-nginx.sh --domain omnelyo.kgslab.com --expected-ip 72.61.98.7 --email votre-email@example.com
> ```

1. **Créer le répertoire dédié au frontend et attribuer les droits** :
   ```bash
   sudo bash scripts/bootstrap-vps-env.sh admin /home/admin/projects/omnelyo/frontend
   ```

2. **Vérification Nginx & DNS (sans SSL)** :
   ```bash
   sudo bash scripts/configure-nginx.sh --domain omnelyo.kgslab.com --expected-ip 72.61.98.7
   ```

3. **Activation du certificat SSL/TLS Let's Encrypt (Certbot)** :
   ```bash
   sudo bash scripts/configure-nginx.sh --domain omnelyo.kgslab.com --expected-ip 72.61.98.7 --email votre-email@example.com
   ```

---

## Déploiement et Rollback Automatique

Un push sur la branche `main` déclenche automatiquement :
1. Validation Lint, Type-Check TypeScript et tests Vitest.
2. Build Docker de l'application Next.js standalone.
3. Publication de l'image immuable sur GHCR avec le tag `${GITHUB_SHA}` et `staging-latest`.
4. Remplacement du conteneur `omnelyo-frontend` sur le VPS.
5. Contrôle de santé local sur `http://127.0.0.1:3000/`.

Si le contrôleur de santé échoue pendant la minute qui suit le déploiement, le script **restaure automatiquement** la version de l'image précédente enregistrée dans `.deployed-frontend-image`.

### Rollback manuel

Pour revenir manuellement à l'image précédente directement sur le VPS :

```bash
cd /opt/omnelyo/frontend
previous_image=$(cat .deployed-frontend-image)
FRONTEND_IMAGE="$previous_image" docker compose -f compose.staging.yml up -d --no-deps --force-recreate frontend
curl --fail http://127.0.0.1:3000/
```

Pour déployer manuellement un SHA d'image spécifique :

```bash
cd /opt/omnelyo/frontend
FRONTEND_IMAGE="ghcr.io/PROPRIETAIRE/omnelyo-frontend:COMMIT_SHA" docker compose -f compose.staging.yml up -d --no-deps --force-recreate frontend
```
