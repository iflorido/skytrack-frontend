# ── Stage 1: Build ──
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --no-audit

COPY . .
RUN npm run build

# ── Stage 2: Serve ──
FROM node:20-alpine

RUN npm install -g serve

WORKDIR /app
COPY --from=build /app/dist ./dist

EXPOSE 5077

# --single activa el modo SPA: redirige todas las rutas a index.html
CMD ["serve", "-s", "dist", "-l", "5077", "--single"]