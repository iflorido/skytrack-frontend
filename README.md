# SkyTrack Frontend

Aplicación de rastreo de vuelos en tiempo real con globo 3D interactivo. Conecta con la [SkyTrack API](https://github.com/iflorido/skytrack-api) para mostrar la posición de más de 12.000 aeronaves actualizadas cada 150 segundos.

## Vista previa

- 🌍 **Globo 3D CesiumJS** — empieza como esfera desde el espacio, se aplana progresivamente al hacer zoom
- ✈️ **12.000+ aeronaves** en tiempo real con iconos rotados según rumbo
- 🎨 **Tema NASA Dark** — panel de control estilo centro de control espacial (azules, cyan, monoespaciado)
- ☀️ **Tema Light** — alternativa limpia para uso diurno
- 📊 **Paneles flotantes arrastrables** — estadísticas, lista de vuelos, detalle de aeronave
- 📡 **WebSocket** con reconexión automática

## Stack tecnológico

- **React 18** + TypeScript + Vite
- **CesiumJS** + Resium — globo 3D con transición esfera→plano
- **Zustand** — estado global (vuelos, tema, paneles)
- **Framer Motion** — animaciones de paneles
- **Tailwind CSS** — estilos con dos temas (NASA dark / light)
- **Nginx** — servidor de producción dentro del contenedor Docker

## Estructura del proyecto

```
skytrack-frontend/
│
├── .github/
│   └── workflows/
│       └── docker-publish.yml      # CI/CD — build y push a ghcr.io
│
├── src/
│   ├── components/
│   │   ├── globe/
│   │   │   └── Globe.tsx           # Globo 3D CesiumJS — renderiza aviones como billboards
│   │   ├── panels/
│   │   │   ├── DraggablePanel.tsx  # Panel base arrastrable con minimizar/cerrar
│   │   │   ├── StatsPanel.tsx      # Estadísticas globales en tiempo real
│   │   │   ├── FlightListPanel.tsx # Lista de vuelos con búsqueda
│   │   │   └── FlightDetailPanel.tsx # Detalle completo de aeronave seleccionada
│   │   └── ui/
│   │       └── Navbar.tsx          # Barra superior — tema, paneles, contador
│   │
│   ├── hooks/
│   │   ├── useWebSocket.ts         # Conexión WebSocket con reconexión automática
│   │   └── useTheme.ts             # Aplica el tema al DOM
│   │
│   ├── stores/
│   │   ├── flightStore.ts          # Estado de vuelos, filtros y conexión (Zustand)
│   │   ├── panelStore.ts           # Estado de paneles — posición, visibilidad
│   │   └── themeStore.ts           # Estado del tema activo
│   │
│   ├── types/
│   │   └── index.ts                # Tipos TypeScript — Aircraft, Theme, Panel, etc.
│   │
│   ├── utils/
│   │   └── formatters.ts           # Formateo de altitud, velocidad, timestamps
│   │
│   ├── styles/
│   │   └── index.css               # CSS global con variables de tema NASA y Light
│   │
│   ├── App.tsx                     # Componente raíz
│   └── main.tsx                    # Punto de entrada React
│
├── .env.example                    # Plantilla de variables de entorno
├── .gitignore
├── Dockerfile                      # Multi-stage: Node builder + Nginx
├── index.html
├── nginx.conf                      # Config nginx para SPA
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_CESIUM_TOKEN` | Token de Cesium Ion (obligatorio). Obtén el tuyo gratis en [cesium.com/ion](https://cesium.com/ion/tokens) |
| `VITE_WS_URL` | URL del WebSocket de la API (por defecto `wss://api.flyskytrack.com/api/v1/states/live`) |
| `VITE_API_URL` | URL base de la API REST (por defecto `https://api.flyskytrack.com`) |

## Desarrollo local

```bash
# 1. Clona el repositorio
git clone https://github.com/iflorido/skytrack-frontend.git
cd skytrack-frontend

# 2. Instala dependencias
npm install

# 3. Crea el fichero de entorno
cp .env.example .env
# Edita .env y añade tu token de Cesium Ion

# 4. Arranca el servidor de desarrollo
npm run dev
# → http://localhost:5173
```

## Despliegue con Docker

### Build manual

```bash
docker build \
  --build-arg VITE_CESIUM_TOKEN=tu_token \
  -t skytrack-frontend:latest .
```

### Ejecutar el contenedor

```bash
docker run -d \
  --name skytrack-frontend \
  --restart unless-stopped \
  -p 80:80 \
  skytrack-frontend:latest
```

### CI/CD con GitHub Actions

Cada push a `main` construye y publica automáticamente la imagen en `ghcr.io/iflorido/skytrack-frontend:latest`.

Añade estos secrets en `Settings → Secrets → Actions` del repositorio:

| Secret | Valor |
|--------|-------|
| `VITE_CESIUM_TOKEN` | Tu token de Cesium Ion |

### Configuración Nginx en el VPS

```nginx
server {
    listen 443 ssl;
    server_name flyskytrack.com www.flyskytrack.com;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Repositorios relacionados

- **Backend API**: [github.com/iflorido/skytrack-api](https://github.com/iflorido/skytrack-api)
- **Datos**: [OpenSky Network](https://opensky-network.org)
- **Globo 3D**: [CesiumJS](https://cesium.com)
