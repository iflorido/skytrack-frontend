export default function FooterNav() {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg)',
        opacity: 0.85,
        backdropFilter: 'blur(8px)',
        zIndex: 50,
        fontSize: 11,
      }}
    >
      {/* Enlaces legales — izquierda */}
      <div style={{ display: 'flex', gap: 16 }}>
        {[
          { href: '/aviso-legal', label: 'Aviso Legal' },
          { href: '/privacidad',  label: 'Privacidad' },
          { href: '/cookies',     label: 'Cookies' },
          { href: '/contacto',    label: 'Contacto' },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            style={{ color: 'var(--text-dim)', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Créditos — derecha */}
      <div style={{ color: 'var(--text-dim)', display: 'flex', gap: 4, alignItems: 'center' }}>
        <span>Desarrollado por</span>
        <a
          href="https://iflorido.es"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          iflorido
        </a>
        <span>·</span>
        <a
          href="https://automaworks.es"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          Automaworks
        </a>
      </div>
    </footer>
  )
}