import { create } from 'zustand'
import { PanelId, PanelState } from '../types'

interface PanelStore {
  panels: Record<PanelId, PanelState>
  togglePanel: (id: PanelId) => void
  movePanel: (id: PanelId, position: { x: number; y: number }) => void
  minimizePanel: (id: PanelId) => void
  openPanel: (id: PanelId) => void
}

const DEFAULT_POSITIONS: Record<PanelId, { x: number; y: number }> = {
  stats:        { x: 16, y: 8 },
  filters:      { x: 320, y: 448 },
  flightList:   { x: 3320, y: 9 },
  flightDetail: { x: 16, y: 405 },
}

function makePanel(id: PanelId, open: boolean): PanelState {
  return { id, open, position: DEFAULT_POSITIONS[id], minimized: false }
}

export const usePanelStore = create<PanelStore>((set) => ({
  panels: {
    stats:        makePanel('stats', true),
    flightList:   makePanel('flightList', true),
    flightDetail: makePanel('flightDetail', false),
    filters:      makePanel('filters', false),
  },

  togglePanel: (id) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [id]: { ...state.panels[id], open: !state.panels[id].open, minimized: false },
      },
    })),

  openPanel: (id) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [id]: { ...state.panels[id], open: true, minimized: false },
      },
    })),

  movePanel: (id, position) =>
    set((state) => ({
      panels: { ...state.panels, [id]: { ...state.panels[id], position } },
    })),

  minimizePanel: (id) =>
    set((state) => ({
      panels: {
        ...state.panels,
        [id]: { ...state.panels[id], minimized: !state.panels[id].minimized },
      },
    })),
}))