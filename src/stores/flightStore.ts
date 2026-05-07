import { create } from 'zustand'
import { Aircraft, ConnectionStatus, Filters, GlobalStats } from '../types'

interface FlightStore {
  aircraft: Map<string, Aircraft>
  selectedIcao: string | null
  lastUpdate: number | null
  stats: GlobalStats | null
  connectionStatus: ConnectionStatus
  pollInterval: number
  filters: Filters
  filteredAircraft: Aircraft[]

  setAircraft: (aircraft: Aircraft[]) => void
  selectAircraft: (icao24: string | null) => void
  setConnectionStatus: (status: ConnectionStatus) => void
  setStats: (stats: GlobalStats) => void
  updateFilters: (filters: Partial<Filters>) => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: Filters = {
  onGround: null,
  minAltitude: null,
  maxAltitude: null,
  country: null,
  callsign: null,
  categories: [],
}

function applyFilters(aircraft: Aircraft[], filters: Filters): Aircraft[] {
  return aircraft.filter((a: Aircraft) => {
    if (filters.onGround !== null && a.on_ground !== filters.onGround) return false
    if (filters.minAltitude !== null && (a.baro_altitude ?? 0) < filters.minAltitude) return false
    if (filters.maxAltitude !== null && (a.baro_altitude ?? 0) > filters.maxAltitude) return false
    if (filters.country && !a.origin_country?.toLowerCase().includes(filters.country.toLowerCase())) return false
    if (filters.callsign && !a.callsign?.toUpperCase().includes(filters.callsign.toUpperCase())) return false
    if (filters.categories.length > 0 && !filters.categories.includes(a.category ?? 0)) return false
    return true
  })
}

export const useFlightStore = create<FlightStore>((set, get) => ({
  aircraft: new Map(),
  selectedIcao: null,
  lastUpdate: null,
  stats: null,
  connectionStatus: 'connecting',
  pollInterval: 150,
  filters: DEFAULT_FILTERS,
  filteredAircraft: [],

  setAircraft: (aircraftList: Aircraft[]) => {
    const map = new Map<string, Aircraft>()
    aircraftList.forEach((a: Aircraft) => map.set(a.icao24, a))
    const filtered = applyFilters(aircraftList, get().filters)
    set({ aircraft: map, filteredAircraft: filtered, lastUpdate: Date.now() })
  },

  selectAircraft: (icao24: string | null) => set({ selectedIcao: icao24 }),

  setConnectionStatus: (status: ConnectionStatus) => set({ connectionStatus: status }),

  setStats: (stats: GlobalStats) => set({ stats, pollInterval: stats.poll_interval_seconds }),

  updateFilters: (partial: Partial<Filters>) => {
    const filters = { ...get().filters, ...partial }
    const aircraftList = Array.from(get().aircraft.values())
    const filtered = applyFilters(aircraftList, filters)
    set({ filters, filteredAircraft: filtered })
  },

  resetFilters: () => {
    const aircraftList = Array.from(get().aircraft.values())
    set({ filters: DEFAULT_FILTERS, filteredAircraft: aircraftList })
  },
}))