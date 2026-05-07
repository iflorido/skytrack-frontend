import { Info, X } from 'lucide-react'
import DraggablePanel from './DraggablePanel'
import { useFlightStore } from '../../stores/flightStore'
import {
  formatAltitude, formatSpeed, formatVerticalRate,
  formatTimeSince, positionSourceName
} from '../../utils/formatters'

export default function FlightDetailPanel() {
  const selectedIcao = useFlightStore(s => s.selectedIcao)
  const aircraft = useFlightStore(s => s.aircraft)
  const selectAircraft = useFlightStore(s => s.selectAircraft)

  const a = selectedIcao ? aircraft.get(selectedIcao) : null

  if (!a) return null

  const verticalColor = a.is_climbing
    ? 'var(--success)'
    : a.is_descending
    ? 'var(--warning)'
    : 'var(--text-dim)'

  return (
    <DraggablePanel
      id="flightDetail"
      title={a.callsign?.trim() || a.icao24}
      icon={<Info size={14} />}
      minWidth={300}
    >
      <div className="p-3 space-y-3">

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
          <Row
            label="Latitud"
            value={a.latitude?.toFixed(4) + '°' || '—'}
            mono
          />
          <Row
            label="Longitud"
            value={a.longitude?.toFixed(4) + '°' || '—'}
            mono
          />
          <Row label="Alt. barom." value={formatAltitude(a.baro_altitude)} mono />
          <Row label="Alt. geom." value={formatAltitude(a.geo_altitude)} mono />
          <Row label="Estado" value={a.on_ground ? 'En tierra' : 'En vuelo'}
            valueColor={a.on_ground ? 'var(--text-dim)' : 'var(--accent)'} />
        </Section>

        {/* Movimiento */}
        <Section label="Movimiento">
          <Row label="Velocidad" value={formatSpeed(a.velocity)} mono />
          <Row label="Rumbo" value={a.true_track ? `${Math.round(a.true_track)}°` : '—'} mono />
          <Row
            label="Tasa vert."
            value={formatVerticalRate(a.vertical_rate)}
            valueColor={verticalColor}
            mono
          />
        </Section>

        {/* Fuente */}
        <Section label="Fuente de datos">
          <Row label="Fuente" value={positionSourceName(a.position_source)} />
          <Row label="Último contacto" value={formatTimeSince(a.last_contact) + ' ago'} mono />
          {a.spi && (
            <div className="text-xs px-2 py-1 rounded"
              style={{ background: 'var(--warning)', color: '#000' }}>
              ⚠ Special Purpose Indicator activo
            </div>
          )}
        </Section>

        {/* Deseleccionar */}
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
      <div className="space-y-1">
        {children}
      </div>
    </div>
  )
}

function Row({
  label, value, mono = false, valueColor
}: {
  label: string
  value: string
  mono?: boolean
  valueColor?: string
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-[var(--text-dim)]">{label}</span>
      <span
        className={mono ? 'mono' : ''}
        style={{ color: valueColor || 'var(--text)' }}
      >
        {value}
      </span>
    </div>
  )
}
