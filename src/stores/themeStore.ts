import { create } from 'zustand'
import { Theme } from '../types'

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: 'nasa',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'nasa' ? 'light' : 'nasa' })),
  setTheme: (theme) => set({ theme }),
}))