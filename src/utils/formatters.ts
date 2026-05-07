import { Aircraft } from '../types'

export function formatAltitude(meters: number | null): string {
  if (meters === null) return '—'
  const feet = Math.round(meters * 3.28084)
  return `${feet.toLocaleString()} ft`
}

export function formatSpeed(ms: number | null): string {
  if (ms === null) return '—'
  return `${Math.round(ms * 3.6)} km/h`
}

export function formatVerticalRate(ms: number | null): string {
  if (ms === null) return '—'
  const fpm = Math.round(ms * 196.85)
  const sign = fpm > 0 ? '+' : ''
  return `${sign}${fpm.toLocaleString()} fpm`
}

export function formatTimestamp(unix: number | null): string {
  if (!unix) return '—'
  return new Date(unix * 1000).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function formatTimeSince(unix: number | null): string {
  if (!unix) return '—'
  const seconds = Math.floor(Date.now() / 1000 - unix)
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  return `${Math.floor(seconds / 3600)}h`
}

export function getAircraftColor(aircraft: Aircraft, selected: boolean): string {
  if (selected) return '#00ffcc'
  if (aircraft.on_ground) return '#888888'
  if (aircraft.is_climbing) return '#00d4ff'
  if (aircraft.is_descending) return '#ff8800'
  return '#ffffff'
}

export function getVerticalRateIcon(aircraft: Aircraft): string {
  if (aircraft.is_climbing) return '↑'
  if (aircraft.is_descending) return '↓'
  return '→'
}

export function positionSourceName(source: number | null): string {
  const map: Record<number, string> = {
    0: 'ADS-B',
    1: 'ASTERIX',
    2: 'MLAT',
    3: 'FLARM',
  }
  return source !== null ? (map[source] ?? 'Unknown') : '—'
}
