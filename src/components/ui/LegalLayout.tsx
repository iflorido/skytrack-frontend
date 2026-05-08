import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import FooterNav from './FooterNav'

interface Props {
  children: React.ReactNode
}

export default function LegalLayout({ children }: Props) {
  const { theme, toggleTheme } = useTheme()
  const isNasa = theme === 'nasa'

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Navbar mínima */}
      <header style={{
        flexShrink: 0,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: isNasa ? 'rgba(5,13,26,0.98)' : 'rgba(255,255,255,0.98)',
        borderBottom: '1px solid var(--border)',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src={isNasa ? '/logo-sky-track.svg' : '/logo-sky-track-dark.svg'}
            alt="FlySkyTrack"
            style={{ height: 28 }}
          />
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href="/"
            style={{
              fontSize: 12,
              color: 'var(--text-dim)',
              textDecoration: 'none',
              padding: '4px 12px',
              border: '1px solid var(--border)',
              borderRadius: 6,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-dim)'
            }}
          >
            ← Volver al mapa
          </a>
          <button onClick={toggleTheme} className="icon-btn" title="Cambiar tema">
            {isNasa ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Contenido scrollable */}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: 32 }}>
        {children}
      </main>

      <FooterNav />
    </div>
  )
}