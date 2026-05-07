import { SlidersHorizontal, X } from 'lucide-react'
import DraggablePanel from './DraggablePanel'
import { useFlightStore } from '../../stores/flightStore'

export default function FiltersPanel() {
  const { filters, updateFilters, resetFilters, aircraft } = useFlightStore()

  // Extraer países únicos del feed actual
  const countries = Array.from(
    new Set(Array.from(aircraft.values()).map(a => a.origin_country).filter(Boolean))
  ).sort() as string[]

  return (
    <DraggablePanel id="filters" title="Filtros" icon={<SlidersHorizontal size={14} />} minWidth={280}>
      <div className="p-3 space-y-4">

        {/* Estado */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] mono block mb-2">
            Estado
          </label>
          <div className="flex gap-2">
            {[
              { label: 'Todos', value: null },
              { label: 'En vuelo', value: false },
              { label: 'En tierra', value: true },
            ].map(opt => (
              <button
                key={String(opt.value)}
                onClick={() => updateFilters({ onGround: opt.value })}
                className="flex-1 py-1.5 text-xs rounded-md border transition-colors"
                style={{
                  borderColor: filters.onGround === opt.value ? 'var(--accent)' : 'var(--border)',
                  background: filters.onGround === opt.value ? 'rgba(0,212,255,0.1)' : 'transparent',
                  color: filters.onGround === opt.value ? 'var(--accent)' : 'var(--text-dim)',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Callsign */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] mono block mb-1.5">
            Callsign
          </label>
          <input
            type="text"
            placeholder="Ej: IBE, BAW..."
            value={filters.callsign || ''}
            onChange={e => updateFilters({ callsign: e.target.value || null })}
            className="w-full px-3 py-1.5 text-xs rounded-md mono
              bg-[var(--surface)] border border-[var(--border)]
              text-[var(--text)] placeholder-[var(--text-dim)]
              focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* País */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] mono block mb-1.5">
            País
          </label>
          <select
            value={filters.country || ''}
            onChange={e => updateFilters({ country: e.target.value || null })}
            className="w-full px-3 py-1.5 text-xs rounded-md
              bg-[var(--surface)] border border-[var(--border)]
              text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          >
            <option value="">Todos los países</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Altitud */}
        <div>
          <label className="text-[10px] uppercase tracking-widest text-[var(--text-dim)] mono block mb-1.5">
            Altitud mínima (m)
          </label>
          <input
            type="number"
            placeholder="0"
            value={filters.minAltitude ?? ''}
            onChange={e => updateFilters({ minAltitude: e.target.value ? Number(e.target.value) : null })}
            className="w-full px-3 py-1.5 text-xs rounded-md mono
              bg-[var(--surface)] border border-[var(--border)]
              text-[var(--text)] placeholder-[var(--text-dim)]
              focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Reset */}
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 py-1.5 text-xs
            border border-[var(--border)] rounded-md text-[var(--text-dim)]
            hover:border-[var(--danger)] hover:text-[var(--danger)] transition-colors"
        >
          <X size={12} /> Limpiar filtros.
        </button>
      </div>
    </DraggablePanel>
  )
}