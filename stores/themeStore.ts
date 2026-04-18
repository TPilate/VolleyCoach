import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // State
  const isDark = ref<boolean>(false)

  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    if (process.client) {
      // Check localStorage first
      const saved = localStorage.getItem('theme')
      if (saved) {
        isDark.value = saved === 'dark'
      } else {
        // Check system preference
        isDark.value =
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      applyTheme()
    }
  }

  // Apply theme to document
  const applyTheme = () => {
    if (process.client) {
      const html = document.documentElement
      if (isDark.value) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
  }

  // Set specific theme
  const setTheme = (theme: 'light' | 'dark') => {
    isDark.value = theme === 'dark'
    applyTheme()
  }

  // Watch for system preference changes
  const watchSystemPreference = () => {
    if (process.client && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
          isDark.value = e.matches
          applyTheme()
        }
      }
      mediaQuery.addEventListener('change', handleChange)

      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }

  return {
    isDark,
    initializeTheme,
    toggleTheme,
    setTheme,
    watchSystemPreference,
  }
})
