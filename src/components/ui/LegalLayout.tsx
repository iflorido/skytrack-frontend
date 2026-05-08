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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>

      {/* Navbar mínima */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          background: isNasa ? 'rgba(5,13,26,0.96)' : 'rgba(255,255,255,0.96)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(12px)',
          zIndex: 200,
        }}
      >
        {/* Logo — vuelve al inicio */}
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img
            src={isNasa ? '/logo-sky-track.svg' : '/logo-sky-track-dark.svg'}
            alt="FlySkyTrack"
            style={{ height: 28 }}
          />
        </a>

        {/* Botón volver + toggle tema */}
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

          <button
            onClick={toggleTheme}
            className="icon-btn"
            title={isNasa ? 'Cambiar a tema claro' : 'Cambiar a tema NASA'}
          >
            {isNasa ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main style={{ flex: 1, paddingTop: 52, paddingBottom: 32 }}>
        {children}
      </main>

      <FooterNav />
    </div>
  )
}
