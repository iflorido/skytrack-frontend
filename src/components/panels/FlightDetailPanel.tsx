import { useState, useEffect } from 'react'
import { Info, X, MapPin, Navigation } from 'lucide-react'
import DraggablePanel from './DraggablePanel'
import { useFlightStore } from '../../stores/flightStore'
import {
  formatAltitude, formatSpeed, formatVerticalRate,
  formatTimeSince, positionSourceName
} from '../../utils/formatters'

const API_URL = import.meta.env.VITE_API_URL || 'https://api.flyskytrack.com'

interface FlightInfo {
  callsign: string | null
  est_departure_airport: string | null
  est_arrival_airport: string | null
  first_seen: number
  last_seen: number
}

export default function FlightDetailPanel() {
  const selectedIcao = useFlightStore(s => s.selectedIcao)
  const aircraft = useFlightStore(s => s.aircraft)
  const selectAircraft = useFlightStore(s => s.selectAircraft)
  const [flightInfo, setFlightInfo] = useState<FlightInfo | null>(null)
  const [loadingFlight, setLoadingFlight] = useState(false)

  const a = selectedIcao ? aircraft.get(selectedIcao) : null

  // Cargar info de vuelo cuando se selecciona un avión
  useEffect(() => {
    if (!selectedIcao || !a) {
      setFlightInfo(null)
      return
    }

    setLoadingFlight(true)
    const now = Math.floor(Date.now() / 1000)
    const begin = now - 86400 // últimas 24 horas

    fetch(`${API_URL}/api/v1/flights/aircraft/${selectedIcao}?begin=${begin}&end=${now}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.flights?.length > 0) {
          const latest = data.flights[data.flights.length - 1]
          setFlightInfo(latest)
        } else {
          setFlightInfo(null)
        }
      })
      .catch(() => setFlightInfo(null))
      .finally(() => setLoadingFlight(false))
  }, [selectedIcao])

  if (!a) return null

  const verticalColor = a.is_climbing
    ? 'var(--success)'
    : a.is_descending ? 'var(--warning)' : 'var(--text-dim)'

  return (
    <DraggablePanel
      id="flightDetail"
      title={a.callsign?.trim() || a.icao24}
      icon={<Info size={14} />}
      minWidth={300}
    >
      <div className="p-3 space-y-3" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

        {/* Ruta de vuelo */}
        {(flightInfo || loadingFlight) && (
          <div className="p-2 rounded-lg border border-[var(--border)]"
            style={{ background: 'rgba(0,212,255,0.05)' }}>
            <div className="text-[10px] uppercase tracking-widest text-[var(--accent)] mono mb-2">
              Ruta del vuelo
            </div>
            {loadingFlight ? (
              <div className="text-xs text-[var(--text-dim)] text-center py-1">Cargando...</div>
            ) : flightInfo ? (
              <div className="flex items-center justify-between gap-2">
                <div className="text-center">
                  <div className="mono font-bold text-sm" style={{ color: 'var(--text)' }}>
                    {flightInfo.est_departure_airport || '???'}
                  </div>
                  <div className="text-[10px] text-[var(--text-dim)]">Origen</div>
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <div className="h-px flex-1 border-t border-dashed border-[var(--border)]" />
                  <Navigation size={12} style={{ color: 'var(--accent)' }} />
                  <div className="h-px flex-1 border-t border-dashed border-[var(--border)]" />
                </div>
                <div className="text-center">
                  <div className="mono font-bold text-sm" style={{ color: 'var(--text)' }}>
                    {flightInfo.est_arrival_airport || '???'}
                  </div>
                  <div className="text-[10px] text-[var(--text-dim)]">Destino</div>
                </div>
              </div>
            ) : null}
          </div>
        )}

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
          onClick={() => selectAircraft(null)}
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