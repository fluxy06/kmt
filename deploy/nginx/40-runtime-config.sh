#!/bin/sh
set -eu

# Пишем в conf.d (tmpfs при read-only контейнере) — nginx отдаёт файл оттуда
# через alias в location = /runtime-config.js
envsubst '${API_BASE_URL} ${CLOUDINARY_CLOUD_NAME} ${CLOUDINARY_UPLOAD_PRESET} ${CLOUDINARY_FOLDER}' \
  < /etc/nginx/templates/runtime-config.js.template \
  > /etc/nginx/conf.d/runtime-config.js
