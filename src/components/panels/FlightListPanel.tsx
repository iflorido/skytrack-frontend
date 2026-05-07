import { useState } from 'react'
import { List, Search } from 'lucide-react'
import DraggablePanel from './DraggablePanel'
import { useFlightStore } from '../../stores/flightStore'
import { usePanelStore } from '../../stores/panelStore'
import { Aircraft } from '../../types'
import { formatAltitude, formatSpeed, getVerticalRateIcon } from '../../utils/formatters'
import clsx from 'clsx'

export default function FlightListPanel() {
  const [search, setSearch] = useState('')
  const filteredAircraft = useFlightStore(s => s.filteredAircraft)
  const selectedIcao = useFlightStore(s => s.selectedIcao)
  const selectAircraft = useFlightStore(s => s.selectAircraft)
  const openPanel = usePanelStore(s => s.openPanel)

  const displayed = search
    ? filteredAircraft.filter(a =>
        a.callsign?.toUpperCase().includes(search.toUpperCase()) ||
        a.icao24.includes(search.toLowerCase()) ||
        a.origin_country?.toLowerCase().includes(search.toLowerCase())
      )
    : filteredAircraft.slice(0, 50)  // Máximo 50 para rendimiento

  function handleSelect(a: Aircraft) {
    selectAircraft(a.icao24)
    openPanel('flightDetail')
  }

  return (
    <DraggablePanel
      id="flightList"
      title="Vuelos"
      icon={<List size={14} />}
      minWidth={300}
    >
      {/* Buscador */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-dim)]"
          />
          <input
            type="text"
            placeholder="Callsign, ICAO, país..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md
              bg-[var(--surface)] border border-[var(--border)]
              text-[var(--text)] placeholder-[var(--text-dim)]
              focus:outline-none focus:border-[var(--accent)]
              mono transition-colors"
          />
        </div>
      </div>

      {/* Lista */}
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {displayed.length === 0 ? (
          <div className="text-center text-xs text-[var(--text-dim)] py-6">
            Sin resultados
          </div>
        ) : (
          displayed.map(a => (
            <FlightRow
              key={a.icao24}
              aircraft={a}
              selected={a.icao24 === selectedIcao}
              onClick={() => handleSelect(a)}
            />
          ))
        )}
      </div>

      {/* Contador */}
      <div className="px-3 py-2 border-t border-[var(--border)] text-xs text-[var(--text-dim)] mono">
        {search ? `${displayed.length} resultados` : `${displayed.length} de ${filteredAircraft.length}`}
      </div>
    </DraggablePanel>
  )
}

function FlightRow({
  aircraft: a, selected, onClick
}: {
  aircraft: Aircraft
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left px-3 py-2 text-xs transition-colors border-b border-[var(--border)]',
        'hover:bg-[var(--surface)]',
        selected && 'bg-[var(--border)]'
      )}
      style={selected ? { borderLeft: '2px solid var(--accent)' } : {}}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="font-medium mono"
            style={{ color: selected ? 'var(--accent)' : 'var(--text)' }}
          >
            {a.callsign?.trim() || a.icao24}
          </span>
          {a.on_ground && (
            <span className="text-[10px] px-1 rounded"
              style={{ background: 'var(--border)', color: 'var(--text-dim)' }}>
              GND
            </span>
          )}
        </div>
        <span className="mono text-[10px]" style={{ color: 'var(--text-dim)' }}>
          {getVerticalRateIcon(a)}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-0.5">
        <span className="text-[var(--text-dim)]">{a.origin_country ?? '—'}</span>
        <span className="mono">{formatAltitude(a.baro_altitude)}</span>
        <span className="mono">{formatSpeed(a.velocity)}</span>
      </div>
    </button>
  )
}
