# ── Stage 1: Builder ─────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar dependencias primero para aprovechar cache
COPY package*.json ./
RUN npm install --prefer-offline

# Copiar código fuente
COPY . .

# Build de producción
# El token de Cesium se pasa como build arg
ARG VITE_CESIUM_TOKEN
ARG VITE_WS_URL=wss://api.flyskytrack.com/api/v1/states/live
ARG VITE_API_URL=https://api.flyskytrack.com

ENV VITE_CESIUM_TOKEN=$VITE_CESIUM_TOKEN
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build


# ── Stage 2: Nginx ───────────────────────────────────────────────────
FROM nginx:alpine

# Configuración de nginx para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build de Vite
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]