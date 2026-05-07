import { Sun, Moon, Activity, List, Info, SlidersHorizontal, Wifi, WifiOff } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useFlightStore } from '../../stores/flightStore'
import { usePanelStore } from '../../stores/panelStore'
import { PanelId } from '../../types'
import clsx from 'clsx'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const connectionStatus = useFlightStore(s => s.connectionStatus)
  const aircraftCount = useFlightStore(s => s.aircraft.size)
  const { panels, togglePanel } = usePanelStore()

  const isNasa = theme === 'nasa'

  const panelButtons: { id: PanelId; icon: React.ReactNode; label: string }[] = [
    { id: 'stats',        icon: <Activity size={15} />,         label: 'Stats' },
    { id: 'flightList',   icon: <List size={15} />,             label: 'Vuelos' },
    { id: 'flightDetail', icon: <Info size={15} />,             label: 'Detalle' },
    { id: 'filters',      icon: <SlidersHorizontal size={15} />, label: 'Filtros' },
  ]

  return (
    <header
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
      style={{
        height: 52,
        background: isNasa
          ? 'rgba(5, 13, 26, 0.92)'
          : 'rgba(255, 255, 255, 0.92)',
        borderBottom: `1px solid var(--border)`,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg mono font-bold" style={{ color: 'var(--accent)' }}>
            SKY
          </span>
          <span className="text-lg mono font-bold" style={{ color: 'var(--text)' }}>
            TRACK
          </span>
        </div>
        {isNasa && (
          <div
            className="text-[10px] px-2 py-0.5 rounded mono uppercase tracking-widest"
            style={{
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
              background: 'rgba(0, 212, 255, 0.08)',
            }}
          >
            Live
          </div>
        )}
      </div>

      {/* Botones de paneles */}
      <div className="flex items-center gap-1">
        {panelButtons.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => togglePanel(id)}
            title={label}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs transition-all',
              panels[id].open
                ? 'bg-[var(--border)] text-[var(--accent)]'
                : 'text-[var(--text-dim)] hover:bg-[var(--border)] hover:text-[var(--text)]'
            )}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Derecha: estado + counter + tema */}
      <div className="flex items-center gap-3">
        {/* Contador de aeronaves */}
        <div className="flex items-center gap-1.5 text-xs mono">
          {connectionStatus === 'connected' ? (
            <Wifi size={13} style={{ color: 'var(--success)' }} />
          ) : (
            <WifiOff size={13} style={{ color: 'var(--danger)' }} />
          )}
          <span style={{ color: 'var(--accent)' }}>
            {aircraftCount.toLocaleString()}
          </span>
          <span style={{ color: 'var(--text-dim)' }}>aeronaves</span>
        </div>

        {/* Toggle tema */}
        <button
          onClick={toggleTheme}
          className="icon-btn"
          title={isNasa ? 'Cambiar a tema claro' : 'Cambiar a tema NASA'}
        >
          {isNasa ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}
