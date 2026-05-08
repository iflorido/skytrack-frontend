import { useState, useEffect, useRef } from 'react'
import { Sliders } from 'lucide-react'
import * as Cesium from 'cesium'

interface MapAdjustments {
  brightness: number
  hue: number
  saturation: number
}

// Valores por defecto según el tema
const NASA_DEFAULTS: MapAdjustments = { brightness: 0.45, hue: 0.0, saturation: 0.4 }
const LIGHT_DEFAULTS: MapAdjustments = { brightness: 1.0, hue: 0.0, saturation: 1.0 }

interface Props {
  isDark: boolean
  viewerRef: React.MutableRefObject<Cesium.Viewer | null>
}

export default function MapSettings({ isDark, viewerRef }: Props) {
  const [open, setOpen] = useState(false)
  const [adj, setAdj] = useState<MapAdjustments>(isDark ? NASA_DEFAULTS : LIGHT_DEFAULTS)
  const panelRef = useRef<HTMLDivElement>(null)

  // Resetear valores al cambiar de tema
  useEffect(() => {
    const defaults = isDark ? NASA_DEFAULTS : LIGHT_DEFAULTS
    setAdj(defaults)
    applyToLayer(defaults)
  }, [isDark])

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  function applyToLayer(values: MapAdjustments) {
    const viewer = viewerRef.current
    if (!viewer || viewer.imageryLayers.length === 0) return
    const layer = viewer.imageryLayers.get(0)
    layer.brightness = values.brightness
    layer.hue = values.hue
    layer.saturation = values.saturation
  }

  function handleChange(key: keyof MapAdjustments, value: number) {
    const updated = { ...adj, [key]: value }
    setAdj(updated)
    applyToLayer(updated)
  }

  function handleReset() {
    const defaults = isDark ? NASA_DEFAULTS : LIGHT_DEFAULTS
    setAdj(defaults)
    applyToLayer(defaults)
  }

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="icon-btn"
        title="Ajustes del mapa"
        style={open ? { background: 'var(--border)', color: 'var(--accent)' } : {}}
      >
        <Sliders size={16} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-10 z-50 rounded-lg border border-[var(--border)] p-4"
          style={{
            background: 'var(--panel)',
            width: 240,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-widest mono" style={{ color: 'var(--accent)' }}>
              Ajuste del mapa
            </span>
            <button
              onClick={handleReset}
              className="text-[10px] mono px-2 py-0.5 rounded transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-dim)' }}
            >
              Reset
            </button>
          </div>

          <SliderRow
            label="Brillo"
            value={adj.brightness}
            min={0.1} max={1.5} step={0.05}
            onChange={v => handleChange('brightness', v)}
          />
          <SliderRow
            label="Tono (hue)"
            value={adj.hue}
            min={0} max={1} step={0.05}
            onChange={v => handleChange('hue', v)}
          />
          <SliderRow
            label="Saturación"
            value={adj.saturation}
            min={0} max={2} step={0.05}
            onChange={v => handleChange('saturation', v)}
          />

          <div className="mt-3 pt-2 border-t border-[var(--border)] text-[9px] mono text-[var(--text-dim)]">
            brightness: {adj.brightness.toFixed(2)} · hue: {adj.hue.toFixed(2)} · saturation: {adj.saturation.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  )
}

function SliderRow({
  label, value, min, max, step, onChange
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-[var(--text-dim)]">{label}</span>
        <span className="text-[10px] mono" style={{ color: 'var(--accent)' }}>
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((value - min) / (max - min)) * 100}%, var(--border) ${((value - min) / (max - min)) * 100}%, var(--border) 100%)`,
          outline: 'none',
        }}
      />
    </div>
  )
}
