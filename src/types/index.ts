// ── Aeronave / State Vector ──────────────────────────────────────────
export interface Aircraft {
  icao24: string
  callsign: string | null
  origin_country: string | null
  time_position: number | null
  last_contact: number | null
  longitude: number | null
  latitude: number | null
  baro_altitude: number | null
  geo_altitude: number | null
  on_ground: boolean
  velocity: number | null
  true_track: number | null
  vertical_rate: number | null
  squawk: string | null
  spi: boolean | null
  position_source: number | null
  position_source_name: string | null
  category: number | null
  category_name: string | null
  // Campos calculados por el backend
  altitude_ft: number | null
  velocity_kmh: number | null
  vertical_rate_fpm: number | null
  is_climbing: boolean | null
  is_descending: boolean | null
}

// ── Posición interpolada para animación suave ────────────────────────
export interface AircraftPosition {
  longitude: number
  latitude: number
  altitude: number
  heading: number
}

// ── Respuesta del WebSocket / REST ───────────────────────────────────
export interface LiveStateResponse {
  timestamp: number
  aircraft_count: number
  states: Aircraft[]
}

// ── Estadísticas globales ────────────────────────────────────────────
export interface GlobalStats {
  total_aircraft_live: number
  aircraft_airborne: number
  aircraft_on_ground: number
  aircraft_climbing: number
  aircraft_descending: number
  countries_represented: number
  last_update: number
  poll_interval_seconds: number
  opensky_authenticated: boolean
}

// ── Tema ─────────────────────────────────────────────────────────────
export type Theme = 'nasa' | 'light'

// ── Estado de conexión WebSocket ─────────────────────────────────────
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

// ── Panel flotante ───────────────────────────────────────────────────
export type PanelId = 'stats' | 'flightList' | 'flightDetail' | 'filters'

export interface PanelState {
  id: PanelId
  open: boolean
  position: { x: number; y: number }
  minimized: boolean
}

// ── Filtros activos ──────────────────────────────────────────────────
export interface Filters {
  onGround: boolean | null
  minAltitude: number | null
  maxAltitude: number | null
  country: string | null
  callsign: string | null
  categories: number[]
}
