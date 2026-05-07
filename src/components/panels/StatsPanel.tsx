import { Activity, Plane, Globe, TrendingUp, TrendingDown } from 'lucide-react'
import DraggablePanel from './DraggablePanel'
import { useFlightStore } from '../../stores/flightStore'
import { formatTimestamp } from '../../utils/formatters'

export default function StatsPanel() {
  const aircraft = useFlightStore(s => s.aircraft)
  const lastUpdate = useFlightStore(s => s.lastUpdate)
  const connectionStatus = useFlightStore(s => s.connectionStatus)
  const pollInterval = useFlightStore(s => s.pollInterval)

  const list = Array.from(aircraft.values())
  const airborne = list.filter(a => !a.on_ground)
  const onGround = list.filter(a => a.on_ground)
  const climbing = list.filter(a => a.is_climbing)
  const descending = list.filter(a => a.is_descending)
  const countries = new Set(list.map(a => a.origin_country).filter(Boolean)).size

  const statusColor = {
    connected: 'var(--success)',
    connecting: 'var(--warning)',
    disconnected: 'var(--danger)',
    error: 'var(--danger)',
  }[connectionStatus]

  return (
    <DraggablePanel
      id="stats"
      title="Control Global"
      icon={<Activity size={14} />}
    >
      <div className="p-3 space-y-3">

        {/* Estado conexión */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className="status-dot"
              style={{ background: statusColor, boxShadow: `0 0 6px ${statusColor}` }}
            />
            <span className="text-[var(--text-dim)] uppercase tracking-wider">
              {connectionStatus === 'connected' ? 'Live' : connectionStatus}
            </span>
          </div>
          <span className="mono text-[var(--text-dim)]">
            ↻ {pollInterval}s
          </span>
        </div>

        {/* Contador principal */}
        <div className="text-center py-2 border border-[var(--border)] rounded-lg">
          <div
            className="mono text-3xl font-bold"
            style={{ color: 'var(--accent)' }}
          >
            {list.length.toLocaleString()}
          </div>
          <div className="text-xs text-[var(--text-dim)] mt-1 uppercase tracking-wider">
            aeronaves detectadas
          </div>
        </div>

        {/* Grid de stats */}
        <div className="grid grid-cols-2 gap-2">
          <StatBox
            icon={<Plane size={12} />}
            label="En vuelo"
            value={airborne.length.toLocaleString()}
            color="var(--accent)"
          />
          <StatBox
            icon={<Globe size={12} />}
            label="En tierra"
            value={onGround.length.toLocaleString()}
            color="var(--text-dim)"
          />
          <StatBox
            icon={<TrendingUp size={12} />}
            label="Ascendiendo"
            value={climbing.length.toLocaleString()}
            color="var(--success)"
          />
          <StatBox
            icon={<TrendingDown size={12} />}
            label="Descendiendo"
            value={descending.length.toLocaleString()}
            color="var(--warning)"
          />
        </div>

        {/* Países */}
        <div className="flex items-center justify-between text-xs border-t border-[var(--border)] pt-2">
          <span className="text-[var(--text-dim)]">Países representados</span>
          <span className="mono font-medium" style={{ color: 'var(--accent)' }}>
            {countries}
          </span>
        </div>

        {/* Última actualización */}
        {lastUpdate && (
          <div className="text-xs text-[var(--text-dim)] text-center mono">
            Actualizado {new Date(lastUpdate).toLocaleTimeString('es-ES')}
          </div>
        )}
      </div>
    </DraggablePanel>
  )
}

function StatBox({
  icon, label, value, color
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex flex-col gap-1 p-2 border border-[var(--border)] rounded-lg">
      <div className="flex items-center gap-1 text-[var(--text-dim)]" style={{ fontSize: 10 }}>
        <span style={{ color }}>{icon}</span>
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      <span className="mono text-lg font-medium" style={{ color }}>
        {value}
      </span>
    </div>
  )
}
