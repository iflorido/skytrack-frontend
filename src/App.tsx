import { useEffect, lazy, Suspense } from 'react'
import Globe from './components/globe/Globe'
import Navbar from './components/ui/Navbar'
import StatsPanel from './components/panels/StatsPanel'
import FlightListPanel from './components/panels/FlightListPanel'
import FlightDetailPanel from './components/panels/FlightDetailPanel'
import { useWebSocket } from './hooks/useWebSocket'
import { useTheme } from './hooks/useTheme'

// FiltersPanel cargado de forma lazy — si no existe el fichero el build no falla
const FiltersPanel = lazy(() =>
  import('./components/panels/FiltersPanel').catch(() => ({
    default: () => null
  }))
)

export default function App() {
  const { theme } = useTheme()
  useWebSocket()

  useEffect(() => {
    document.documentElement.className = theme === 'nasa' ? 'dark' : ''
  }, [theme])

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: 'var(--bg)' }}>
      {theme === 'nasa' && <div className="scan-overlay" />}
      <Globe />
      <Navbar />
      <div style={{ position: 'absolute', top: 52, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <StatsPanel />
          <FlightListPanel />
          <FlightDetailPanel />
          <Suspense fallback={null}>
            <FiltersPanel />
          </Suspense>
        </div>
      </div>
    </div>
  )
}