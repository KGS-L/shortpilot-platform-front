#!/usr/bin/env bash
set -Eeuo pipefail

deploy_user="${1:-deploy}"
frontend_path="${2:-/opt/omnelyo/frontend}"

if [[ $EUID -ne 0 ]]; then
  echo "Ce script doit être exécuté avec sudo." >&2
  exit 1
fi

echo "Préparation du VPS pour le déploiement du frontend Omnelyo..."

# S'assurer que le groupe docker existe et que l'utilisateur y appartient
if id "$deploy_user" &>/dev/null; then
  usermod -aG docker "$deploy_user"
  echo "Utilisateur '$deploy_user' ajouté au groupe docker."
else
  echo "Attention : l'utilisateur '$deploy_user' n'existe pas encore sur ce VPS." >&2
fi

# Créer le répertoire dédié au frontend
install -d -m 0750 -o "$deploy_user" -g docker "$frontend_path"
echo "Répertoire $frontend_path créé avec les bonnes permissions."

# Vérification Nginx
if command -v nginx >/dev/null 2>&1; then
  nginx -t
else
  echo "Nginx n'est pas encore installé. Installe-le avec 'apt-get install nginx'." >&2
fi

echo "Préparation terminée. Le dossier $frontend_path est prêt pour les déploiements."
