# Déploiement staging d’Omnelyo

Le workflow `.github/workflows/deploy.yml` valide le frontend, publie une image
dans GHCR, puis remplace uniquement le conteneur `omnelyo-frontend`. PostgreSQL,
Redis, l’API, les workers et le bot ne font pas partie du fichier Compose et ne
peuvent donc pas être redémarrés par ce déploiement.

## Configuration GitHub

Créer les secrets Actions suivants dans les paramètres du dépôt :

- `VPS_HOST` : nom DNS ou adresse IP du VPS ;
- `VPS_PORT` : port SSH, généralement `22` ;
- `VPS_USER` : utilisateur de déploiement membre du groupe Docker ;
- `VPS_SSH_PRIVATE_KEY` : clé privée dédiée au déploiement ;
- `VPS_KNOWN_HOSTS` : ligne `known_hosts` vérifiée pour le VPS ;
- `VPS_FRONTEND_PATH` : dossier absolu dédié, par exemple `/opt/omnelyo/frontend`.

Créer également les variables Actions suivantes :

- `NEXT_PUBLIC_API_URL=https://api-omnelyo.kgslab.com`
- `NEXT_PUBLIC_APP_URL=https://omnelyo.kgslab.com`
- `NEXT_PUBLIC_SITE_URL=https://omnelyo.kgslab.com`
- `NEXT_PUBLIC_ENVIRONMENT=staging`

Le workflow force `NEXT_PUBLIC_INDEXING_ENABLED=false`. De plus, le code refuse
l’indexation hors de `production`, même si cette valeur était accidentellement
activée. Les variables `NEXT_PUBLIC_*` sont incorporées au bundle pendant la
construction et ne doivent contenir aucun secret.

Si le paquet GHCR est privé, vérifier dans ses paramètres qu’il hérite bien des
droits du dépôt ou que le dépôt dispose d’un accès Actions en lecture/écriture.

### Construction sécurisée de `VPS_KNOWN_HOSTS`

Depuis une machine d’administration fiable, récupérer la clé, comparer son
empreinte à celle affichée directement sur le VPS, puis enregistrer la ligne
validée comme secret GitHub :

```bash
ssh-keyscan -p 22 omnelyo.kgslab.com > omnelyo_known_hosts
ssh-keygen -lf omnelyo_known_hosts
```

Ne jamais produire ce secret dynamiquement dans le workflow : cela annulerait la
protection contre les attaques de l’homme du milieu.

## Préparation unique du VPS

Docker Engine, le plugin Docker Compose, `curl` et Nginx doivent être installés. Ensuite,
avec le nom réel de l’utilisateur de déploiement :

```bash
sudo usermod -aG docker DEPLOY_USER
sudo install -d -m 0750 -o DEPLOY_USER -g docker /opt/omnelyo/frontend
sudo nginx -t
```

Fermer puis rouvrir la session de `DEPLOY_USER` pour appliquer son appartenance
au groupe Docker. Définir ensuite `VPS_FRONTEND_PATH=/opt/omnelyo/frontend` dans
GitHub. Le workflow y copie automatiquement `compose.staging.yml` et le script
de déploiement ; aucun clone Git n’est nécessaire sur le VPS.

Le pare-feu du VPS ne doit pas exposer le port `3000`. Le Compose publie le
service uniquement sur `127.0.0.1:3000`.

## Configuration Nginx

Exemple de bloc pour `/etc/nginx/sites-available/omnelyo-staging` :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name omnelyo.kgslab.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name omnelyo.kgslab.com;

    ssl_certificate /etc/letsencrypt/live/omnelyo.kgslab.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/omnelyo.kgslab.com/privkey.pem;

    add_header X-Robots-Tag "noindex, nofollow" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_buffering off;
        proxy_read_timeout 60s;
    }
}
```

Activer et valider la configuration sans toucher aux autres services :

```bash
sudo ln -s /etc/nginx/sites-available/omnelyo-staging /etc/nginx/sites-enabled/omnelyo-staging
sudo nginx -t
sudo systemctl reload nginx
```

## Rollback automatique et manuel

Avant chaque remplacement, le script enregistre l’image courante dans
`.previous-frontend-image`. Si le contrôle local ou HTTPS échoue pendant une
minute, il recrée automatiquement le frontend avec cette image et fait échouer
le workflow.

Rollback manuel vers l’image précédente :

```bash
cd /opt/omnelyo/frontend
previous_image=$(cat .previous-frontend-image)
FRONTEND_IMAGE="$previous_image" docker compose -f compose.staging.yml up -d --no-deps --force-recreate frontend
curl --fail --show-error https://omnelyo.kgslab.com/
```

Rollback manuel vers un SHA précis déjà présent sur le VPS :

```bash
cd /opt/omnelyo/frontend
FRONTEND_IMAGE="ghcr.io/OWNER/FRONTEND_REPOSITORY:COMMIT_SHA" docker compose -f compose.staging.yml up -d --no-deps --force-recreate frontend
```

Si l’image SHA n’est plus locale, effectuer au préalable un `docker login
ghcr.io` avec un jeton personnel limité à `read:packages`, puis exécuter
`docker compose pull frontend`. Ne jamais placer ce jeton dans le Compose.
