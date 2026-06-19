FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine

# Default for local/docker-compose runtime; override in Render web service env.
ENV API_UPSTREAM=http://api:8080
ENV API_BASE_URL=
ENV CLOUDINARY_CLOUD_NAME=dphmqaruu
ENV CLOUDINARY_UPLOAD_PRESET=kmt-preset
ENV CLOUDINARY_FOLDER=services

# Note: --chmod also applies to the auto-created /etc/nginx/templates dir, so use
# 0755 (not 0644) — a 0644 dir loses its execute bit and becomes non-traversable
# for the unprivileged nginx user (uid 101), breaking 20-envsubst-on-templates.sh.
COPY --chmod=0755 deploy/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --chmod=0755 deploy/nginx/runtime-config.js.template /etc/nginx/templates/runtime-config.js.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
