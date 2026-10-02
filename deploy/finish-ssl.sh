#!/usr/bin/env bash
set -euo pipefail

DOMAIN="nieblasoundbranding.com"
WEBROOT="/var/www/certbot"
NGINX_CONF="/etc/nginx/conf.d/nieblasoundbranding.conf"
NGINX_SSL_SOURCE="/root/nginx-nieblasoundbranding-ssl.conf"
NGINX_PID_FILE="/run/nginx.pid"
# Solo el master del host (PPID 1); los contenedores Docker también ejecutan procesos nginx.
NGINX_MASTER_PID="$(pgrep -x -P 1 nginx || true)"

if [[ -z "${NGINX_MASTER_PID}" ]]; then
  echo "No se encontró nginx en ejecución."
  exit 1
fi

echo "==> Solicitando certificado Let's Encrypt para ${DOMAIN}..."
certbot certonly --webroot -w "${WEBROOT}" \
  -d "${DOMAIN}" -d "www.${DOMAIN}" \
  --non-interactive --agree-tos --register-unsafely-without-email \
  --preferred-challenges http-01

echo "==> Activando configuración HTTPS..."
cp "${NGINX_SSL_SOURCE}" "${NGINX_CONF}"
nginx -t
echo "${NGINX_MASTER_PID}" > "${NGINX_PID_FILE}"
kill -HUP "${NGINX_MASTER_PID}"

echo "==> Listo. Prueba: https://${DOMAIN}/"
