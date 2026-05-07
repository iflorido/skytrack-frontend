import { useEffect } from 'react'
import { useThemeStore } from '../stores/themeStore'

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'nasa') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return { theme, toggleTheme, setTheme }
}
