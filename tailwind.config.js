/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Tema NASA Dark
        nasa: {
          bg:        '#050d1a',
          surface:   '#0a1628',
          panel:     '#0d1f3c',
          border:    '#1a3a5c',
          cyan:      '#00d4ff',
          blue:      '#0080ff',
          'blue-dim':'#0050aa',
          accent:    '#00ffcc',
          warning:   '#ffaa00',
          danger:    '#ff4444',
          success:   '#00ff88',
          text:      '#c8e6ff',
          'text-dim':'#6a9bbf',
          glow:      'rgba(0, 212, 255, 0.15)',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'nasa':     '0 0 20px rgba(0, 212, 255, 0.1), 0 4px 24px rgba(0,0,0,0.6)',
        'nasa-lg':  '0 0 40px rgba(0, 212, 255, 0.15), 0 8px 40px rgba(0,0,0,0.8)',
        'nasa-glow':'0 0 15px rgba(0, 212, 255, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan':       'scan 2s linear infinite',
        'blink':      'blink 1s step-end infinite',
      },
      keyframes: {
        scan: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
