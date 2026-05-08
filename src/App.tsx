import { useEffect, useState } from 'react'
import Globe from './components/globe/Globe'
import Navbar from './components/ui/Navbar'
import StatsPanel from './components/panels/StatsPanel'
import FlightListPanel from './components/panels/FlightListPanel'
import FlightDetailPanel from './components/panels/FlightDetailPanel'
import FiltersPanel from './components/panels/FiltersPanel'
import AvisoLegal from './pages/AvisoLegal'
import Privacidad from './pages/Privacidad'
import Cookies from './pages/Cookies'
import Contacto from './pages/Contacto'
import { useWebSocket } from './hooks/useWebSocket'
import { useTheme } from './hooks/useTheme'
import FooterNav from './components/ui/FooterNav'

type Page = 'home' | 'aviso-legal' | 'privacidad' | 'cookies' | 'contacto'

function getCurrentPage(): Page {
  const path = window.location.pathname
  if (path === '/aviso-legal') return 'aviso-legal'
  if (path === '/privacidad') return 'privacidad'
  if (path === '/cookies') return 'cookies'
  if (path === '/contacto') return 'contacto'
  return 'home'
}

export default function App() {
  const { theme } = useTheme()
  const [page, setPage] = useState<Page>(getCurrentPage)

  useWebSocket()

  useEffect(() => {
    document.documentElement.className = theme === 'nasa' ? 'dark' : ''
  }, [theme])

  // Escuchar cambios de ruta (navegación con botón atrás/adelante)
  useEffect(() => {
    const handlePop = () => setPage(getCurrentPage())
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  // Navegación SPA sin recarga
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href || href.startsWith('http') || href.startsWith('mailto')) return
      e.preventDefault()
      window.history.pushState({}, '', href)
      setPage(getCurrentPage())
      window.scrollTo(0, 0)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const renderPage = () => {
    switch (page) {
      case 'aviso-legal':  return <AvisoLegal />
      case 'privacidad':   return <Privacidad />
      case 'cookies':      return <Cookies />
      case 'contacto':     return <Contacto />
      default:             return null
    }
  }

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: 'var(--bg)' }}>
      {theme === 'nasa' && <div className="scan-overlay" />}

      {/* Globo siempre montado para mantener la conexión WS */}
      <Globe />
      <Navbar />

      {/* Paneles del mapa — solo en home */}
      {page === 'home' && (
        <div style={{ position: 'absolute', top: 52, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto' }}>
            <StatsPanel />
            <FlightListPanel />
            <FlightDetailPanel />
            <FiltersPanel />
          </div>
        </div>
      )}

      {/* Páginas legales — superpuestas sobre el globo */}
      {page !== 'home' && renderPage()}

      <FooterNav />
    </div>
  )
}