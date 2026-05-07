import { useEffect } from 'react'
import Globe from './components/globe/Globe'
import Navbar from './components/ui/Navbar'
import StatsPanel from './components/panels/StatsPanel'
import FlightListPanel from './components/panels/FlightListPanel'
import FlightDetailPanel from './components/panels/FlightDetailPanel'
import { useWebSocket } from './hooks/useWebSocket'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme } = useTheme()

  // Iniciar conexión WebSocket
  useWebSocket()

  // Aplicar clase de tema al body
  useEffect(() => {
    document.documentElement.className = theme === 'nasa' ? 'dark' : ''
  }, [theme])

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Efecto scan lines NASA (solo dark) */}
      {theme === 'nasa' && <div className="scan-overlay" />}

      {/* Globo 3D — ocupa todo el fondo */}
      <Globe />

      {/* Barra superior */}
      <Navbar />

      {/* Paneles flotantes — zona a la izquierda del mapa */}
      <div style={{ position: 'absolute', top: 52, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <StatsPanel />
          <FlightListPanel />
          <FlightDetailPanel />
        </div>
      </div>
    </div>
  )
}
