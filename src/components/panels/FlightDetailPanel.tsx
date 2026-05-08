import { useState, useEffect } from 'react'
import { Info, X, Navigation, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import DraggablePanel from './DraggablePanel'
import { useFlightStore } from '../../stores/flightStore'
import {
  formatAltitude, formatSpeed, formatVerticalRate,
  formatTimeSince, positionSourceName
} from '../../utils/formatters'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.flyskytrack.com'

interface FlightInfo {
  callsign: string | null
  estDepartureAirport: string | null
  estArrivalAirport: string | null
  firstSeen: number
  lastSeen: number
}

export interface TrackWaypoint {
  timestamp: number
  latitude: number | null
  longitude: number | null
  baro_altitude: number | null
  true_track: number | null
  on_ground: boolean | null
}

export interface TrackData {
  icao24: string
  callsign: string | null
  start_time: number
  end_time: number
  waypoints: TrackWaypoint[]
}

// Store global para la trayectoria activa — el Globe la lee
let trackDataCallback: ((data: TrackData | null) => void) | null = null
export function setTrackDataCallback(cb: typeof trackDataCallback) {
  trackDataCallback = cb
}

export default function FlightDetailPanel() {
  const selectedIcao = useFlightStore(s => s.selectedIcao)
  const aircraft = useFlightStore(s => s.aircraft)
  const selectAircraft = useFlightStore(s => s.selectAircraft)

  const [flightInfo, setFlightInfo] = useState<FlightInfo | null>(null)
  const [trackData, setTrackData] = useState<TrackData | null>(null)
  const [loadingFlight, setLoadingFlight] = useState(false)
  const [loadingTrack, setLoadingTrack] = useState(false)
  const [showTrack, setShowTrack] = useState(true)

  const a = selectedIcao ? aircraft.get(selectedIcao) : null

  // Cargar info de vuelo y trayectoria al seleccionar
  useEffect(() => {
    if (!selectedIcao || !a) {
      setFlightInfo(null)
      setTrackData(null)
      trackDataCallback?.(null)
      return
    }

    // Cargar info de vuelo (aeropuertos)
    setLoadingFlight(true)
    const now = Math.floor(Date.now() / 1000)
    const begin = now - 86400

    // Usamos el icao24 del avión (no el callsign) para buscar en OpenSky
    fetch(`${API_URL}/api/v1/flights/aircraft/${selectedIcao}?begin=${begin}&end=${now}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.flights?.length > 0) {
          // Ordenar por firstSeen desc y coger el más reciente
          const sorted = [...data.flights].sort((a, b) => b.firstSeen - a.firstSeen)
          setFlightInfo(sorted[0])
        } else {
          setFlightInfo(null)
        }
      })
      .catch(() => setFlightInfo(null))
      .finally(() => setLoadingFlight(false))

    // Cargar trayectoria histórica desde nuestra BD
    setLoadingTrack(true)
    fetch(`${API_URL}/api/v1/tracks/history/${selectedIcao}?hours=6`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.waypoints?.length > 0) {
          setTrackData(data)
          trackDataCallback?.(data)
        } else {
          setTrackData(null)
          trackDataCallback?.(null)
        }
      })
      .catch(() => {
        setTrackData(null)
        trackDataCallback?.(null)
      })
      .finally(() => setLoadingTrack(false))
  }, [selectedIcao])

  // Propagar cambio de visibilidad de trayectoria al Globe
  useEffect(() => {
    trackDataCallback?.(showTrack ? trackData : null)
  }, [showTrack, trackData])

  if (!a) return null

  const verticalColor = a.is_climbing
    ? 'var(--success)'
    : a.is_descending ? 'var(--warning)' : 'var(--text-dim)'

  const VIcon = a.is_climbing ? TrendingUp : a.is_descending ? TrendingDown : Minus

  return (
    <DraggablePanel
      id="flightDetail"
      title={a.callsign?.trim() || a.icao24}
      icon={<Info size={14} />}
      minWidth={300}
    >
      <div className="p-3 space-y-3" style={{ maxHeight: '75vh', overflowY: 'auto' }}>

        {/* Ruta origen → destino */}
        <div className="p-2 rounded-lg border border-[var(--border)]"
          style={{ background: 'rgba(0,212,255,0.04)' }}>
          <div className="text-[10px] uppercase tracking-widest text-[var(--accent)] mono mb-2">
            Ruta
          </div>
          {loadingFlight ? (
            <div className="text-xs text-[var(--text-dim)] text-center py-1 mono">Cargando...</div>
          ) : flightInfo ? (
            <div className="flex items-center justify-between gap-2">
              <div className="text-center flex-1">
                <div className="mono font-bold text-base" style={{ color: 'var(--text)' }}>
                  {flightInfo.estDepartureAirport || '????'}
                </div>
                <div className="text-[10px] text-[var(--text-dim)]">Origen</div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="h-px w-6 border-t border-dashed border-[var(--border)]" />
                <Navigation size={12} style={{ color: 'var(--accent)' }} />
                <div className="h-px w-6 border-t border-dashed border-[var(--border)]" />
              </div>
              <div className="text-center flex-1">
                <div className="mono font-bold text-base" style={{ color: 'var(--text)' }}>
                  {flightInfo.estArrivalAirport || '????'}
                </div>
                <div className="text-[10px] text-[var(--text-dim)]">Destino</div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-[var(--text-dim)] text-center py-1">
              Sin datos de ruta disponibles
            </div>
          )}
        </div>

        {/* Trayectoria en mapa */}
        <div className="p-2 rounded-lg border border-[var(--border)]"
          style={{ background: 'rgba(0,212,255,0.04)' }}>
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] uppercase tracking-widest text-[var(--accent)] mono">
              Trayectoria
            </div>
            <button
              onClick={() => setShowTrack(v => !v)}
              className="text-[10px] mono px-2 py-0.5 rounded transition-colors"
              style={{
                border: '1px solid var(--border)',
                color: showTrack ? 'var(--accent)' : 'var(--text-dim)',
                background: showTrack ? 'rgba(0,212,255,0.1)' : 'transparent',
              }}
            >
              {showTrack ? 'Visible' : 'Oculta'}
            </button>
          </div>
          {loadingTrack ? (
            <div className="text-xs text-[var(--text-dim)] mono">Cargando trayectoria...</div>
          ) : trackData ? (
            <div className="text-xs text-[var(--text-dim)] mono">
              {trackData.waypoints.length} puntos · últimas 6h
            </div>
          ) : (
            <div className="text-xs text-[var(--text-dim)]">
              Sin trayectoria histórica (el avión debe llevar activo &gt;150s)
            </div>
          )}
        </div>

        {/* Identificación */}
        <Section label="Identificación">
          <Row label="ICAO24" value={a.icao24} mono />
          <Row label="Callsign" value={a.callsign?.trim() || '—'} mono />
          <Row label="País" value={a.origin_country || '—'} />
          <Row label="Squawk" value={a.squawk || '—'} mono />
          <Row label="Categoría" value={a.category_name || '—'} />
        </Section>

        {/* Posición */}
        <Section label="Posición">
          <Row label="Latitud" value={a.latitude ? a.latitude.toFixed(4) + '°' : '—'} mono />
          <Row label="Longitud" value={a.longitude ? a.longitude.toFixed(4) + '°' : '—'} mono />
          <Row label="Alt. barom." value={formatAltitude(a.baro_altitude)} mono />
          <Row label="Alt. geom." value={formatAltitude(a.geo_altitude)} mono />
          <Row label="Estado" value={a.on_ground ? 'En tierra' : 'En vuelo'}
            valueColor={a.on_ground ? 'var(--text-dim)' : 'var(--accent)'} />
        </Section>

        {/* Movimiento */}
        <Section label="Movimiento">
          <Row label="Velocidad" value={formatSpeed(a.velocity)} mono />
          <Row label="Rumbo" value={a.true_track ? `${Math.round(a.true_track)}°` : '—'} mono />
          <Row label="Tasa vert." value={formatVerticalRate(a.vertical_rate)}
            valueColor={verticalColor} mono />
        </Section>

        {/* Fuente */}
        <Section label="Fuente">
          <Row label="Fuente" value={positionSourceName(a.position_source)} />
          <Row label="Último contacto" value={formatTimeSince(a.last_contact) + ' ago'} mono />
        </Section>

        <button
          onClick={() => { selectAircraft(null); trackDataCallback?.(null) }}
          className="w-full flex items-center justify-center gap-2 py-1.5 text-xs
            border border-[var(--border)] rounded-md text-[var(--text-dim)]
            hover:border-[var(--danger)] hover:text-[var(--danger)] transition-colors"
        >
          <X size={12} /> Deseleccionar
        </button>
      </div>
    </DraggablePanel>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] mb-1.5 mono">
        {label}
      </div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function Row({ label, value, mono = false, valueColor }: {
  label: string; value: string; mono?: boolean; valueColor?: string
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-[var(--text-dim)]">{label}</span>
      <span className={mono ? 'mono' : ''} style={{ color: valueColor || 'var(--text)' }}>
        {value}
      </span>
    </div>
  )
}